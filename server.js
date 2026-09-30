// OceanCanvas — Tech Stack 2 (Node + Express + node:sqlite + vanilla JS)
// Server-side proxy to OpenAI-compatible image relays (Grok Imagine + GPT Image).
// Relay API keys are NEVER exposed to the browser (AES-256-GCM in SQLite).
// Key management lives behind a password-protected admin panel (/admin).
"use strict";
const express = require("express");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const store = require("./src/store");

const app = express();
const PORT = process.env.PORT || 3016;
app.use(express.json({ limit: "1mb" }));

const DEFAULT_BASES = {
  1: "https://sapi.zly168.cn/v1",
  2: "https://api.relaymodels.com/v1",
};
const PROVIDER_NAMES = { 1: "Grok Relay", 2: "RelayModels" };
// Policy: image generation is ONLY allowed through approved relays (allowlist).
// Any other relay base is refused with RELAY_NOT_APPROVED.
// EXTRA_APPROVED_RELAYS (comma-separated, lowercase) lets the operator extend
// the list via env without a code change (also used for local testing).
const APPROVED_RELAYS = [
  "https://sapi.zly168.cn/v1",
  "https://api.relaymodels.com/v1",
  ...String(process.env.EXTRA_APPROVED_RELAYS || "")
    .split(",").map((s) => s.trim().toLowerCase().replace(/\/+$/, "")).filter(Boolean),
];
const FALLBACK_IMAGE_MODELS = {
  1: ["grok-imagine-image-2.0", "grok-imagine-image"],
  2: ["gpt-image-2"],
};
const ASPECT_SIZES = {
  square: "1024x1024",
  portrait: "768x1152",
  landscape: "1152x768",
  wide: "1344x768",
};
// Style presets: suffix appended to the user's prompt (validated allowlist).
const STYLES = {
  none: "",
  photo: ", photorealistic, ultra detailed, 8k, professional photography",
  anime: ", anime style, vibrant, detailed anime illustration, studio quality",
  digital: ", digital art, intricate details, vivid colors, artstation trending",
  cinematic: ", cinematic lighting, dramatic composition, film still, moody atmosphere",
  render3d: ", 3d render, octane render, soft studio lighting, highly detailed",
  watercolor: ", watercolor painting, soft brush strokes, artistic, delicate",
  cyberpunk: ", cyberpunk style, neon lights, futuristic, high contrast",
  oilpaint: ", oil painting, textured brushwork, classical art style, rich colors",
  minimal: ", minimalist, clean composition, soft colors, elegant, negative space",
};
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const RATE_LIMIT_PER_HOUR = parseInt(process.env.RATE_LIMIT_PER_HOUR || "30", 10);
const IMAGE_DAILY_LIMIT = parseInt(process.env.IMAGE_DAILY_LIMIT || "20", 10);
const PROMPT_RATE_LIMIT_PER_HOUR = parseInt(process.env.PROMPT_RATE_LIMIT_PER_HOUR || "30", 10);
// LLM used by the Prompt Studio (via RelayModels). Falls back down the list on error.
const PROMPT_LLM = process.env.PROMPT_LLM || "gpt-5.4-mini";
const PROMPT_LLM_FALLBACKS = ["deepseek-v4-flash", "gemini-3.8-flash"];
// Prompt Studio categories: id -> English style focus for the LLM.
const PROMPT_CATS = {
  photo: "photorealistic photography",
  art: "fine-art illustration",
  anime: "anime illustration",
  landscape: "breathtaking landscape photography",
  portrait: "portrait photography",
  product: "studio product photography",
  fantasy: "epic fantasy digital art",
  architecture: "architecture photography",
  food: "appetizing food photography",
  game: "game concept art",
  logo: "minimalist logo design, vector style, clean iconic mark",
  poster: "poster design, bold layout with striking typography",
  icon: "app icon design, simple flat vector icon, rounded square",
};

// ---------- providers ----------
function providerBase(n) {
  const k = n === 2 ? "relay_base2" : "relay_base";
  return String(store.getSetting(k) || DEFAULT_BASES[n]).trim().replace(/\/+$/, "");
}
function providerKey(n) {
  return store.getSecret(n === 2 ? "relay_key2" : "relay_key");
}
function isApproved(base) {
  return APPROVED_RELAYS.includes(String(base || "").toLowerCase());
}
// A provider is usable only when it has a key AND its base is approved.
function providerStatus(n) {
  const base = providerBase(n);
  const key = providerKey(n);
  return { n, name: PROVIDER_NAMES[n], base, approved: isApproved(base), keyConfigured: !!key, active: !!key && isApproved(base) };
}

async function relayCall(base, key, path_, { method = "GET", body = null } = {}) {
  const r = await fetch(base + path_, {
    method,
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(180000),
  });
  const text = await r.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: String(text).slice(0, 500) };
  }
  if (!r.ok) {
    const e = new Error((data && data.error && (data.error.message || data.error)) || "Relay error " + r.status);
    e.status = r.status;
    throw e;
  }
  return data;
}

function isImageModel(id) {
  const s = String(id).toLowerCase();
  return /image|imagen|dall|flux|banana|midjourney|sd-|sdxl/.test(s) && !/video/.test(s);
}

// modelId -> provider number, refreshed from each active relay's /models (10-min TTL).
let modelMapCache = { ts: 0, map: new Map() };
const MODEL_MAP_TTL = 10 * 60e3;
async function refreshModelMap() {
  const map = new Map();
  await Promise.all([1, 2].map(async (n) => {
    const st = providerStatus(n);
    if (!st.active) return;
    try {
      const data = await relayCall(st.base, providerKey(n), "/models", {});
      const ids = (data.data || []).map((m) => m.id).filter(isImageModel);
      (ids.length ? ids : FALLBACK_IMAGE_MODELS[n]).forEach((id) => { if (!map.has(id)) map.set(id, n); });
    } catch (e) {
      console.warn(`[models] provider ${n} unreachable, using fallback models:`, e.message);
      FALLBACK_IMAGE_MODELS[n].forEach((id) => { if (!map.has(id)) map.set(id, n); });
    }
  }));
  modelMapCache = { ts: Date.now(), map };
}
async function routeForModel(modelId) {
  if (Date.now() - modelMapCache.ts > MODEL_MAP_TTL) await refreshModelMap();
  const n = modelMapCache.map.get(modelId);
  const order = n ? [n, ...[1, 2].filter((x) => x !== n)] : [1, 2];
  for (const m of order) {
    const st = providerStatus(m);
    if (st.active) return { n: m, name: st.name, base: st.base, key: providerKey(m) };
  }
  const e = new Error("No relay API key configured — ask the admin to add one.");
  e.status = 400;
  e.code = "NO_KEY";
  throw e;
}
// Image generation is pinned to gpt-image-2 on RelayModels (provider 2).
const IMAGE_MODEL = "gpt-image-2";
// BYO key: each visitor uses their OWN RelayModels key (sent per request, never stored
// server-side). Falls back to the admin's server key only when no user key is supplied.
function userKey(req) {
  const h = req.headers["x-user-key"];
  const b = req.body && req.body.userKey;
  return String(h || b || "").trim();
}
function requireUserKey(req) {
  const k = userKey(req);
  if (!k) {
    const e = new Error("Add your own RelayModels API key to use this feature.");
    e.status = 401;
    e.code = "NO_USER_KEY";
    throw e;
  }
  return k;
}
// Map relay auth failures to a friendly code the frontend can act on.
function sendRelayError(res, e) {
  if (e.status === 401 && e.code !== "NO_USER_KEY") {
    return res.status(401).json({ ok: false, error: "INVALID_KEY", message: "The relay rejected this API key — check it and try again." });
  }
  res.status(e.status || 500).json({ ok: false, error: e.code || e.message, message: e.message });
}
function imageProvider(userApiKey) {
  const base = providerBase(2);
  if (!isApproved(base)) {
    const e = new Error("Relay not approved");
    e.status = 400;
    throw e;
  }
  const key = userApiKey || providerKey(2);
  if (!key) return requireUserKey({ headers: {}, body: {} }); // throws NO_USER_KEY
  return { base, key };
}
// Call a chat LLM on RelayModels with fallbacks (for the Prompt Studio).
// modelList overrides the default [PROMPT_LLM, ...fallbacks] order.
// apiKey is the visitor's own key (BYO); falls back to the server key.
async function chatCompleteRaw(messages, maxTokens, modelList, apiKey) {
  const base = providerBase(2);
  if (!isApproved(base)) {
    const e = new Error("Relay not approved");
    e.status = 400;
    throw e;
  }
  const key = apiKey || providerKey(2);
  if (!key) {
    const e = new Error("Add your own RelayModels API key to use this feature.");
    e.status = 401;
    e.code = "NO_USER_KEY";
    throw e;
  }
  const models = (modelList && modelList.length ? modelList : [PROMPT_LLM, ...PROMPT_LLM_FALLBACKS]);
  let lastErr = null;
  for (const model of models) {
    try {
      const data = await relayCall(base, key, "/chat/completions", {
        method: "POST",
        body: { model, messages, max_tokens: maxTokens || 400, temperature: 0.8 },
      });
      const ch = data && data.choices && data.choices[0];
      const text = ch && ch.message && ch.message.content;
      if (text && String(text).trim()) return { text: String(text).trim(), finishReason: ch.finish_reason || null, model };
      throw new Error("empty LLM response");
    } catch (e) {
      lastErr = e;
      console.warn(`[prompt-gen] LLM ${model} failed:`, e.message);
    }
  }
  throw lastErr || new Error("LLM unavailable");
}

async function chatComplete(messages, maxTokens, modelList, apiKey) {
  const r = await chatCompleteRaw(messages, maxTokens, modelList, apiKey);
  return r.text;
}

// If the model was cut off mid-prompt by the token limit (finish_reason "length"),
// ask it to continue from exactly where it stopped, then stitch the parts together.
async function completePrompt(messages, maxTok, tryModels, apiKey) {
  const first = await chatCompleteRaw(messages, maxTok, tryModels, apiKey);
  let raw = first.text;
  if (first.finishReason === "length" && raw) {
    try {
      const cont = await chatCompleteRaw(
        [...messages,
          { role: "assistant", content: raw },
          { role: "user", content: "Continue from exactly where you stopped — output ONLY the continuation, no preamble, no repetition, and finish with a complete sentence." }],
        Math.ceil(maxTok * 1.5),
        tryModels,
        apiKey
      );
      if (cont.text) raw = (raw + " " + cont.text).trim();
    } catch (e) {
      console.warn("[prompt-gen] continuation failed:", e.message);
    }
  }
  return raw;
}
// Chat-capable models on RelayModels for the Prompt Studio picker (10-min cache).
let chatModelsCache = { ts: 0, models: [] };
const CHAT_MODELS_TTL = 10 * 60e3;
function isChatModel(id) {
  const s = String(id).toLowerCase();
  return !/image|imagen|dall|flux|midjourney|sd-|sdxl|video|tts|whisper|embed|moderation|sora|audio/.test(s);
}
async function getChatModels(apiKey) {
  if (Date.now() - chatModelsCache.ts < CHAT_MODELS_TTL && chatModelsCache.models.length) {
    return chatModelsCache.models;
  }
  const base = providerBase(2);
  const key = apiKey || providerKey(2);
  let ids = [];
  if (key && isApproved(base)) {
    try {
      const data = await relayCall(base, key, "/models", {});
      ids = (data.data || []).map((m) => m.id).filter(isChatModel);
    } catch (e) {
      console.warn("[prompt-models] relay unreachable:", e.message);
    }
  }
  if (!ids.length) ids = [PROMPT_LLM, ...PROMPT_LLM_FALLBACKS];
  const pref = [PROMPT_LLM, ...PROMPT_LLM_FALLBACKS];
  const rest = ids.filter((x) => !pref.includes(x)).sort();
  chatModelsCache = { ts: Date.now(), models: [...pref.filter((x) => ids.includes(x)), ...rest] };
  return chatModelsCache.models;
}
// gpt-image models only accept 1024x1024 / 1536x1024 / 1024x1536 — map aspects accordingly.
function sizeFor(model, aspect) {
  if (/gpt-image/i.test(String(model))) {
    if (aspect === "portrait") return "1024x1536";
    if (aspect === "landscape" || aspect === "wide") return "1536x1024";
    return "1024x1024";
  }
  return ASPECT_SIZES[aspect] ? ASPECT_SIZES[aspect] : "1024x1024";
}

// ---------- admin auth (HMAC cookie, no extra deps) ----------
function adminSecret() {
  return crypto.createHash("sha256").update("ris-admin|" + (process.env.APP_SECRET || "dev") + "|" + ADMIN_PASSWORD).digest();
}
function signAdmin(exp) {
  const h = crypto.createHmac("sha256", adminSecret()).update("ris-admin:" + exp).digest("hex");
  return exp + "." + h;
}
function verifyAdmin(cookieHeader) {
  if (!ADMIN_PASSWORD) return false;
  const m = /ris_admin=([^;]+)/.exec(cookieHeader || "");
  if (!m) return false;
  const [exp, sig] = String(m[1]).split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const good = signAdmin(exp).split(".")[1];
  try {
    if (sig.length !== good.length) return false;
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good));
  } catch {
    return false;
  }
}
function requireAdmin(req, res, next) {
  if (!ADMIN_PASSWORD) return res.status(503).json({ ok: false, error: "ADMIN_DISABLED" });
  if (!verifyAdmin(req.headers.cookie)) return res.status(401).json({ ok: false, error: "ADMIN_AUTH" });
  next();
}
function maskKey(k) {
  if (!k) return "";
  const s = String(k);
  return s.length <= 8 ? "••••••••" : s.slice(0, 3) + "••••••••" + s.slice(-4);
}

// ---------- rate limiting (in-memory, per IP) ----------
function makeHourLimiter() {
  const buckets = new Map(); // ip -> [timestamps]
  setInterval(() => {
    const cutoff = Date.now() - 3600e3;
    for (const [ip, arr] of buckets) {
      const kept = arr.filter((t) => t > cutoff);
      if (kept.length) buckets.set(ip, kept);
      else buckets.delete(ip);
    }
  }, 5 * 60e3).unref();
  return (ip, limit) => {
    const now = Date.now();
    const cutoff = now - 3600e3;
    const arr = (buckets.get(ip) || []).filter((t) => t > cutoff);
    if (arr.length >= limit) return true;
    arr.push(now);
    buckets.set(ip, arr);
    return false;
  };
}
const imageHourLimiter = makeHourLimiter();
const promptHourLimiter = makeHourLimiter();
// Daily image cap per IP (fair use for public visitors).
const dayBuckets = new Map(); // ip -> { day, count }
setInterval(() => {
  const today = new Date().toISOString().slice(0, 10);
  for (const [ip, rec] of dayBuckets) if (rec.day !== today) dayBuckets.delete(ip);
}, 30 * 60e3).unref();
function imageDailyLimited(ip) {
  const today = new Date().toISOString().slice(0, 10);
  const rec = dayBuckets.get(ip);
  if (!rec || rec.day !== today) { dayBuckets.set(ip, { day: today, count: 1 }); return false; }
  if (rec.count >= IMAGE_DAILY_LIMIT) return true;
  rec.count++;
  return false;
}
function clientIp(req) {
  return (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().split(",")[0].trim();
}

// ---------- image download helper ----------
async function downloadRemote(remoteUrl) {
  let buf;
  if (String(remoteUrl).startsWith("data:")) {
    buf = Buffer.from(String(remoteUrl).split(",")[1] || "", "base64");
  } else {
    const r = await fetch(remoteUrl, { signal: AbortSignal.timeout(120000) });
    if (!r.ok) throw new Error("download failed: " + r.status);
    buf = Buffer.from(await r.arrayBuffer());
  }
  if (!buf.length || buf.length > 12 * 1024 * 1024) throw new Error("bad image file");
  return buf;
}

// ---- public API ----
app.get("/api/health", (req, res) => res.json({ ok: true, service: "relay-image-studio" }));

// Minimal public settings: only whether keys are configured (never keys/bases).
app.get("/api/settings", (req, res) => {
  res.json({ keyConfigured: !!(providerKey(1) || providerKey(2)), adminEnabled: !!ADMIN_PASSWORD });
});

app.get("/api/models", async (req, res) => {
  // Image generation is pinned to gpt-image-2 on RelayModels.
  const st = providerStatus(2);
  res.json({ ok: true, imageModels: [IMAGE_MODEL], model: IMAGE_MODEL, relayActive: st.active });
});

app.get("/api/styles", (req, res) => {
  res.json({ ok: true, styles: Object.keys(STYLES) });
});

app.get("/api/prompt-cats", (req, res) => {
  res.json({ ok: true, cats: Object.keys(PROMPT_CATS) });
});

// Chat models the user can pick for prompt generation.
app.get("/api/prompt-models", async (req, res) => {
  try {
    const models = await getChatModels(userKey(req));
    res.json({ ok: true, models, default: PROMPT_LLM });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Prompt Studio: turn a rough idea into polished image prompts via a chosen LLM on RelayModels.
const PROMPT_LENGTHS = {
  short: { words: "25-40", tokens: 400, tokensMy: 1200 },
  medium: { words: "40-70", tokens: 700, tokensMy: 1800 },
  detailed: { words: "70-120", tokens: 1200, tokensMy: 2600 },
};
app.post("/api/prompt-gen", async (req, res) => {
  try {
    const ip = clientIp(req);
    if (promptHourLimiter(ip, PROMPT_RATE_LIMIT_PER_HOUR)) {
      return res.status(429).json({ ok: false, error: "RATE_LIMIT", message: `Too many requests — limit ${PROMPT_RATE_LIMIT_PER_HOUR}/hour. Please wait a bit.` });
    }
    const apiKey = requireUserKey(req);
    const { idea, category, model, length, variants, lang } = req.body || {};
    const id = String(idea || "").trim();
    if (!id) return res.status(400).json({ ok: false, error: "Idea is required" });
    if (id.length > 500) return res.status(400).json({ ok: false, error: "Idea too long (max 500 chars)" });
    const cat = PROMPT_CATS[category] ? category : "photo";
    const len = PROMPT_LENGTHS[length] ? length : "medium";
    const n = Math.min(3, Math.max(1, parseInt(variants, 10) || 1));
    const outLang = lang === "my" ? "my" : "en";
    const chatModels = await getChatModels(apiKey);
    const chosen = chatModels.includes(model) ? model : PROMPT_LLM;
    const tryModels = [chosen, ...PROMPT_LLM_FALLBACKS.filter((m) => m !== chosen && chatModels.includes(m))];
    const langName = outLang === "my" ? "BURMESE (Myanmar language)" : "ENGLISH";
    const system = "You are an expert prompt engineer for AI image generators (GPT Image / DALL-E style). " +
      "Write image-generation prompts in " + langName + " based on the user's idea below. " +
      "Category focus: " + PROMPT_CATS[cat] + ". " +
      "Rules: output ONLY the prompt text — no quotes, no preamble, no explanation, no bullet points, no numbering. " +
      "Always finish with a complete sentence — never cut off mid-word or mid-sentence. " +
      PROMPT_LENGTHS[len].words + " words. Vivid visual details: subject, setting, lighting, colors, mood, composition, style. " +
      "The user's idea may be in Burmese — understand it and render the prompt in " + langName + ".";
    const prompts = [];
    const maxTok = outLang === "my" ? PROMPT_LENGTHS[len].tokensMy : PROMPT_LENGTHS[len].tokens;
    for (let i = 0; i < n; i++) {
      const extra = n > 1 ? " (variation " + (i + 1) + " of " + n + " — make this one distinctly different in composition and mood)" : "";
      const raw = await completePrompt(
        [{ role: "system", content: system }, { role: "user", content: id + extra }],
        maxTok,
        tryModels,
        apiKey
      );
      const clean = raw.replace(/^["'“”]+|["'“”]+$/g, "").replace(/^(prompt\s*:\s*)/i, "").trim();
      if (clean && !prompts.includes(clean)) prompts.push(clean);
    }
    if (!prompts.length) throw new Error("LLM returned no usable prompt");
    res.json({ ok: true, prompts, category: cat, model: chosen, length: len, lang: outLang });
  } catch (e) {
    sendRelayError(res, e);
  }
});

app.post("/api/generate", async (req, res) => {
  try {
    const ip = clientIp(req);
    if (imageHourLimiter(ip, RATE_LIMIT_PER_HOUR)) {
      return res.status(429).json({ ok: false, error: "RATE_LIMIT", message: `Too many requests — limit ${RATE_LIMIT_PER_HOUR}/hour. Please wait a bit.` });
    }
    if (imageDailyLimited(ip)) {
      return res.status(429).json({ ok: false, error: "DAILY_LIMIT", message: `Daily image limit reached (${IMAGE_DAILY_LIMIT}/day). Please come back tomorrow.` });
    }
    const apiKey = requireUserKey(req);
    const { prompt, aspect, style, count } = req.body || {};
    const p = String(prompt || "").trim();
    if (!p) return res.status(400).json({ ok: false, error: "Prompt is required" });
    if (p.length > 2000) return res.status(400).json({ ok: false, error: "Prompt too long (max 2000 chars)" });
    const m = IMAGE_MODEL; // pinned: gpt-image-2 only
    const a = ASPECT_SIZES[aspect] ? aspect : "square";
    const s = STYLES[style] !== undefined ? style : "none";
    const n = Math.min(4, Math.max(1, parseInt(count, 10) || 1));
    const fullPrompt = (p + STYLES[s]).slice(0, 2000);
    const prov = imageProvider(apiKey);
    const size = sizeFor(m, a);

    const results = await Promise.all(
      Array.from({ length: n }, async (_, i) => {
        const data = await relayCall(prov.base, prov.key, "/images/generations", {
          method: "POST",
          body: { model: m, prompt: fullPrompt, size },
        });
        const item = data && data.data && data.data[0];
        let buf = null;
        let remoteUrl = null;
        if (item && item.b64_json) {
          buf = Buffer.from(String(item.b64_json), "base64");
        } else if (item && item.url) {
          remoteUrl = String(item.url);
        }
        if ((!buf || !buf.length) && !remoteUrl) throw new Error("Relay returned no image");
        if (buf && buf.length > 12 * 1024 * 1024) throw new Error("bad image file");
        // Privacy: NOTHING is stored on the VPS (user request 2026-09-30).
        // The image is returned as a data URL — it lives only in the visitor's browser.
        let url;
        try {
          if (!buf) buf = await downloadRemote(remoteUrl);
          const mime = buf[0] === 0x89 && buf[1] === 0x50 ? "image/png" : "image/jpeg";
          url = `data:${mime};base64,` + buf.toString("base64");
        } catch (dlErr) {
          url = String(remoteUrl || "").slice(0, 500); // last-resort: relay-hosted URL, still nothing saved locally
        }
        const id = "g" + Date.now().toString(36) + i.toString(36) + Math.random().toString(36).slice(2, 8);
        return { id, url, prompt: p, model: m, aspect: a, style: s };
      })
    );
    res.json({ ok: true, images: results });
  } catch (e) {
    sendRelayError(res, e);
  }
});

// Gallery removed — images are never stored on the server (user request 2026-09-30).
app.get("/api/gallery", (req, res) => {
  res.json({ ok: true, images: [] });
});

// ---- admin API ----
app.post("/api/admin/login", express.json({ limit: "1mb" }), (req, res) => {
  if (!ADMIN_PASSWORD) return res.status(503).json({ ok: false, error: "ADMIN_DISABLED" });
  const pw = String((req.body || {}).password || "");
  const ok = pw.length > 0 && pw.length === ADMIN_PASSWORD.length && crypto.timingSafeEqual(Buffer.from(pw), Buffer.from(ADMIN_PASSWORD));
  if (!ok) return res.status(401).json({ ok: false, error: "WRONG_PASSWORD" });
  const exp = Date.now() + 24 * 3600e3;
  res.setHeader("Set-Cookie", `ris_admin=${signAdmin(exp)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
  res.json({ ok: true });
});

app.post("/api/admin/logout", (req, res) => {
  res.setHeader("Set-Cookie", "ris_admin=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
  res.json({ ok: true });
});

app.get("/api/admin/me", (req, res) => {
  if (!ADMIN_PASSWORD) return res.status(503).json({ ok: false, error: "ADMIN_DISABLED" });
  if (!verifyAdmin(req.headers.cookie)) return res.status(401).json({ ok: false, error: "ADMIN_AUTH" });
  res.json({ ok: true, admin: true });
});

app.get("/api/admin/settings", requireAdmin, (req, res) => {
  const relays = [providerStatus(1), providerStatus(2)].map((p) => ({
    n: p.n, name: p.name, base: p.base, approved: p.approved,
    keyConfigured: p.keyConfigured, keyMasked: maskKey(providerKey(p.n)),
  }));
  res.json({ ok: true, relays });
});

app.post("/api/admin/settings", requireAdmin, (req, res) => {
  const { base, apiKey, base2, apiKey2 } = req.body || {};
  if (base && typeof base === "string" && base.trim()) {
    store.setSetting("relay_base", base.trim().replace(/\/+$/, ""));
  }
  if (apiKey && typeof apiKey === "string" && apiKey.trim()) {
    store.setSecret("relay_key", apiKey.trim());
  }
  if (base2 && typeof base2 === "string" && base2.trim()) {
    store.setSetting("relay_base2", base2.trim().replace(/\/+$/, ""));
  }
  if (apiKey2 && typeof apiKey2 === "string" && apiKey2.trim()) {
    store.setSecret("relay_key2", apiKey2.trim());
  }
  // A changed config invalidates the cached model map.
  modelMapCache = { ts: 0, map: new Map() };
  const relays = [providerStatus(1), providerStatus(2)].map((p) => ({
    n: p.n, name: p.name, base: p.base, approved: p.approved,
    keyConfigured: p.keyConfigured, keyMasked: maskKey(providerKey(p.n)),
  }));
  res.json({ ok: true, relays });
});

app.post("/api/admin/test", requireAdmin, async (req, res) => {
  const out = [];
  for (const n of [1, 2]) {
    const st = providerStatus(n);
    if (!st.active) {
      out.push({ n, name: st.name, ok: false, error: !providerKey(n) ? "NO_KEY" : "RELAY_NOT_APPROVED" });
      continue;
    }
    try {
      const data = await relayCall(st.base, providerKey(n), "/models", {});
      const ids = (data.data || []).map((m) => m.id);
      out.push({ n, name: st.name, ok: true, models: ids.length, imageModels: ids.filter(isImageModel) });
    } catch (e) {
      out.push({ n, name: st.name, ok: false, error: e.message });
    }
  }
  // A successful test refreshes the cached model map.
  modelMapCache = { ts: 0, map: new Map() };
  res.json({ ok: true, relays: out });
});

app.get("/api/admin/stats", requireAdmin, (req, res) => {
  res.json({
    ok: true,
    total: store.countImages(),
    today: store.countImagesToday(),
    galleryMB: store.galleryBytes(),
    rateLimitPerHour: RATE_LIMIT_PER_HOUR,
  });
});

app.post("/api/admin/gallery/clear", requireAdmin, (req, res) => {
  const n = store.clearImages();
  res.json({ ok: true, deleted: n });
});

app.delete("/api/gallery/:id", requireAdmin, (req, res) => {
  const ok = store.deleteImage(Number(req.params.id));
  res.json({ ok });
});

// ---- static ----
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "public", "admin.html")));
app.use("/img", express.static(store.IMG_DIR, { maxAge: "7d", immutable: false }));
app.use(express.static(path.join(__dirname, "public")));

// Log crashes instead of dying silently (PM2 captures stdout/stderr)
process.on("uncaughtException", (e) => console.error("[fatal] uncaughtException:", e));
process.on("unhandledRejection", (e) => console.error("[fatal] unhandledRejection:", e));

app.listen(PORT, () => {
  console.log(`OceanCanvas listening on port ${PORT} (admin ${ADMIN_PASSWORD ? "enabled" : "DISABLED — set ADMIN_PASSWORD"})`);
});
