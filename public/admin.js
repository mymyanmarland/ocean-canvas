// OceanCanvas — admin panel (bilingual my/en).
"use strict";

const I18N = {
  my: {
    title: "OceanCanvas", adminTitle: "Admin Panel",
    adminSub: "API key ပြင်ဖို့ admin password ထည့်ပါ",
    adminDisabled: "Admin password မသတ်မှတ်ရသေးပါ — server မှာ ADMIN_PASSWORD ထည့်ဖို့ လိုပါတယ်",
    pwPh: "Admin password", login: "ဝင်ရန်", logout: "ထွက်ရန်",
    wrongPw: "Password မှားနေပါတယ်", loginOk: "ဝင်ရောက်မှု အောင်မြင်ပါတယ် ✓",
    stats: "အခြေအနေ", stTotal: "စုစုပေါင်း ပုံများ", stToday: "ဒီနေ့", stSize: "Gallery အရွယ်အစား", stRate: "Rate limit / နာရီ",
    keyTitle: "Relay API Key", curKey: "လက်ရှိ key", baseUrl: "Relay Base URL",
    newKey: "Key အသစ် (ပြောင်းချင်မှ ထည့်ပါ)",
    save: "သိမ်းရန်", test: "စမ်းသပ်ရန်",
    saved: "✓ သိမ်းပြီးပြီ", testOk: "✓ ချိတ်ဆက်မှု အောင်မြင်ပါတယ်", testFail: "✗ ချိတ်ဆက်မှု မအောင်မြင်ပါ",
    keyNote: "Key ကို server မှာ AES-256-GCM နဲ့ လျှို့ဝှက်သိမ်းပါတယ်။ Browser ကို key အပြည့်အစုံ ဘယ်တော့မှ မပို့ပါ။",
    danger: "အန္တရာယ်ဇုန်", clearNote: "Gallery ထဲက ပုံအားလုံးကို အပြီးဖျက်ပါမယ်။",
    clearGal: "🗑️ Gallery အကုန်ဖျက်ရန်", confirmClear: "ပုံအားလုံး အပြီးဖျက်မှာလား? ဒါကို ပြန်ပြင်လို့မရဘူး။",
    cleared: (n) => `✓ ပုံ ${n} ပုံ ဖျက်ပြီးပြီ`,
    noKey: "Key မရှိသေးပါ",
    baseNotApproved: "⚠️ ဒီ relay က ခွင့်ပြုထားတာ မဟုတ်လို့ ပုံထုတ်တာ ပိတ်ထားတယ်။",
    testRelayOk: (name, models, imgs) => `✓ ${name}: ${models} models, image: ${imgs.join(", ") || "—"}`,
    testRelayFail: (name, reason) => `✗ ${name}: ${reason}`,
  },
  en: {
    title: "OceanCanvas", adminTitle: "Admin Panel",
    adminSub: "Enter the admin password to manage the API key",
    adminDisabled: "Admin password not configured — set ADMIN_PASSWORD on the server",
    pwPh: "Admin password", login: "Log in", logout: "Log out",
    wrongPw: "Wrong password", loginOk: "Logged in ✓",
    stats: "Overview", stTotal: "Total images", stToday: "Today", stSize: "Gallery size", stRate: "Rate limit / hour",
    keyTitle: "Relay API Key", curKey: "Current key", baseUrl: "Relay Base URL",
    newKey: "New key (only to change it)",
    save: "Save", test: "Test connection",
    saved: "✓ Saved", testOk: "✓ Connection works", testFail: "✗ Connection failed",
    keyNote: "The key is stored encrypted (AES-256-GCM) on the server. The full key never reaches the browser.",
    danger: "Danger zone", clearNote: "Permanently delete ALL images in the gallery.",
    clearGal: "🗑️ Clear gallery", confirmClear: "Delete ALL images? This cannot be undone.",
    cleared: (n) => `✓ Deleted ${n} images`,
    noKey: "No key set",
    baseNotApproved: "⚠️ This relay is not approved — image generation through it is disabled.",
    testRelayOk: (name, models, imgs) => `✓ ${name}: ${models} models, image: ${imgs.join(", ") || "—"}`,
    testRelayFail: (name, reason) => `✗ ${name}: ${reason}`,
  },
};

let lang = localStorage.getItem("ris-lang") || "my";
const $ = (id) => document.getElementById(id);
function t(k) { return (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k; }

function applyLang() {
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  $("langMy").classList.toggle("active", lang === "my");
  $("langEn").classList.toggle("active", lang === "en");
  document.documentElement.lang = lang;
}

async function api(path, opts = {}) {
  const r = await fetch("/api" + path, { headers: { "Content-Type": "application/json" }, ...opts });
  let d = null;
  try { d = JSON.parse(await r.text()); } catch { /* ignore */ }
  return { status: r.status, data: d };
}
function setStatus(id, msg, ok) {
  const el = $(id);
  el.textContent = msg;
  el.className = "status" + (ok === true ? " ok" : ok === false ? " err" : "");
}
function fmtMB(bytes) {
  const mb = bytes / 1048576;
  return (mb < 0.1 ? bytes / 1024 : mb).toFixed(mb < 0.1 ? 0 : 1) + (mb < 0.1 ? " KB" : " MB");
}

function relayByN(relays, n) {
  return (relays || []).find((r) => r.n === n) || {};
}

async function loadDashboard() {
  const { status, data } = await api("/admin/settings");
  if (status === 401) return showLogin();
  if (status === 503) { showLogin(); $("disabledWarn").classList.remove("hidden"); return; }
  if (!data || !data.ok) return showLogin();
  $("loginCard").classList.add("hidden");
  $("dash").classList.remove("hidden");
  for (const n of [1, 2]) {
    const r = relayByN(data.relays, n);
    $("keyMasked" + n).textContent = r.keyConfigured ? r.keyMasked : t("noKey");
    $("setBase" + n).value = r.base || "";
    const warn = $("baseWarn" + n);
    if (warn) {
      if (r.approved === false) { warn.textContent = t("baseNotApproved"); warn.classList.remove("hidden"); }
      else warn.classList.add("hidden");
    }
  }
  const st = await api("/admin/stats");
  if (st.data && st.data.ok) {
    $("stTotal").textContent = st.data.total;
    $("stToday").textContent = st.data.today;
    $("stSize").textContent = fmtMB(st.data.galleryMB);
    $("stRate").textContent = st.data.rateLimitPerHour;
  }
}

function showLogin() {
  $("loginCard").classList.remove("hidden");
  $("dash").classList.add("hidden");
}

async function doLogin() {
  const pw = $("pw").value;
  if (!pw) return;
  try {
    const { status, data } = await api("/admin/login", { method: "POST", body: JSON.stringify({ password: pw }) });
    if (status === 503) { $("disabledWarn").classList.remove("hidden"); return; }
    if (data && data.ok) {
      setStatus("loginStatus", t("loginOk"), true);
      $("pw").value = "";
      setTimeout(loadDashboard, 400);
    } else {
      setStatus("loginStatus", t("wrongPw"), false);
    }
  } catch {
    setStatus("loginStatus", t("testFail"), false);
  }
}

function init() {
  $("langMy").onclick = () => { lang = "my"; localStorage.setItem("ris-lang", lang); applyLang(); };
  $("langEn").onclick = () => { lang = "en"; localStorage.setItem("ris-lang", lang); applyLang(); };
  $("loginBtn").onclick = doLogin;
  $("pw").addEventListener("keydown", (e) => { if (e.key === "Enter") doLogin(); });
  $("logoutBtn").onclick = async () => {
    await api("/admin/logout", { method: "POST" });
    showLogin();
    setStatus("loginStatus", "", null);
  };
  $("saveKey").onclick = async () => {
    const { data } = await api("/admin/settings", {
      method: "POST",
      body: JSON.stringify({
        base: $("setBase1").value.trim(), apiKey: $("setKey1").value.trim(),
        base2: $("setBase2").value.trim(), apiKey2: $("setKey2").value.trim(),
      }),
    });
    if (data && data.ok) {
      setStatus("keyStatus", t("saved"), true);
      for (const n of [1, 2]) {
        const r = relayByN(data.relays, n);
        $("keyMasked" + n).textContent = r.keyConfigured ? r.keyMasked : t("noKey");
        $("setBase" + n).value = r.base || "";
        const warn = $("baseWarn" + n);
        if (warn) {
          if (r.approved === false) { warn.textContent = t("baseNotApproved"); warn.classList.remove("hidden"); }
          else warn.classList.add("hidden");
        }
      }
      $("setKey1").value = "";
      $("setKey2").value = "";
    } else {
      setStatus("keyStatus", t("testFail"), false);
    }
  };
  $("testConn").onclick = async () => {
    setStatus("keyStatus", "…", null);
    const { data } = await api("/admin/test", { method: "POST" });
    if (data && data.ok) {
      const lines = (data.relays || []).map((r) => {
        const f = typeof t("testRelayOk") === "function" ? t("testRelayOk") : (a, b, c) => a;
        const ff = typeof t("testRelayFail") === "function" ? t("testRelayFail") : (a, b) => a + ": " + b;
        return r.ok ? f(r.name, r.models, r.imageModels || []) : ff(r.name, r.error || "?");
      });
      const el = $("keyStatus");
      el.innerHTML = "";
      lines.forEach((ln, i) => {
        if (i) el.appendChild(document.createElement("br"));
        el.appendChild(document.createTextNode(ln));
      });
      el.className = "status " + ((data.relays || []).every((r) => r.ok) ? "ok" : "err");
    } else {
      setStatus("keyStatus", t("testFail"), false);
    }
  };
  $("clearGal").onclick = async () => {
    if (!confirm(t("confirmClear"))) return;
    const { data } = await api("/admin/gallery/clear", { method: "POST" });
    if (data && data.ok) {
      const msg = typeof t("cleared") === "function" ? t("cleared")(data.deleted) : data.deleted;
      setStatus("clearStatus", msg, true);
      loadDashboard();
    } else {
      setStatus("clearStatus", t("testFail"), false);
    }
  };
  applyLang();
  loadDashboard();
}
document.addEventListener("DOMContentLoaded", init);
