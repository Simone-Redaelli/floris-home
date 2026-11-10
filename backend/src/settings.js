// Impostazioni del sito (prezzi, disponibilità…) e calcolo del preventivo.
// Sono le stesse che l'admin modifica dal pannello: stanno su Firestore in config/site.
import fs from 'node:fs/promises';
import path from 'node:path';
import { DateTime } from 'luxon';
import { env } from './env.js';
import { db, firebaseReady, FieldValue } from './firebase.js';

export const DEFAULTS = {
  bookingOpen: true,
  pricePerNight: 130,
  weekendPrice: 0,
  cleaningFee: 40,
  deposit: 300,
  minNights: 1,
  maxGuests: 5,
  transferEnabled: true,
  transferPrice: 35,
  checkIn: '16:00 – 20:00',
  checkOut: 'entro le 10:00',
  seasons: [],
  blocked: [],
  extBlocked: [],
  extras: {
    crib: { enabled: true, price: 15 },
    highchair: { enabled: true, price: 5 },
    earlyIn: { enabled: true, price: 20 },
    lateOut: { enabled: true, price: 20 },
    breakfast: { enabled: true, price: 8 },
  },
  taxEnabled: true,
  taxRate: 7,
  taxCap: 5,
  taxMaxNights: 5,
  reviewUrl: '',
};

/* Servizi extra (stesso elenco del sito) */
export const EXTRAS = [
  { id: 'crib', unit: 'stay', it: 'Culla' },
  { id: 'highchair', unit: 'stay', it: 'Seggiolone' },
  { id: 'earlyIn', unit: 'stay', it: 'Check-in anticipato' },
  { id: 'lateOut', unit: 'stay', it: 'Check-out posticipato' },
  { id: 'breakfast', unit: 'person', it: 'Kit colazione' },
];

export function normalize(raw = {}) {
  const s = { ...DEFAULTS, ...raw };
  s.extras = Object.fromEntries(EXTRAS.map(({ id }) => [id, { ...DEFAULTS.extras[id], ...(raw.extras?.[id] || {}) }]));
  return s;
}

export const unavailableSet = (s) => new Set([...(s.blocked || []), ...(s.extBlocked || [])]);

const LOCAL = path.resolve(env.dataDir, 'settings.json');

export async function getSettings() {
  if (firebaseReady) {
    const snap = await db.doc('config/site').get();
    return normalize(snap.exists ? snap.data() : {});
  }
  try {
    return normalize(JSON.parse(await fs.readFile(LOCAL, 'utf8')));
  } catch {
    return normalize();
  }
}

/* ---------- date ---------- */
const D = (s) => DateTime.fromISO(s, { zone: env.timezone });
export const isDay = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s)) && D(s).isValid;
export const today = () => DateTime.now().setZone(env.timezone).toISODate();
export const addDays = (s, n) => D(s).plus({ days: n }).toISODate();
export function nightsBetween(from, to) {
  const out = [];
  if (!isDay(from) || !isDay(to) || to <= from) return out;
  for (let d = from; d < to; d = addDays(d, 1)) out.push(d);
  return out;
}

/* ---------- prezzi (stessa logica del sito) ---------- */
export function nightPrice(day, s) {
  const season = (s.seasons || []).find((x) => x.from && x.to && day >= x.from && day <= x.to && Number(x.price) > 0);
  if (season) return { price: Number(season.price), kind: 'season', label: season.name };
  const wd = D(day).weekday; // 5 = venerdì, 6 = sabato
  if ((wd === 5 || wd === 6) && Number(s.weekendPrice) > 0) return { price: Number(s.weekendPrice), kind: 'weekend' };
  return { price: Number(s.pricePerNight), kind: 'base' };
}

const r2 = (n) => Math.round(n * 100) / 100;

export function quote({ from, to, guests = 1, adults, transfer = false, extras = [] }, s) {
  const nights = nightsBetween(from, to);
  const off = unavailableSet(s);
  const conflicts = nights.filter((d) => off.has(d));
  const lines = nights.map((d) => ({ day: d, ...nightPrice(d, s) }));
  const stay = lines.reduce((a, l) => a + l.price, 0);
  const g = Math.max(1, Number(guests) || 1);
  const ad = Math.min(g, Math.max(0, adults ?? g));
  const cleaning = nights.length ? Number(s.cleaningFee || 0) : 0;
  const transferFee = nights.length && transfer && s.transferEnabled ? Number(s.transferPrice || 0) : 0;

  const ex = s.extras || DEFAULTS.extras;
  const extraLines = nights.length
    ? EXTRAS.filter((e) => extras.includes(e.id) && ex[e.id]?.enabled).map((e) => {
        const price = Number(ex[e.id].price) || 0;
        const qty = e.unit === 'person' ? g : 1;
        return { id: e.id, name: e.it, qty, price, amount: price * qty };
      })
    : [];
  const extrasTotal = extraLines.reduce((a, e) => a + e.amount, 0);

  let tax = 0;
  if (s.taxEnabled && nights.length && ad > 0) {
    const max = Math.min(nights.length, Math.max(0, Number(s.taxMaxNights) || nights.length));
    for (const l of lines.slice(0, max)) {
      tax += r2(Math.min(Number(s.taxCap) || Infinity, ((Number(s.taxRate) || 0) / 100) * (l.price / g))) * ad;
    }
    tax = r2(tax);
  }
  const total = nights.length ? r2(stay + cleaning + transferFee + extrasTotal + tax) : 0;

  let status = 'ok';
  if (!s.bookingOpen) status = 'closed';
  else if (!nights.length) status = 'empty';
  else if (from < today()) status = 'past';
  else if (conflicts.length) status = 'unavailable';
  else if (nights.length < Number(s.minNights || 1)) status = 'min';
  else if (g > Number(s.maxGuests || 5)) status = 'guests';
  return { nights, conflicts, stay, cleaning, transferFee, extras: extraLines, extrasTotal, tax, total, status };
}

/* ---------- blocco/sblocco notti (le vede subito il calendario del sito) ---------- */
export async function blockNights(nights) {
  if (firebaseReady) {
    await db.doc('config/site').set({ blocked: FieldValue.arrayUnion(...nights) }, { merge: true });
    return;
  }
  const s = await getSettings();
  const all = [...new Set([...(s.blocked || []), ...nights])].sort();
  await fs.mkdir(path.dirname(LOCAL), { recursive: true });
  await fs.writeFile(LOCAL, JSON.stringify({ ...s, blocked: all }, null, 2));
}
