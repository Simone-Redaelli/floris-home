import { createContext, useContext, useEffect, useState } from "react";
import { firebaseConfig, isConfigured } from "./firebase-config";
import { SITE } from "../data";

/* Valori usati finché l'admin non salva le sue impostazioni */
export const DEFAULTS = {
  bookingOpen: true,
  notice: "",
  pricePerNight: SITE.pricePerNight,
  weekendPrice: 0,          // 0 = uguale al prezzo base
  cleaningFee: SITE.cleaningFee,
  deposit: SITE.deposit,
  minNights: 1,
  maxGuests: 5,
  transferEnabled: true,    // transfer dall'aeroporto di Orio al Serio
  transferPrice: 35,
  checkIn: SITE.checkIn,
  checkOut: SITE.checkOut,
  whatsapp: SITE.whatsapp,
  email: SITE.email,
  phone: SITE.phone,
  seasons: [],              // [{ id, name, from: "YYYY-MM-DD", to: "YYYY-MM-DD", price }]
  blocked: [],              // ["YYYY-MM-DD", ...] notti non disponibili
};

export const DOC_PATH = ["config", "site"];

/* ---------- date ---------- */
const pad = (n) => String(n).padStart(2, "0");
export const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parse = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (s, n) => {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return iso(d);
};
export const today = () => iso(new Date());
export const nightsBetween = (from, to) => {
  const out = [];
  if (!from || !to || to <= from) return out;
  for (let d = from; d < to; d = addDays(d, 1)) out.push(d);
  return out;
};
export const fmtDate = (s, opts = { day: "numeric", month: "long" }) =>
  parse(s).toLocaleDateString("it-IT", opts);
export const euro = (n) => "€" + Math.round(n).toLocaleString("it-IT");

/* ---------- prezzi ---------- */
export function nightPrice(day, s) {
  const season = (s.seasons || []).find((x) => x.from && x.to && day >= x.from && day <= x.to && x.price > 0);
  if (season) return { price: Number(season.price), kind: "season", label: season.name };
  const wd = parse(day).getDay();
  if ((wd === 5 || wd === 6) && Number(s.weekendPrice) > 0) return { price: Number(s.weekendPrice), kind: "weekend" };
  return { price: Number(s.pricePerNight), kind: "base" };
}

export function quote(from, to, s, opts = {}) {
  const nights = nightsBetween(from, to);
  const blockedSet = new Set(s.blocked || []);
  const conflicts = nights.filter((d) => blockedSet.has(d));
  const lines = nights.map((d) => ({ day: d, ...nightPrice(d, s) }));
  const subtotal = lines.reduce((a, l) => a + l.price, 0);
  const transferFee = opts.transfer && s.transferEnabled ? Number(s.transferPrice || 0) : 0;
  const total = nights.length ? subtotal + Number(s.cleaningFee || 0) + transferFee : 0;

  // raggruppa le notti per prezzo per il riepilogo
  const groups = [];
  for (const l of lines) {
    const g = groups.find((x) => x.price === l.price && x.kind === l.kind);
    g ? g.count++ : groups.push({ price: l.price, kind: l.kind, label: l.label, count: 1 });
  }
  let status = "ok";
  if (!s.bookingOpen) status = "closed";
  else if (!nights.length) status = "empty";
  else if (from < today()) status = "past";
  else if (conflicts.length) status = "unavailable";
  else if (nights.length < Number(s.minNights || 1)) status = "min";
  return { nights, conflicts, groups, subtotal, transferFee, total, status };
}

/* ---------- lettura pubblica da Firestore (REST, senza SDK) ---------- */
function decode(v) {
  if (!v) return null;
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return Number(v.doubleValue);
  if ("booleanValue" in v) return v.booleanValue;
  if ("nullValue" in v) return null;
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(decode);
  if ("mapValue" in v) return decodeFields(v.mapValue.fields || {});
  if ("timestampValue" in v) return v.timestampValue;
  return null;
}
const decodeFields = (f) => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, decode(v)]));

export async function fetchSettings() {
  if (!isConfigured) return { ...DEFAULTS };
  const { projectId, apiKey } = firebaseConfig;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${DOC_PATH.join("/")}?key=${apiKey}`;
  const r = await fetch(url);
  if (!r.ok) return { ...DEFAULTS };
  const j = await r.json();
  return { ...DEFAULTS, ...decodeFields(j.fields || {}) };
}

/* ---------- contesto React ---------- */
const Ctx = createContext({ settings: DEFAULTS, loading: true });

export function SettingsProvider({ children }) {
  const [state, setState] = useState({ settings: DEFAULTS, loading: true });
  useEffect(() => {
    let alive = true;
    fetchSettings()
      .then((s) => alive && setState({ settings: s, loading: false }))
      .catch(() => alive && setState({ settings: DEFAULTS, loading: false }));
    return () => (alive = false);
  }, []);
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useSettings = () => useContext(Ctx);
