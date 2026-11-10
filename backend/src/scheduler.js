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
import { db, firebaseReady } from './firebase.js';
import { unavailableSet, nightsBetween } from './settings.js';
import { layout } from './emails.js';

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

/* Lista d'attesa: appena tutte le notti richieste tornano libere (sbloccate da te o cancellate su Booking/Airbnb) avvisa l'ospite */
export async function checkWaitlist(s) {
  if (!firebaseReady) return 0;
  const today = DateTime.now().setZone(TZ).toISODate();
  const snap = await db.collection('waitlist').where('status', '==', 'waiting').get();
  const off = unavailableSet(s);
  let sent = 0;
  for (const docu of snap.docs) {
    const w = { id: docu.id, ...docu.data() };
    if (w.from < today) { await docu.ref.update({ status: 'expired' }); continue; }
    const free = nightsBetween(w.from, w.to).every((n) => !off.has(n));
    if (!free || !s.bookingOpen) continue;
    await docu.ref.update({ status: 'notified', notifiedAt: new Date().toISOString() });
    const link = `${env.publicUrl}/?arrivo=${w.from}&partenza=${w.to}&ospiti=${w.guests || 2}#prenota`;
    const jobs = [notify.guestWaitlistFree(w, link)];
    if (w.email) {
      jobs.push(sendEmail({
        to: [{ name: w.name, email: w.email }],
        subject: `Si sono liberate le tue date a ${env.property.name} 🎉`,
        html: layout({ title: 'Le date sono libere!', intro: `Ciao ${w.name}, si sono liberate le notti che aspettavi. Prenotale prima che le prenda qualcun altro.`, rows: [['Date', `${w.from} → ${w.to}`], ['Ospiti', String(w.guests || 2)]], button: { href: link, label: 'Prenota ora' }, footer: `— ${env.admin.name}` }),
        text: `Ciao ${w.name}, si sono liberate le date che aspettavi (${w.from} → ${w.to}). Prenota qui: ${link}`,
      }));
    }
    const r = await Promise.allSettled(jobs);
    r.filter((x) => x.status === 'rejected').forEach((x) => console.error('Lista d\'attesa:', x.reason?.message));
    console.log(`🔔 Lista d'attesa: avvisato ${w.name} (${w.from} → ${w.to})`);
    sent++;
  }
  return sent;
}

export function startScheduler() {
  const tick = () => {
    runScheduler().catch((err) => console.error('Messaggi automatici:', err.message));
    getSettings().then(checkWaitlist).catch((err) => console.error('Lista d\'attesa:', err.message));
  };
  setTimeout(tick, 20_000).unref();
  setInterval(tick, 15 * 60 * 1000).unref();
}
