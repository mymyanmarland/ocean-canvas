"use strict";
// SQLite store: gallery + settings. Relay API key encrypted with AES-256-GCM.
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

const DATA_DIR = path.join(__dirname, "..", "data");
const IMG_DIR = path.join(DATA_DIR, "img");
fs.mkdirSync(IMG_DIR, { recursive: true });

const db = new DatabaseSync(path.join(DATA_DIR, "studio.db"));
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prompt TEXT NOT NULL,
    model TEXT NOT NULL DEFAULT '',
    aspect TEXT NOT NULL DEFAULT 'square',
    file TEXT NOT NULL DEFAULT '',
    remote_url TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);
// lightweight migration: track style preset per image
try {
  const cols = db.prepare("PRAGMA table_info(images)").all().map((c) => c.name);
  if (!cols.includes("style")) db.exec("ALTER TABLE images ADD COLUMN style TEXT NOT NULL DEFAULT 'none'");
} catch (e) {
  console.warn("[store] migration failed:", e.message);
}

let _key = null;
function appKey() {
  if (_key) return _key;
  const s = process.env.APP_SECRET;
  if (s && s.length >= 16) {
    _key = crypto.createHash("sha256").update(String(s)).digest();
  } else {
    _key = crypto.randomBytes(32);
    console.warn("[store] APP_SECRET not set — relay key will NOT survive a restart.");
  }
  return _key;
}
function enc(plain) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", appKey(), iv);
  const ct = Buffer.concat([c.update(String(plain), "utf8"), c.final()]);
  return JSON.stringify({
    iv: iv.toString("base64"),
    tag: c.getAuthTag().toString("base64"),
    data: ct.toString("base64"),
  });
}
function dec(payload) {
  const o = JSON.parse(payload);
  const d = crypto.createDecipheriv("aes-256-gcm", appKey(), Buffer.from(o.iv, "base64"));
  d.setAuthTag(Buffer.from(o.tag, "base64"));
  return Buffer.concat([d.update(Buffer.from(o.data, "base64")), d.final()]).toString("utf8");
}

function getSetting(key, fallback = null) {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key);
  return row ? row.value : fallback;
}
function setSetting(key, value) {
  db.prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  ).run(key, value);
}
function getSecret(key) {
  const v = getSetting("secret:" + key);
  if (!v) return null;
  try {
    return dec(v);
  } catch {
    return null;
  }
}
function setSecret(key, plain) {
  setSetting("secret:" + key, enc(plain));
}

function addImage({ prompt, model, aspect, style, file, remote_url }) {
  const r = db
    .prepare("INSERT INTO images (prompt, model, aspect, style, file, remote_url) VALUES (?, ?, ?, ?, ?, ?)")
    .run(prompt, model, aspect, style || "none", file, remote_url || "");
  return Number(r.lastInsertRowid);
}
function listImages(limit = 60) {
  return db
    .prepare("SELECT id, prompt, model, aspect, style, file, created_at FROM images ORDER BY id DESC LIMIT ?")
    .all(limit);
}
function getImage(id) {
  return db.prepare("SELECT * FROM images WHERE id = ?").get(id) || null;
}
function setImageFile(id, file) {
  db.prepare("UPDATE images SET file = ? WHERE id = ?").run(file, id);
}
function deleteImage(id) {
  const row = getImage(id);
  if (!row) return false;
  db.prepare("DELETE FROM images WHERE id = ?").run(id);
  try {
    const p = path.join(IMG_DIR, path.basename(row.file || ""));
    if (row.file && fs.existsSync(p)) fs.unlinkSync(p);
  } catch {}
  return true;
}

function countImages() {
  const r = db.prepare("SELECT COUNT(*) AS c FROM images").get();
  return r ? r.c : 0;
}
function countImagesToday() {
  const r = db.prepare("SELECT COUNT(*) AS c FROM images WHERE date(created_at) = date('now')").get();
  return r ? r.c : 0;
}
function galleryBytes() {
  let total = 0;
  try {
    for (const f of fs.readdirSync(IMG_DIR)) {
      try { total += fs.statSync(path.join(IMG_DIR, f)).size; } catch {}
    }
  } catch {}
  return total;
}
function clearImages() {
  const rows = db.prepare("SELECT file FROM images").all();
  let n = 0;
  for (const r of rows) {
    try {
      const p = path.join(IMG_DIR, path.basename(r.file || ""));
      if (r.file && fs.existsSync(p)) fs.unlinkSync(p);
    } catch {}
    n++;
  }
  db.exec("DELETE FROM images");
  return n;
}

module.exports = {
  DATA_DIR,
  IMG_DIR,
  getSetting,
  setSetting,
  getSecret,
  setSecret,
  addImage,
  setImageFile,
  listImages,
  getImage,
  deleteImage,
  countImages,
  countImagesToday,
  galleryBytes,
  clearImages,
};
