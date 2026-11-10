// Tutti i messaggi WhatsApp del flusso, in un posto solo.
// Con WA_USE_TEMPLATES=true usa i template approvati (obbligatori per scrivere per primi a qualcuno).
import { env } from './env.js';
import { sendTemplate, sendText, sendButtons } from './whatsapp.js';
import { fmtStay, fmtDayLong, euro, guestsLabel, transferLine, extrasLine } from './format.js';
import { guideLink } from './guide.js';

const T = env.wa.useTemplates;
// lingua del template per l'ospite: la sua, se hai creato il template in quella lingua
const L = (b) => (env.wa.langs.includes(b.lang) ? b.lang : env.wa.lang);
export const ACCEPT = 'ACCEPT:';
export const REJECT = 'REJECT:';

const extras = (b) => [transferLine(b), extrasLine(b), b.pet && `con animale${b.petFee ? ` (${euro(b.petFee)})` : ''}`, b.notes].filter(Boolean).join(' · ') || '-';

/** A te: nuova richiesta con bottoni Accetta / Rifiuta */
export function adminNewBooking(b) {
  const contact = `${b.email} · +${b.phone}`;
  if (T) {
    return sendTemplate(
      env.admin.phone,
      'nuova_richiesta_casa',
      [b.name, fmtStay(b), guestsLabel(b.guests), euro(b.total), contact, extras(b), b.id],
      [ACCEPT + b.id, REJECT + b.id],
    );
  }
  return sendButtons(
    env.admin.phone,
    `🏠 *Nuova richiesta ${env.property.name}*\n\n👤 ${b.name}\n🗓️ ${fmtStay(b)}\n👥 ${guestsLabel(b.guests)}\n💶 ${euro(b.total)}\n📇 ${contact}\n📝 ${extras(b)}\n\nCodice: *${b.id}*`,
    [
      { id: ACCEPT + b.id, title: '✅ Accetta' },
      { id: REJECT + b.id, title: '❌ Rifiuta' },
    ],
  );
}

/** All'ospite: richiesta ricevuta */
export function guestReceived(b) {
  if (T) return sendTemplate(b.phone, 'richiesta_ricevuta_casa', [b.name, fmtStay(b), euro(b.total), b.id], [], L(b));
  return sendText(
    b.phone,
    `Ciao ${b.name}! 👋 Abbiamo ricevuto la tua richiesta per ${env.property.name}: *${fmtStay(b)}*, totale stimato *${euro(b.total)}*.\nTi confermiamo la disponibilità a breve, qui su WhatsApp.\n\nCodice: ${b.id}`,
  );
}

/** All'ospite: confermata */
export function guestConfirmed(b, s) {
  if (T) return sendTemplate(b.phone, 'soggiorno_confermato', [b.name, fmtStay(b), env.property.address, s.checkIn, b.email], [], L(b));
  return sendText(
    b.phone,
    `Ottime notizie ${b.name}! ✅ Il tuo soggiorno a ${env.property.name} è confermato: *${fmtStay(b)}*.\n\n📍 ${env.property.address}\n🔑 Check-in ${s.checkIn} · check-out ${s.checkOut}${b.transfer ? `\n🚕 ${transferLine(b)}: ti veniamo a prendere noi` : ''}${b.guideCode ? `\n📘 Guida della casa: ${guideLink(b.guideCode)}` : ''}\n\nTi abbiamo mandato tutti i dettagli su ${b.email}. A presto!`,
  );
}

/** All'ospite: non disponibile */
export function guestRejected(b) {
  const link = `${env.publicUrl}/#prenota`;
  if (T) return sendTemplate(b.phone, 'soggiorno_rifiutato', [b.name, fmtStay(b), link], [], L(b));
  return sendText(
    b.phone,
    `Ciao ${b.name}, purtroppo ${env.property.name} non è disponibile per *${fmtStay(b)}* 😕\nPuoi scegliere altre date qui: ${link}`,
  );
}

/** All'ospite, il giorno prima: come arrivare + guida della casa */
export function guestPreArrival(b, s) {
  const link = b.guideCode ? guideLink(b.guideCode) : `${env.publicUrl}/#guida`;
  if (T) return sendTemplate(b.phone, 'istruzioni_arrivo', [b.name, fmtDayLong(b.from), s.checkIn, env.property.address, link], [], L(b));
  return sendText(
    b.phone,
    `Ciao ${b.name}! 🗝️ Ti aspettiamo domani, ${fmtDayLong(b.from)} (check-in ${s.checkIn}).\n📍 ${env.property.address}\n\nNella guida trovi come entrare, il Wi-Fi, il parcheggio e i numeri utili:\n${link}${(b.guests || 1) > 1 ? '\n\n📝 Se non l\'hai già fatto, mandaci oggi i dati degli altri ospiti (nome, data di nascita, nazionalità, documento).' : ''}\n\nBuon viaggio!`,
  );
}

/** All'ospite, dopo la partenza: recensione su Google */
export function guestReview(b, url) {
  if (T) return sendTemplate(b.phone, 'richiesta_recensione', [b.name, url], [], L(b));
  return sendText(
    b.phone,
    `Ciao ${b.name}, grazie di essere stato/a da noi a ${env.property.name}! 🙏\nSe ti sei trovato/a bene, ci lasci una recensione? Ci aiuta tantissimo:\n${url}`,
  );
}

/** A chi era in lista d'attesa: le date si sono liberate */
export function guestWaitlistFree(w, link) {
  const stay = fmtStay(w);
  if (T) return sendTemplate(w.phone, 'date_libere', [String(w.name).split(' ')[0], stay, link], [], L(w));
  return sendText(
    w.phone,
    w.lang && w.lang !== 'it'
      ? `Hi ${String(w.name).split(' ')[0]}! 🎉 Good news: the dates you were waiting for at ${env.property.name} (${stay}) are now available. Book them here before someone else does:\n${link}`
      : `Ciao ${String(w.name).split(' ')[0]}! 🎉 Buone notizie: a ${env.property.name} si sono liberate le date che aspettavi (${stay}). Prenotale qui prima che le prenda qualcun altro:\n${link}`,
  );
}

/** A te: risposta libera (mi hai appena scritto, quindi la finestra di 24h è aperta) */
export const replyAdmin = (text) => sendText(env.admin.phone, text);
