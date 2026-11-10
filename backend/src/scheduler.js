// Messaggi automatici agli ospiti con soggiorno confermato:
//  • il giorno prima dell'arrivo (dalle 10:00): istruzioni + link alla guida della casa (WhatsApp + email)
//  • dopo la partenza (dalle 12:00 del giorno del check-out): richiesta di recensione su Google
// Ogni messaggio parte una volta sola: la data di invio resta salvata sulla prenotazione.
import { DateTime } from 'luxon';
import { env } from './env.js';
import { store } from './store.js';
import { getSettings } from './settings.js';
import { sendEmail } from './google.js';
import { preArrivalEmail, reviewEmail } from './emails.js';
import * as notify from './notify.js';

const TZ = env.timezone;

export function dueMessages(bookings, s, now = DateTime.now().setZone(TZ)) {
  const today = now.toISODate();
  const tomorrow = now.plus({ days: 1 }).toISODate();
  const twoDaysAgo = now.minus({ days: 2 }).toISODate();
  const hour = now.hour;
  const out = [];
  for (const b of bookings) {
    if (b.status !== 'confirmed') continue;
    const confirmedToday = (b.confirmedAt || '').slice(0, 10) === today;
    // arrivo domani (dalle 10) oppure oggi se la conferma è arrivata prima di oggi e non è ancora partito niente
    if (!b.preArrivalSentAt && ((b.from === tomorrow && hour >= 10) || (b.from === today && !confirmedToday))) {
      out.push({ kind: 'preArrival', b });
    }
    if (!b.reviewSentAt && (b.guideCode || s.reviewUrl) && b.to >= twoDaysAgo && (b.to < today || (b.to === today && hour >= 12))) {
      out.push({ kind: 'review', b });
    }
  }
  return out;
}

export async function runScheduler() {
  const s = await getSettings();
  const due = dueMessages(await store.all(), s);
  for (const { kind, b } of due) {
    const mark = kind === 'preArrival' ? 'preArrivalSentAt' : 'reviewSentAt';
    // segno subito come inviato: meglio un messaggio perso che due uguali
    await store.update(b.id, { [mark]: new Date().toISOString() });
    // recensione: prima sul sito (con il codice del soggiorno), altrimenti su Google
    const reviewLink = b.guideCode ? `${env.publicUrl}/#recensione/${b.guideCode}` : s.reviewUrl;
    const mail = kind === 'preArrival' ? preArrivalEmail(b, s) : reviewEmail(b, reviewLink);
    const results = await Promise.allSettled([
      kind === 'preArrival' ? notify.guestPreArrival(b, s) : notify.guestReview(b, reviewLink),
      b.email ? sendEmail({ to: [{ name: b.name, email: b.email }], ...mail }) : Promise.resolve(),
    ]);
    results.filter((r) => r.status === 'rejected').forEach((r) => console.error(`Messaggio ${kind} a ${b.id} fallito:`, r.reason?.message));
    console.log(`${kind === 'preArrival' ? '🗝️ Istruzioni di arrivo' : '⭐ Richiesta recensione'} inviata a ${b.name} (${b.id})`);
  }
  return due.length;
}

export function startScheduler() {
  const tick = () => runScheduler().catch((err) => console.error('Messaggi automatici:', err.message));
  setTimeout(tick, 20_000).unref();
  setInterval(tick, 15 * 60 * 1000).unref();
}
