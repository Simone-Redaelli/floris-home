import { createContext, useContext, useEffect, useState } from "react";
import { firebaseConfig, isConfigured } from "./firebase-config";
import { SITE } from "../data";
import { currentLocale } from "../i18n";

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
  blocked: [],              // ["YYYY-MM-DD", ...] notti non disponibili (segnate da te o confermate dal sito)
  extBlocked: [],           // notti occupate su Booking/Airbnb (le scrive la sincronizzazione iCal)
  extSyncedAt: "",
  // servizi extra che l'ospite può aggiungere (prezzo in €; unità fissa, vedi EXTRAS)
  extras: {
    cot: { enabled: true, price: 0 },
    highchair: { enabled: true, price: 0 },
    earlyIn: { enabled: true, price: 20 },
    lateOut: { enabled: true, price: 20 },
    ac: { enabled: true, price: 10 },
  },
  // prezzo per ospiti: fino a "guestsIncluded" persone vale il prezzo della notte, poi +extraGuestPct% per ogni persona in più
  guestsIncluded: 2,
  extraGuestPct: 5,
  cancelDays: 14, // cancellazione gratuita fino a N giorni prima dell'arrivo
  petFee: 50,     // supplemento animale (massimo 1) a soggiorno
  // tassa di soggiorno del Comune di Bergamo: % del prezzo a notte per persona, con tetto e notti massime
  taxEnabled: true,
  taxRate: 7,
  taxCap: 5,
  taxMaxNights: 5,
  reviewUrl: "",            // link "lascia una recensione" su Google
  // guida della casa (parte visibile a chi apre la guida)
  parkingInfo: "",
  wasteDays: "",
  guideNotes: "",
};

/* Servizi extra: unit "stay" = una volta a soggiorno, "night" = per ogni notte, "person" = per ogni ospite */
export const EXTRAS = [
  { id: "cot", unit: "stay", free: true },        // sempre gratis
  { id: "highchair", unit: "stay", free: true },  // sempre gratis
  { id: "earlyIn", unit: "stay" },
  { id: "lateOut", unit: "stay" },
  { id: "ac", unit: "night" },
];

/* moltiplicatore del prezzo a notte in base agli ospiti (es. 4 ospiti, 2 inclusi, 5% → 1,10) */
export const guestFactor = (guests, s) =>
  1 + (Math.max(0, (Number(guests) || 1) - (Number(s.guestsIncluded) || 2)) * (Number(s.extraGuestPct) || 0)) / 100;

/* ultimo giorno per cancellare gratis */
export const cancelDeadline = (from, s) => (from ? addDays(from, -(Number(s.cancelDays) || 0)) : null);

/* unisce i valori salvati con i predefiniti (anche dentro "extras") */
export function normalize(raw = {}) {
  const s = { ...DEFAULTS, ...raw };
  s.extras = Object.fromEntries(EXTRAS.map(({ id, free }) => [id, { ...DEFAULTS.extras[id], ...(raw.extras?.[id] || {}), ...(free ? { price: 0 } : {}) }]));
  return s;
}

/* notti non prenotabili: bloccate da te + occupate su Booking/Airbnb */
export const unavailableSet = (s) => new Set([...(s.blocked || []), ...(s.extBlocked || [])]);

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
  parse(s).toLocaleDateString(currentLocale(), opts);
export const euro = (n) => {
  const v = Math.round((Number(n) || 0) * 100) / 100;
  return "€" + (Number.isInteger(v) ? v.toLocaleString("it-IT") : v.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
};
const r2 = (n) => Math.round(n * 100) / 100;

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
  const off = unavailableSet(s);
  const conflicts = nights.filter((d) => off.has(d));
  const guests = Math.max(1, Number(opts.guests) || 1);
  const factor = guestFactor(guests, s);
  const lines = nights.map((d) => { const np = nightPrice(d, s); return { day: d, ...np, base: np.price, price: r2(np.price * factor) }; });
  const subtotal = r2(lines.reduce((a, l) => a + l.price, 0));
  const adults = Math.min(guests, Math.max(0, opts.adults ?? guests));
  const cleaning = nights.length ? Number(s.cleaningFee || 0) : 0;
  const transferFee = nights.length && opts.transfer && s.transferEnabled ? Number(s.transferPrice || 0) : 0;
  const petFee = nights.length && opts.pet ? Number(s.petFee || 0) : 0;

  // servizi extra scelti (solo quelli attivi)
  const ex = s.extras || DEFAULTS.extras;
  const extras = nights.length
    ? EXTRAS.filter((e) => (opts.extras || []).includes(e.id) && ex[e.id]?.enabled).map((e) => {
        const price = e.free ? 0 : Number(ex[e.id].price) || 0;
        const qty = e.unit === "person" ? guests : e.unit === "night" ? nights.length : 1;
        return { id: e.id, unit: e.unit, price, qty, amount: price * qty };
      })
    : [];
  const extrasTotal = extras.reduce((a, e) => a + e.amount, 0);

  // tassa di soggiorno: per ogni notte (fino al massimo) e ogni adulto, rate% del prezzo a notte per persona, con tetto
  let tax = 0;
  let taxNights = 0;
  if (s.taxEnabled && nights.length && adults > 0) {
    taxNights = Math.min(nights.length, Math.max(0, Number(s.taxMaxNights) || nights.length));
    for (const l of lines.slice(0, taxNights)) {
      const pp = r2(Math.min(Number(s.taxCap) || Infinity, ((Number(s.taxRate) || 0) / 100) * (l.price / guests)));
      tax += pp * adults;
    }
    tax = r2(tax);
  }

  const total = nights.length ? r2(subtotal + cleaning + transferFee + petFee + extrasTotal + tax) : 0;

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
  return { nights, conflicts, groups, subtotal, factor, guests, cleaning, transferFee, petFee, extras, extrasTotal, tax, taxNights, adults, total, status };
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
export const decodeFields = (f) => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, decode(v)]));

export async function fetchSettings() {
  if (!isConfigured) return normalize();
  const { projectId, apiKey } = firebaseConfig;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${DOC_PATH.join("/")}?key=${apiKey}`;
  const r = await fetch(url);
  if (!r.ok) return normalize();
  const j = await r.json();
  return normalize(decodeFields(j.fields || {}));
}

/* ---------- contesto React ---------- */
const Ctx = createContext({ settings: normalize(), loading: true });

export function SettingsProvider({ children }) {
  const [state, setState] = useState({ settings: normalize(), loading: true });
  useEffect(() => {
    let alive = true;
    fetchSettings()
      .then((s) => alive && setState({ settings: s, loading: false }))
      .catch(() => alive && setState({ settings: normalize(), loading: false }));
    return () => (alive = false);
  }, []);
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useSettings = () => useContext(Ctx);
