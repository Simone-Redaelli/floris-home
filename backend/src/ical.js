// Sincronizzazione calendari con Booking.com / Airbnb (formato iCal).
//  • IMPORT: legge i link .ics di Booking/Airbnb e scrive le notti occupate in config/site.extBlocked
//  • EXPORT: crea i file .ics del sito da incollare su Booking/Airbnb
// I link dei calendari esterni stanno in private/ical (leggibile solo dall'admin).
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { DateTime } from 'luxon';
import { db, firebaseReady } from './firebase.js';
import { env } from './env.js';

const TZ = 'Europe/Rome';
const toDay = (d) => d.toISODate();

/* ---------- parsing .ics ---------- */
function unfold(text) {
  // le righe lunghe continuano sulla riga dopo che inizia con spazio o tab
  return String(text).replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '');
}

function parseDate(line) {
  // DTSTART;VALUE=DATE:20261201  ·  DTSTART:20261201T150000Z  ·  DTSTART;TZID=Europe/Rome:20261201T150000
  const [left, value = ''] = line.split(/:(.*)/s);
  const v = value.trim();
  const tzid = (left.match(/TZID=([^;:]+)/) || [])[1];
  if (/^\d{8}$/.test(v)) return DateTime.fromFormat(v, 'yyyyMMdd', { zone: TZ });
  if (/^\d{8}T\d{6}Z$/.test(v)) return DateTime.fromFormat(v, "yyyyMMdd'T'HHmmss'Z'", { zone: 'utc' }).setZone(TZ);
  if (/^\d{8}T\d{6}$/.test(v)) return DateTime.fromFormat(v, "yyyyMMdd'T'HHmmss", { zone: tzid || TZ }).setZone(TZ);
  return null;
}

/** Restituisce l'elenco delle notti occupate ("YYYY-MM-DD") contenute nel file .ics */
export function parseIcs(text) {
  const nights = new Set();
  const blocks = unfold(text).split('BEGIN:VEVENT').slice(1);
  for (const raw of blocks) {
    const ev = raw.split('END:VEVENT')[0];
    const lines = ev.split('\n');
    if (lines.some((l) => /^STATUS:CANCELLED/i.test(l.trim()))) continue;
    const s = lines.find((l) => l.startsWith('DTSTART'));
    const e = lines.find((l) => l.startsWith('DTEND'));
    let start = s && parseDate(s);
    if (!start?.isValid) continue;
    let end = e && parseDate(e);
    start = start.startOf('day');
    end = end?.isValid ? end.startOf('day') : start.plus({ days: 1 });
    if (end <= start) end = start.plus({ days: 1 });
    // DTEND è il giorno di partenza (escluso): le notti vanno da start a end-1
    for (let d = start; d < end && nights.size < 4000; d = d.plus({ days: 1 })) nights.add(toDay(d));
  }
  return [...nights].sort();
}

/* ---------- creazione .ics ---------- */
function ranges(days) {
  const out = [];
  for (const d of [...new Set(days)].sort()) {
    const last = out[out.length - 1];
    if (last && DateTime.fromISO(last[1]).plus({ days: 1 }).toISODate() === d) last[1] = d;
    else out.push([d, d]);
  }
  return out;
}
const icsDate = (iso) => iso.replace(/-/g, '');

export function buildIcs(days, name = env.property.name) {
  const stamp = DateTime.utc().toFormat("yyyyMMdd'T'HHmmss'Z'");
  const events = ranges(days).map(([a, b]) => {
    const end = DateTime.fromISO(b).plus({ days: 1 }).toISODate();
    const uid = crypto.createHash('sha1').update(`${a}|${b}`).digest('hex').slice(0, 16);
    return [
      'BEGIN:VEVENT',
      `UID:${uid}@floris-home`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(a)}`,
      `DTEND;VALUE=DATE:${icsDate(end)}`,
      `SUMMARY:Non disponibile - ${name}`,
      'END:VEVENT',
    ].join('\r\n');
  });
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//${name}//Calendario//IT`, 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', `X-WR-CALNAME:${name}`, ...events, 'END:VCALENDAR', ''].join('\r\n');
}

/* ---------- sincronizzazione ---------- */
const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'calendario';

/**
 * Scarica i calendari esterni, aggiorna extBlocked e (se outDir) scrive i file .ics del sito.
 * Se un calendario non risponde, tiene le notti lette l'ultima volta: mai liberare date per un errore di rete.
 */
export async function syncIcal({ outDir = null, log = console.log } = {}) {
  if (!firebaseReady) throw new Error('Firebase non configurato: serve l\'account di servizio.');
  const privRef = db.doc('private/ical');
  const siteRef = db.doc('config/site');
  const [privSnap, siteSnap] = await Promise.all([privRef.get(), siteRef.get()]);
  const priv = privSnap.exists ? privSnap.data() : {};
  const site = siteSnap.exists ? siteSnap.data() : {};
  const feeds = (priv.feeds || []).filter((f) => /^https?:\/\//i.test(f.url || ''));
  const last = priv.lastNights || {};
  const status = {};
  const byFeed = {};
  const yesterday = DateTime.now().setZone(TZ).minus({ days: 1 }).toISODate();

  for (const f of feeds) {
    const id = slug(f.id || f.name);
    try {
      const r = await fetch(f.url, { headers: { 'User-Agent': 'FlorisHome-iCal/1.0' }, signal: AbortSignal.timeout(20000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const text = await r.text();
      if (!text.includes('BEGIN:VCALENDAR')) throw new Error('il link non è un calendario .ics');
      byFeed[id] = parseIcs(text).filter((d) => d >= yesterday);
      status[id] = { ok: true, at: new Date().toISOString(), nights: byFeed[id].length };
      log(`📥 ${f.name || id}: ${byFeed[id].length} notti occupate`);
    } catch (err) {
      byFeed[id] = (last[id] || []).filter((d) => d >= yesterday);
      status[id] = { ok: false, at: new Date().toISOString(), error: err.message, nights: byFeed[id].length };
      log(`⚠️  ${f.name || id}: ${err.message} (tengo le ${byFeed[id].length} notti dell'ultima lettura)`);
    }
  }

  const extBlocked = [...new Set(Object.values(byFeed).flat())].sort();
  // storico (un anno) delle notti occupate fuori dal sito, per le statistiche del pannello
  const since = DateTime.now().setZone(TZ).minus({ days: 400 }).toISODate();
  const history = [...new Set([...(priv.history || []), ...extBlocked])].filter((d) => d >= since).sort();
  await siteRef.set({ extBlocked, extSyncedAt: new Date().toISOString() }, { merge: true });
  await privRef.set({ lastNights: byFeed, status, history, syncedAt: new Date().toISOString() }, { merge: true });

  // conflitti: notti prenotate dal sito che risultano occupate anche fuori
  const own = new Set(site.blocked || []);
  const clash = extBlocked.filter((d) => own.has(d));
  if (clash.length) log(`❗ Notti occupate sia sul sito sia su Booking/Airbnb: ${clash.join(', ')}`);

  if (outDir) {
    await fs.mkdir(outDir, { recursive: true });
    const mine = (site.blocked || []).filter((d) => d >= yesterday);
    // calendar.ics = tutte le notti non disponibili
    await fs.writeFile(path.join(outDir, 'calendar.ics'), buildIcs([...mine, ...extBlocked]));
    // calendar-<id>.ics = tutto tranne le notti che arrivano da quel portale (così non gli rimandiamo le sue)
    for (const id of Object.keys(byFeed)) {
      const others = Object.entries(byFeed).filter(([k]) => k !== id).flatMap(([, v]) => v);
      await fs.writeFile(path.join(outDir, `calendar-${id}.ics`), buildIcs([...mine, ...others]));
    }
    log(`📤 File .ics scritti in ${outDir}`);
  }
  return { extBlocked, status, clash };
}

/** Calendario del sito generato al volo (per il server) */
export async function siteIcs(excludeFeed = null) {
  const [site, priv] = await Promise.all([db.doc('config/site').get(), db.doc('private/ical').get()]);
  const s = site.exists ? site.data() : {};
  const p = priv.exists ? priv.data() : {};
  const byFeed = p.lastNights || {};
  const ext = Object.entries(byFeed).filter(([k]) => k !== excludeFeed).flatMap(([, v]) => v);
  return buildIcs([...(s.blocked || []), ...ext]);
}
