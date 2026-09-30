// OceanCanvas frontend v5 — bilingual (my/en), full studio options.
"use strict";

const I18N = {
  my: {
    title: "OceanCanvas",
    heroA: "စိတ်ကူးကို", heroB: "ပုံအဖြစ်", heroC: "ဖန်တီးလိုက်ပါ",
    heroSub: "AI Prompt Studio + ပုံထုတ်စက် — Prompt အလှဖန်တီးပြီး GPT Image 2 နဲ့ စက္ကန့်ပိုင်းအတွင်း ပုံထုတ်လိုက်ပါ",
    tabImage: "🖼️ ပုံထုတ်ရန်", tabPrompt: "✨ Prompt ဖန်တီးရန်",
    promptLabel: "✏️ ပုံဖော်ပြချက် (Prompt)",
    promptPh: "ဥပမာ — လရောင်အောက်က ရွှေတိဂုံစေတီ, cinematic lighting",
    modelBadgeDesc: "OpenAI GPT Image 2",
    aspectLabel: "📐 အချိုးအစား", styleLabel: "🎭 စတိုင်",
    countLabel: "ပုံအရေအတွက်", generate: "ပုံထုတ်ရန်",
    publicNote: "🔑 ကိုယ့် RelayModels API key ထည့်ပြီးမှ သုံးနိုင်ပါတယ်",
    pgIdeaLabel: "💡 စိတ်ကူး",
    pgIdeaPh: "ဥပမာ — ရွှေတိဂုံစေတီ နေဝင်ချိန်, မီးပုံးပျံတွေ…",
    pgCatLabel: "🗂️ အမျိုးအစား", pgGenerate: "Prompt ထုတ်ရန်",
    pgModelLabel: "🤖 AI Model (Prompt ထုတ်မယ့် မော်ဒယ်)",
    pgModelsLoading: "Model စာရင်း ရယူနေတယ်…",
    pgLenLabel: "📏 Prompt အရှည်",
    lenShort: "အတို", lenMedium: "အလတ်", lenLong: "အရှည်",
    pgVarLabel: "🔢 ရွေးချယ်စရာ အရေအတွက်",
    pgLangLabel: "🗣️ Prompt ဘာသာစကား",
    pgLangHint: "💡 မြန်မာလို အကောင်းဆုံးရဖို့ claude-sonnet-5 လို model ကြီးရွေးပါ",
    langEnName: "English", langMyName: "မြန်မာ",
    pgResultLabel: "✨ ရလာတဲ့ Prompt များ",
    pgCopy: "📋 ကူးယူရန်", pgUse: "🖼️ ဒီ Prompt နဲ့ ပုံထုတ်ရန်",
    pgRecent: "🕘 နောက်ဆုံးထုတ်ထားတာများ",
    pgEmpty: "စိတ်ကူးရေးပြီး ✨ နှိပ်လိုက်ပါ — AI က Prompt အလှလေး ရေးပေးမယ်",
    pgStages: ["စိတ်ကူးကို ဖတ်နေတယ်… 💭", "အသေးစိတ်တွေ ထည့်နေတယ်… 🖌️", "Prompt အချောသတ်နေတယ်… ✨"],
    pgFail: "Prompt ထုတ်တာ မအောင်မြင်ပါ",
    catNames: { photo: "📷 ဓာတ်ပုံ", art: "🎨 ပန်းချီ", anime: "⛩️ Anime", landscape: "🏞️ ရှုခင်း", portrait: "👤 Portrait", product: "🛍️ Product", fantasy: "🐉 Fantasy", architecture: "🏢 အဆောက်အအုံ", food: "🍜 အစားအစာ", game: "🎮 Game Art", logo: "✨ Logo", poster: "🖼️ Poster", icon: "📱 Icon" },
    aSquare: "စတုရန်း 1:1", aPortrait: "ဒေါင်လိုက် 3:4", aLandscape: "အလျားလိုက် 4:3", aWide: "ကျယ် 16:9",
    emptyHint: "Prompt ရေးပြီး ✨ နှိပ်လိုက်ပါ — ပုံတွေ ဒီမှာ ပေါ်လာမယ်",
    loadStages: ["စိတ်ကူးကို ပုံဖော်နေတယ်… 🎨", "အရောင်နဲ့ အလင်းတွေ ထည့်နေတယ်… 💡", "အသေးစိတ်လေးတွေ ဖြည့်နေတယ်… 🔍", "ခဏလေးစောင့်ပါ… ✨"],
    download: "⬇️ သိမ်းရန်", delete: "ဖျက်ရန်", close: "ပိတ်ရန်",
    gallery: "ပုံမှတ်တမ်း", noGallery: "ဓာတ်ပုံမှတ်တမ်း မရှိသေးပါ",
    copied: "Prompt ကူးပြီးပြီ ✓", genFail: "ထုတ်လုပ်မှု မအောင်မြင်ပါ",
    confirmDel: "ဒီပုံကို ဖျက်မှာလား?", foot: "OceanCanvas 🌊 · ပုံတွေကို server မှာ လုံးဝ မသိမ်းပါ",
    rateLimit: "ခဏတာ ပုံထုတ်တာ များနေပါတယ် — ခနစောင့်ပြီး ပြန်နှိပ်ကြည့်ပါ",
    dailyLimit: "တစ်နေ့တာ ပုံထုတ်ခွင့် ကုန်သွားပါပြီ — မနက်ဖြန် ပြန်လာခဲ့ပါ 🌙",
    keyTitle: "API Key",
    keyDesc: "Prompt ထုတ်တာ + ပုံထုတ်တာ သုံးဖို့ ကိုယ့် RelayModels API key ထည့်ပါ",
    keyPh: "sk-...",
    keySave: "သိမ်းပြီး သုံးရန်",
    keyRemove: "Key ဖျက်ရန်",
    keyWhere: "Key ရယူရန်:",
    keyNote: "🔒 Key ကို သင့် browser ထဲမှာပဲ သိမ်းထားပါတယ် — server မှာ မသိမ်းပါ",
    keyRequired: "🔑 API Key ထည့်မှ သုံးနိုင်ပါတယ်",
    keyInvalid: "🔑 API Key မမှန်ပါ — ပြန်စစ်ကြည့်ပါ",
    keySaved: "✓ Key သိမ်းပြီးပြီ",
    keyHas: "🔑 API Key ရှိပြီး ✓ — နှိပ်ပြီး ပြောင်း/ဖျက်နိုင်တယ်",
    keyNeed: "🔑 API Key ထည့်ရန် — နှိပ်ပါ",
    styleNames: { none: "— မရှိ —", photo: "📷 အစစ်အမှန်", anime: "⛩️ အန်နီမဲ", digital: "🖌️ ဒစ်ဂျစ်တယ်", cinematic: "🎬 ရုပ်ရှင်", render3d: "🧊 3D", watercolor: "🎨 ရေဆေး", cyberpunk: "🌃 ဆိုက်ဘာပင့်", oilpaint: "🖼️ ဆီဆေး", minimal: "◻️ ရိုးရှင်း" },
  },
  en: {
    title: "OceanCanvas",
    heroA: "Turn", heroB: "imagination", heroC: "into images",
    heroSub: "AI Prompt Studio + image generator — craft the perfect prompt, then generate with GPT Image 2 in seconds",
    tabImage: "🖼️ Generate Image", tabPrompt: "✨ Prompt Studio",
    promptLabel: "✏️ Prompt",
    promptPh: "e.g. — Shwedagon Pagoda under moonlight, cinematic lighting",
    modelBadgeDesc: "OpenAI GPT Image 2",
    aspectLabel: "📐 Aspect ratio", styleLabel: "🎭 Style",
    countLabel: "Images", generate: "Generate",
    publicNote: "🔑 Add your own RelayModels API key to use this",
    pgIdeaLabel: "💡 Your idea",
    pgIdeaPh: "e.g. — Shwedagon Pagoda at sunset, floating lanterns…",
    pgCatLabel: "🗂️ Category", pgGenerate: "Generate Prompt",
    pgModelLabel: "🤖 AI model (for prompt generation)",
    pgModelsLoading: "Loading models…",
    pgLenLabel: "📏 Prompt length",
    lenShort: "Short", lenMedium: "Medium", lenLong: "Detailed",
    pgVarLabel: "🔢 Number of options",
    pgLangLabel: "🗣️ Prompt language",
    pgLangHint: "💡 For best Burmese results, pick a larger model like claude-sonnet-5",
    langEnName: "English", langMyName: "မြန်မာ",
    pgResultLabel: "✨ Generated prompts",
    pgCopy: "📋 Copy", pgUse: "🖼️ Generate image with this",
    pgRecent: "🕘 Recent prompts",
    pgEmpty: "Write your idea and hit ✨ — AI will craft a polished prompt",
    pgStages: ["Reading your idea… 💭", "Adding rich details… 🖌️", "Polishing the prompt… ✨"],
    pgFail: "Prompt generation failed",
    catNames: { photo: "📷 Photo", art: "🎨 Art", anime: "⛩️ Anime", landscape: "🏞️ Landscape", portrait: "👤 Portrait", product: "🛍️ Product", fantasy: "🐉 Fantasy", architecture: "🏢 Architecture", food: "🍜 Food", game: "🎮 Game Art", logo: "✨ Logo", poster: "🖼️ Poster", icon: "📱 Icon" },
    aSquare: "Square 1:1", aPortrait: "Portrait 3:4", aLandscape: "Landscape 4:3", aWide: "Wide 16:9",
    keyTitle: "API Key",
    keyDesc: "Add your own RelayModels API key to generate prompts and images",
    keyPh: "sk-...",
    keySave: "Save & use",
    keyRemove: "Remove key",
    keyWhere: "Get a key:",
    keyNote: "🔒 Your key is stored only in your browser — never on the server",
    keyRequired: "🔑 Please add your API key first",
    keyInvalid: "🔑 This API key was rejected — please check it",
    keySaved: "✓ Key saved",
    keyHas: "🔑 API key set ✓ — click to change/remove",
    keyNeed: "🔑 Add your API key — click here",
    emptyHint: "Write a prompt and hit ✨ — your images will appear here",
    loadStages: ["Dreaming your image… 🎨", "Painting colors and light… 💡", "Adding fine details… 🔍", "Almost there… ✨"],
    download: "⬇️ Download", delete: "Delete", close: "Close",
    gallery: "Gallery", noGallery: "No images yet",
    copied: "Prompt copied ✓", genFail: "Generation failed",
    confirmDel: "Delete this image?", foot: "OceanCanvas 🌊 · images are never stored on the server",
    rateLimit: "Too many generations right now — wait a bit and try again",
    dailyLimit: "Daily image limit reached — please come back tomorrow 🌙",
    styleNames: { none: "— None —", photo: "📷 Photoreal", anime: "⛩️ Anime", digital: "🖌️ Digital art", cinematic: "🎬 Cinematic", render3d: "🧊 3D render", watercolor: "🎨 Watercolor", cyberpunk: "🌃 Cyberpunk", oilpaint: "🖼️ Oil paint", minimal: "◻️ Minimal" },
  },
};

const EXAMPLES = {
  my: ["🌅 ရွှေတိဂုံစေတီ နေဝင်ချိန်", "🐘 ပုဂံဘုရားများ မြူခိုးထဲမှာ", "🍜 မြန်မာမုန့်ဟင်းခါး, food photography", "🏙️ ရန်ကုန်မြို့ cyberpunk ည", "🌸 သင်္ကြန်မှာ ရေပက်ခံနေတဲ့ ကလေးများ", "🐉 မြန်မာနဂါး, digital art"],
  en: ["🌅 Shwedagon at sunset", "🐘 Bagan temples in mist", "🍜 mohinga, food photography", "🏙️ Yangon cyberpunk night", "🌸 kids at Thingyan water festival", "🐉 Myanmar dragon, digital art"],
};
const IMAGE_MODEL = "gpt-image-2"; // pinned — image gen uses this model only
const PROMPT_CATS = ["photo", "art", "anime", "landscape", "portrait", "product", "fantasy", "architecture", "food", "game", "logo", "poster", "icon"];
const ASPECTS = [
  { id: "square", box: "rb-square", name: "aSquare" },
  { id: "portrait", box: "rb-portrait", name: "aPortrait" },
  { id: "landscape", box: "rb-landscape", name: "aLandscape" },
  { id: "wide", box: "rb-wide", name: "aWide" },
];
const STYLES = ["none", "photo", "anime", "digital", "cinematic", "render3d", "watercolor", "cyberpunk", "oilpaint", "minimal"];

let lang = localStorage.getItem("ris-lang") || "my";
let isAdmin = false;
const state = { aspect: "square", style: "none", count: 1, tab: "image", pgCat: "photo", pgModel: "", pgLen: "medium", pgVars: 1, pgLang: "en" };
const PG_LENS = ["short", "medium", "long"];
const PG_LANGS = ["en", "my"];
const $ = (id) => document.getElementById(id);

function t(k) { return (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k; }

function applyLang() {
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  $("langMy").classList.toggle("active", lang === "my");
  $("langEn").classList.toggle("active", lang === "en");
  document.documentElement.lang = lang;
  renderChips();
  renderPgCats();
  renderPgLen();
  renderPgLang();
  updatePgVars();
  renderAspects();
  renderStyles();
  renderPgRecent();
}

function renderChips() {
  $("exampleChips").innerHTML = "";
  EXAMPLES[lang].forEach((ex) => {
    const b = document.createElement("button");
    b.textContent = ex;
    b.onclick = () => { $("prompt").value = ex.replace(/^[^\s]+\s/, ""); $("prompt").focus(); updateCount(); };
    $("exampleChips").appendChild(b);
  });
}

function renderModels() { /* removed — image gen is pinned to gpt-image-2 */ }

function switchTab(which) {
  state.tab = which;
  $("paneImage").classList.toggle("hidden", which !== "image");
  $("panePrompt").classList.toggle("hidden", which !== "prompt");
  $("tabImage").classList.toggle("sel", which === "image");
  $("tabPrompt").classList.toggle("sel", which === "prompt");
}

function renderPgCats() {
  const wrap = $("pgCats");
  wrap.innerHTML = "";
  PROMPT_CATS.forEach((c) => {
    const b = document.createElement("button");
    b.textContent = t("catNames")[c] || c;
    if (state.pgCat === c) b.classList.add("sel");
    b.onclick = () => { state.pgCat = c; renderPgCats(); };
    wrap.appendChild(b);
  });
}

function renderPgLen() {
  const wrap = $("pgLenChips");
  wrap.innerHTML = "";
  PG_LENS.forEach((l) => {
    const b = document.createElement("button");
    b.textContent = t(l === "short" ? "lenShort" : l === "medium" ? "lenMedium" : "lenLong");
    if (state.pgLen === l) b.classList.add("sel");
    b.onclick = () => { state.pgLen = l; renderPgLen(); };
    wrap.appendChild(b);
  });
}

function renderPgLang() {
  const wrap = $("pgLangChips");
  wrap.innerHTML = "";
  PG_LANGS.forEach((l) => {
    const b = document.createElement("button");
    b.textContent = t(l === "en" ? "langEnName" : "langMyName");
    if (state.pgLang === l) b.classList.add("sel");
    b.onclick = () => { state.pgLang = l; renderPgLang(); };
    wrap.appendChild(b);
  });
  $("pgLangHint").classList.toggle("hidden", state.pgLang !== "my");
}

function updatePgVars() {
  $("pgVarVal").textContent = state.pgVars;
}

// Chat models available for prompt generation (from the server, cached there).
async function loadPromptModels() {
  const sel = $("pgModel");
  try {
    const d = await api("/prompt-models");
    const models = d.models || [];
    sel.innerHTML = "";
    models.forEach((m) => {
      const o = document.createElement("option");
      o.value = m;
      o.textContent = m;
      sel.appendChild(o);
    });
    const def = d.default && models.includes(d.default) ? d.default : models[0];
    if (def) { sel.value = def; state.pgModel = def; }
  } catch {
    // offline fallback: curated list
    const fb = ["gpt-5.4-mini", "deepseek-v4-flash", "gemini-3.8-flash"];
    sel.innerHTML = "";
    fb.forEach((m) => {
      const o = document.createElement("option");
      o.value = m;
      o.textContent = m;
      sel.appendChild(o);
    });
    sel.value = fb[0];
    state.pgModel = fb[0];
  }
}

function toast(msg) {
  let el = $("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 1800);
}

function getPgRecent() {
  try { return JSON.parse(localStorage.getItem("oc-pg-recent") || "[]"); } catch { return []; }
}
function savePgRecent(prompt) {
  const r = [prompt, ...getPgRecent().filter((x) => x !== prompt)].slice(0, 8);
  try { localStorage.setItem("oc-pg-recent", JSON.stringify(r)); } catch { /* ignore */ }
  renderPgRecent();
}
function renderPgRecent() {
  const r = getPgRecent();
  const box = $("pgRecent");
  const wrap = $("pgRecentList");
  box.classList.toggle("hidden", !r.length);
  wrap.innerHTML = "";
  r.forEach((p) => {
    const d = document.createElement("div");
    d.className = "pg-recent-item";
    const s = document.createElement("span");
    s.textContent = p.length > 90 ? p.slice(0, 90) + "…" : p;
    const b = document.createElement("button");
    b.textContent = "↩";
    b.title = t("pgUse");
    b.onclick = () => usePromptForImage(p);
    d.appendChild(s);
    d.appendChild(b);
    wrap.appendChild(d);
  });
}
function usePromptForImage(p) {
  $("prompt").value = p;
  updateCount();
  switchTab("image");
  window.scrollTo({ top: 0, behavior: "smooth" });
  $("prompt").focus();
}

let pgTimer = null;
function setPgLoading(on) {
  $("pgEmpty").classList.toggle("hidden", on);
  $("pgLoading").classList.toggle("hidden", !on);
  $("pgResults").classList.add("hidden");
  $("pgError").classList.add("hidden");
  $("pgGenBtn").disabled = on;
  clearInterval(pgTimer);
  if (on) {
    const stages = t("pgStages");
    let i = 0;
    $("pgLoadingText").textContent = stages[0];
    pgTimer = setInterval(() => {
      i = (i + 1) % stages.length;
      $("pgLoadingText").textContent = stages[i];
    }, 2600);
  }
}
function copyText(txt) {
  const done = () => toast(t("copied"));
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).then(done, () => fallbackCopy(txt, done));
  } else fallbackCopy(txt, done);
}
function showPgResults(prompts) {
  clearInterval(pgTimer);
  $("pgLoading").classList.add("hidden");
  $("pgEmpty").classList.add("hidden");
  $("pgError").classList.add("hidden");
  $("pgGenBtn").disabled = false;
  const list = $("pgResultsList");
  list.innerHTML = "";
  prompts.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "pg-result-card";
    const head = document.createElement("div");
    head.className = "pg-result-head";
    head.textContent = "✨ " + (i + 1);
    const txt = document.createElement("p");
    txt.className = "pg-text";
    txt.textContent = p;
    const acts = document.createElement("div");
    acts.className = "pg-actions";
    const cb = document.createElement("button");
    cb.className = "btn";
    cb.innerHTML = "📋 <span>" + t("pgCopy") + "</span>";
    cb.onclick = () => copyText(p);
    const ub = document.createElement("button");
    ub.className = "btn primary";
    ub.innerHTML = "🖼️ <span>" + t("pgUse") + "</span>";
    ub.onclick = () => usePromptForImage(p);
    acts.appendChild(cb);
    acts.appendChild(ub);
    card.appendChild(head);
    card.appendChild(txt);
    card.appendChild(acts);
    list.appendChild(card);
  });
  $("pgResults").classList.remove("hidden");
}
function showPgError(msg) {
  clearInterval(pgTimer);
  $("pgLoading").classList.add("hidden");
  $("pgEmpty").classList.add("hidden");
  $("pgGenBtn").disabled = false;
  const e = $("pgError");
  e.classList.remove("hidden");
  e.textContent = "⚠️ " + t("pgFail") + ": " + msg;
}
async function genPrompt() {
  const idea = $("pgIdea").value.trim();
  if (!idea) { $("pgIdea").focus(); return; }
  setPgLoading(true);
  try {
    const d = await api("/prompt-gen", {
      method: "POST",
      body: JSON.stringify({
        idea,
        category: state.pgCat,
        model: state.pgModel || undefined,
        length: state.pgLen,
        variants: state.pgVars,
        lang: state.pgLang,
      }),
    });
    if (!d.ok) throw new Error(d.error || "unknown");
    const prompts = d.prompts && d.prompts.length ? d.prompts : [];
    if (!prompts.length) throw new Error("empty");
    showPgResults(prompts);
    prompts.forEach((p) => savePgRecent(p));
  } catch (e) {
    if (e.message === "NO_USER_KEY" || e.message === "INVALID_KEY") { openKeyModal(friendlyErr(e)); return; }
    showPgError(friendlyErr(e));
  }
}

function renderAspects() {
  const wrap = $("aspectGrid");
  wrap.innerHTML = "";
  ASPECTS.forEach((a) => {
    const d = document.createElement("div");
    d.className = "aspect-tile" + (state.aspect === a.id ? " sel" : "");
    d.innerHTML = `<div class="ratio-box ${a.box}"></div><div class="a-name">${t(a.name)}</div>`;
    d.onclick = () => { state.aspect = a.id; renderAspects(); };
    wrap.appendChild(d);
  });
}

function renderStyles() {
  const wrap = $("styleChips");
  wrap.innerHTML = "";
  STYLES.forEach((s) => {
    const b = document.createElement("button");
    b.textContent = t("styleNames")[s] || s;
    if (state.style === s) b.classList.add("sel");
    b.onclick = () => { state.style = s; renderStyles(); };
    wrap.appendChild(b);
  });
}

function updateCount() {
  $("charCount").textContent = $("prompt").value.length;
}

const KEY_ERRORS = ["RATE_LIMIT", "DAILY_LIMIT", "NO_USER_KEY", "INVALID_KEY"];
async function api(path, opts = {}) {
  let r;
  const headers = { "Content-Type": "application/json" };
  const uk = (typeof getUserKey === "function" && getUserKey()) || "";
  if (uk) headers["X-User-Key"] = uk;
  try {
    r = await fetch("/api" + path, { headers, ...opts, headers: { ...headers, ...(opts.headers || {}) } });
  } catch {
    throw new Error("SERVER_DOWN");
  }
  const text = await r.text();
  try {
    const d = JSON.parse(text);
    if (!r.ok && d && KEY_ERRORS.includes(d.error)) { const e = new Error(d.error); throw e; }
    return d;
  } catch (e) {
    if (KEY_ERRORS.includes(e.message)) throw e;
    const err = new Error(r.status >= 500 ? "SERVER_DOWN" : "BAD_RESPONSE");
    err.raw = text.slice(0, 220);
    err.httpStatus = r.status;
    throw err;
  }
}

function friendlyErr(e) {
  if (e.message === "SERVER_DOWN") return lang === "my"
    ? "ဆာဗာ ခဏရပ်နေပါတယ် — ၁၀ စက္ကန့်လောက်စောင့်ပြီး ပြန်နှိပ်ကြည့်ပါ"
    : "Server is briefly unavailable — wait ~10s and try again";
  if (e.message === "RATE_LIMIT") return t("rateLimit");
  if (e.message === "DAILY_LIMIT") return t("dailyLimit");
  if (e.message === "NO_USER_KEY") return t("keyRequired");
  if (e.message === "INVALID_KEY") return t("keyInvalid");
  if (e.message === "BAD_RESPONSE") return lang === "my"
    ? "ဆာဗာက မမျှော်လင့်တဲ့အဖြေ ပြန်လာပါတယ် — ပြန်နှိပ်ကြည့်ပါ"
    : "Server returned an unexpected response — please retry";
  return e.message;
}

async function loadModels() { /* removed — image gen is pinned to gpt-image-2 */ }

// ---- BYO API key (stored only in this browser, never on the server) ----
function getUserKey() {
  try { return localStorage.getItem("oc-user-key") || ""; } catch { return ""; }
}
function setUserKey(k) {
  try {
    if (k) localStorage.setItem("oc-user-key", k);
    else localStorage.removeItem("oc-user-key");
  } catch { /* ignore */ }
  updateKeyBtn();
}
function updateKeyBtn() {
  const has = !!getUserKey();
  const b = $("keyBtn");
  b.textContent = has ? "🔑✓" : "🔑";
  b.classList.toggle("nokey", !has);
  b.title = has ? t("keyHas") : t("keyNeed");
}
function openKeyModal(msg) {
  const e = $("keyError");
  if (msg) { e.textContent = "⚠️ " + msg; e.classList.remove("hidden"); }
  else e.classList.add("hidden");
  $("keyInput").value = getUserKey();
  $("keyRemove").classList.toggle("hidden", !getUserKey());
  $("keyModal").classList.remove("hidden");
  setTimeout(() => $("keyInput").focus(), 50);
}
function closeKeyModal() { $("keyModal").classList.add("hidden"); }

async function checkAdmin() {
  try {
    const d = await api("/admin/me");
    isAdmin = !!(d && d.ok);
  } catch { isAdmin = false; }
}

let loadTimer = null, loadStage = 0;
function setLoading(on) {
  $("resultEmpty").classList.toggle("hidden", on);
  $("resultLoading").classList.toggle("hidden", !on);
  $("generateBtn").disabled = on;
  clearInterval(loadTimer);
  if (on) {
    $("loaderFrame").className = "loader-frame ar-" + state.aspect;
    const stages = t("loadStages");
    loadStage = 0;
    $("loadingText").textContent = stages[0];
    $("loadingSub").textContent = state.count > 1
      ? (lang === "my" ? `${state.count} ပုံ ထုတ်နေပါတယ်` : `Generating ${state.count} images`)
      : "";
    loadTimer = setInterval(() => {
      loadStage = (loadStage + 1) % stages.length;
      const el = $("loadingText");
      el.style.opacity = "0";
      setTimeout(() => { el.textContent = stages[loadStage]; el.style.opacity = "1"; }, 280);
    }, 3200);
  }
}

function showResults(images, prompt) {
  $("resultEmpty").classList.add("hidden");
  $("resultLoading").classList.add("hidden");
  $("resultError").classList.add("hidden");
  const grid = $("resultGrid");
  grid.classList.remove("hidden");
  grid.innerHTML = "";
  images.forEach((im, i) => {
    // data: URLs must not get a ?t= cache-buster appended (it would corrupt the payload)
    const url = im.url.startsWith("data:")
      ? im.url
      : im.url + (im.url.includes("?") ? "&" : "?") + "t=" + Date.now();
    const div = document.createElement("div");
    div.className = "result-item";
    div.innerHTML = `<img src="${url}" alt="" loading="lazy"><a class="dl" href="${im.url}" download="relay-image-${im.id}.jpg" title="${t("download")}">⬇️</a>`;
    div.querySelector("img").onclick = () => openLightbox({ id: im.id, url: im.url, prompt: im.prompt || prompt, model: im.model, style: im.style, created_at: "" });
    grid.appendChild(div);
  });
}

function showError(msg, raw) {
  $("resultEmpty").classList.add("hidden");
  $("resultLoading").classList.add("hidden");
  $("resultGrid").classList.add("hidden");
  const e = $("resultError");
  e.classList.remove("hidden");
  e.textContent = "⚠️ " + t("genFail") + ": " + msg;
  if (raw) {
    const pre = document.createElement("pre");
    pre.textContent = "HTTP " + raw.status + " · " + raw.snippet;
    e.appendChild(pre);
  }
}

async function generate() {
  const prompt = $("prompt").value.trim();
  if (!prompt) { $("prompt").focus(); return; }
  setLoading(true);
  $("resultGrid").classList.add("hidden");
  $("resultError").classList.add("hidden");
  try {
    const d = await api("/generate", {
      method: "POST",
      body: JSON.stringify({ prompt, model: IMAGE_MODEL, aspect: state.aspect, style: state.style, count: state.count }),
    });
    if (!d.ok) throw new Error(d.error || "unknown");
    showResults(d.images || [], prompt);
    loadGallery();
  } catch (e) {
    if (e.message === "NO_USER_KEY" || e.message === "INVALID_KEY") { openKeyModal(friendlyErr(e)); return; }
    showError(friendlyErr(e), e.raw ? { status: e.httpStatus, snippet: e.raw } : null);
  } finally {
    setLoading(false);
  }
}

function fallbackCopy(txt, done) {
  const ta = document.createElement("textarea");
  ta.value = txt;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); } catch { /* ignore */ }
  ta.remove();
  done();
}

// Gallery removed — images are never stored on the server (user request 2026-09-30).
// Kept as a no-op so existing call sites don't break.
async function loadGallery() { /* no-op */ }

let lbId = null;
function openLightbox(im) {
  lbId = im.id;
  $("lbImg").src = im.url;
  $("lbPrompt").textContent = "💬 " + im.prompt;
  const meta = [im.model, im.style && im.style !== "none" ? t("styleNames")[im.style] : "", im.created_at].filter(Boolean).join("  ·  ");
  $("lbMeta").textContent = meta;
  const dl = $("lbDownload");
  dl.href = im.url;
  dl.setAttribute("download", "relay-image-" + im.id + ".jpg");
  $("lbDelete").classList.add("hidden"); // nothing is stored server-side anymore
  $("lightbox").classList.remove("hidden");
}

function init() {
  $("langMy").onclick = () => { lang = "my"; localStorage.setItem("ris-lang", lang); applyLang(); };
  $("langEn").onclick = () => { lang = "en"; localStorage.setItem("ris-lang", lang); applyLang(); };
  $("tabImage").onclick = () => switchTab("image");
  $("tabPrompt").onclick = () => switchTab("prompt");
  $("generateBtn").onclick = generate;
  $("pgGenBtn").onclick = genPrompt;
  $("pgIdea").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) genPrompt();
  });
  $("pgModel").addEventListener("change", (e) => { state.pgModel = e.target.value; });
  $("pgVarMinus").onclick = () => { state.pgVars = Math.max(1, state.pgVars - 1); updatePgVars(); };
  $("pgVarPlus").onclick = () => { state.pgVars = Math.min(3, state.pgVars + 1); updatePgVars(); };
  $("prompt").addEventListener("input", updateCount);
  $("prompt").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) generate();
  });
  $("countMinus").onclick = () => { state.count = Math.max(1, state.count - 1); $("countVal").textContent = state.count; };
  $("countPlus").onclick = () => { state.count = Math.min(4, state.count + 1); $("countVal").textContent = state.count; };
  $("lbClose").onclick = () => $("lightbox").classList.add("hidden");
  $("lightbox").addEventListener("click", (e) => {
    if (e.target === $("lightbox")) $("lightbox").classList.add("hidden");
  });
  $("lbDelete").onclick = async () => {
    if (!lbId || !confirm(t("confirmDel"))) return;
    try {
      await api("/gallery/" + lbId, { method: "DELETE" });
    } catch (e) {
      if (String(e.message).includes("401") || String(e.message).includes("ADMIN")) { isAdmin = false; }
    }
    $("lightbox").classList.add("hidden");
    loadGallery();
  };
  // BYO API key modal
  $("keyBtn").onclick = () => openKeyModal();
  $("keyClose").onclick = closeKeyModal;
  $("keyModal").addEventListener("click", (e) => {
    if (e.target === $("keyModal")) closeKeyModal();
  });
  $("keyInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("keySave").click();
  });
  $("keySave").onclick = () => {
    const k = $("keyInput").value.trim();
    if (k.length < 8) {
      const e = $("keyError");
      e.textContent = "⚠️ " + (lang === "my" ? "Key က တိုလွန်းတယ် — ပြန်စစ်ပါ" : "That key looks too short — please check it");
      e.classList.remove("hidden");
      return;
    }
    setUserKey(k);
    closeKeyModal();
    toast(t("keySaved"));
  };
  $("keyRemove").onclick = () => {
    setUserKey("");
    $("keyInput").value = "";
    $("keyRemove").classList.add("hidden");
  };

  applyLang();
  updateCount();
  updateKeyBtn();
  (async () => {
    await loadModels();
    await loadPromptModels();
    await checkAdmin();
    loadGallery();
  })();
  // First visit: prompt for the visitor's own API key before anything else.
  if (!getUserKey()) setTimeout(() => openKeyModal(), 600);
}
document.addEventListener("DOMContentLoaded", init);

/* ================= Soothing water sound during loading (WebAudio, no files) ================= */
let waterCtx = null, waterNodes = null;
let soundMuted = localStorage.getItem("oc-sound-muted") === "1";

function startWater() {
  if (soundMuted || waterNodes) return;
  try {
    if (!waterCtx) waterCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (waterCtx.state === "suspended") waterCtx.resume();
    const ctx = waterCtx, t = ctx.currentTime;

    // Brown-ish noise buffer (2s loop) — the raw "water" texture
    const len = Math.floor(ctx.sampleRate * 2);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.4;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;

    // Layer 1: deep wave wash (lowpass) with a slow ~11s swell LFO
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 380; lp.Q.value = 0.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.35, t + 2.2);
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.09;
    const lfoG = ctx.createGain(); lfoG.gain.value = 0.18;
    lfo.connect(lfoG); lfoG.connect(g.gain);

    // Layer 2: faint high babble (bandpass) with a quicker shimmer LFO
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 2800; bp.Q.value = 1.2;
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0, t);
    g2.gain.linearRampToValueAtTime(0.06, t + 3);
    const lfo2 = ctx.createOscillator();
    lfo2.frequency.value = 0.23;
    const lfo2G = ctx.createGain(); lfo2G.gain.value = 0.035;
    lfo2.connect(lfo2G); lfo2G.connect(g2.gain);

    src.connect(lp); lp.connect(g); g.connect(ctx.destination);
    src.connect(bp); bp.connect(g2); g2.connect(ctx.destination);
    src.start(t); lfo.start(t); lfo2.start(t);
    waterNodes = { src, lfo, lfo2, g, g2 };
  } catch (e) { /* audio unavailable — loading still works silently */ }
}

function stopWater() {
  if (!waterNodes || !waterCtx) return;
  const { src, lfo, lfo2, g, g2 } = waterNodes;
  waterNodes = null;
  try {
    const t = waterCtx.currentTime;
    [g, g2].forEach((gg) => {
      gg.gain.cancelScheduledValues(t);
      gg.gain.setValueAtTime(Math.max(0, gg.gain.value), t);
      gg.gain.linearRampToValueAtTime(0, t + 0.9);
    });
    setTimeout(() => { try { src.stop(); lfo.stop(); lfo2.stop(); } catch (e) {} }, 1000);
  } catch (e) {}
}

// Keep the water sound in sync with whichever loader is visible.
function syncWaterSound() {
  const active = ["pgLoading", "resultLoading"].some((id) => {
    const el = document.getElementById(id);
    return el && !el.classList.contains("hidden");
  });
  if (active) startWater(); else stopWater();
}

function initWaterSound() {
  const btn = document.getElementById("soundBtn");
  const paint = () => {
    btn.textContent = soundMuted ? "🔇" : "🔊";
    btn.title = soundMuted ? "ရေသံ ပိတ်ထားတယ် — ဖွင့်ရန် နှိပ်ပါ" : "ရေသံ ဖွင့်ထားတယ် — ပိတ်ရန် နှိပ်ပါ";
  };
  paint();
  btn.onclick = () => {
    soundMuted = !soundMuted;
    localStorage.setItem("oc-sound-muted", soundMuted ? "1" : "0");
    paint();
    if (soundMuted) stopWater(); else syncWaterSound();
  };
  const obs = new MutationObserver(syncWaterSound);
  ["pgLoading", "resultLoading"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) obs.observe(el, { attributes: true, attributeFilter: ["class"] });
  });
}
document.addEventListener("DOMContentLoaded", initWaterSound);

// Prime the AudioContext on the first user gesture so browsers allow
// the water sound to start later during loading (autoplay policy).
document.addEventListener("pointerdown", function primeAudio() {
  try {
    if (!waterCtx) waterCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (waterCtx.state === "suspended") waterCtx.resume();
  } catch (e) {}
  document.removeEventListener("pointerdown", primeAudio);
});
