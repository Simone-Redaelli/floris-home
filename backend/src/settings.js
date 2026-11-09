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
};

const LOCAL = path.resolve(env.dataDir, 'settings.json');

export async function getSettings() {
  if (firebaseReady) {
    const snap = await db.doc('config/site').get();
    return { ...DEFAULTS, ...(snap.exists ? snap.data() : {}) };
  }
  try {
    return { ...DEFAULTS, ...JSON.parse(await fs.readFile(LOCAL, 'utf8')) };
  } catch {
    return { ...DEFAULTS };
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

export function quote({ from, to, guests = 1, transfer = false }, s) {
  const nights = nightsBetween(from, to);
  const blocked = new Set(s.blocked || []);
  const conflicts = nights.filter((d) => blocked.has(d));
  const lines = nights.map((d) => ({ day: d, ...nightPrice(d, s) }));
  const stay = lines.reduce((a, l) => a + l.price, 0);
  const cleaning = nights.length ? Number(s.cleaningFee || 0) : 0;
  const transferFee = transfer && s.transferEnabled ? Number(s.transferPrice || 0) : 0;
  const total = nights.length ? stay + cleaning + transferFee : 0;

  let status = 'ok';
  if (!s.bookingOpen) status = 'closed';
  else if (!nights.length) status = 'empty';
  else if (from < today()) status = 'past';
  else if (conflicts.length) status = 'unavailable';
  else if (nights.length < Number(s.minNights || 1)) status = 'min';
  else if (guests > Number(s.maxGuests || 5)) status = 'guests';
  return { nights, conflicts, stay, cleaning, transferFee, total, status };
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
