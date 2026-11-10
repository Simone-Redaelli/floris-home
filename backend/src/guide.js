// Guida digitale della casa: per ogni soggiorno confermato crea un codice personale.
//  guestGuides/{codice}  → dati riservati (Wi-Fi, come entrare). Si legge solo conoscendo il codice, fino a 2 giorni dopo la partenza.
//  guestAccess/{codice}  → chi è l'ospite e come contattarlo (solo admin).
import crypto from 'node:crypto';
import { DateTime } from 'luxon';
import { db, firebaseReady, Timestamp } from './firebase.js';
import { env } from './env.js';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const newGuideCode = () => Array.from(crypto.randomBytes(8), (b) => ALPHABET[b % ALPHABET.length]).join('');
export const prettyCode = (c) => `${c.slice(0, 4)}-${c.slice(4)}`;
export const guideLink = (code) => `${env.publicUrl}/#guida/${code}`;

export async function createGuide(b) {
  const code = newGuideCode();
  if (!firebaseReady) {
    console.log(`📘 [senza Firebase] Guida per ${b.name}: ${guideLink(code)}`);
    return code;
  }
  const priv = (await db.doc('private/guide').get()).data() || {};
  const expires = DateTime.fromISO(b.to, { zone: env.timezone }).plus({ days: 2 }).endOf('day').toJSDate();
  await db.doc(`guestGuides/${code}`).set({
    name: String(b.name || '').split(' ')[0],
    from: b.from,
    to: b.to,
    guests: b.guests,
    wifiName: priv.wifiName || '',
    wifiPass: priv.wifiPass || '',
    entry: priv.entry || '',
    expiresAt: Timestamp.fromDate(expires),
    createdAt: new Date().toISOString(),
  });
  await db.doc(`guestAccess/${code}`).set({
    code, bookingId: b.id, name: b.name, phone: b.phone || '', email: b.email || '',
    from: b.from, to: b.to, guests: b.guests, lang: b.lang || 'it', createdAt: new Date().toISOString(),
  });
  return code;
}
