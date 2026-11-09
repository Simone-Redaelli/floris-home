// Tutti i messaggi WhatsApp del flusso, in un posto solo.
// Con WA_USE_TEMPLATES=true usa i template approvati (obbligatori per scrivere per primi a qualcuno).
import { env } from './env.js';
import { sendTemplate, sendText, sendButtons } from './whatsapp.js';
import { fmtStay, euro, guestsLabel, transferLine } from './format.js';

const T = env.wa.useTemplates;
export const ACCEPT = 'ACCEPT:';
export const REJECT = 'REJECT:';

const extras = (b) => [transferLine(b), b.pet && 'con animale', b.notes].filter(Boolean).join(' · ') || '-';

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
  if (T) return sendTemplate(b.phone, 'richiesta_ricevuta_casa', [b.name, fmtStay(b), euro(b.total), b.id]);
  return sendText(
    b.phone,
    `Ciao ${b.name}! 👋 Abbiamo ricevuto la tua richiesta per ${env.property.name}: *${fmtStay(b)}*, totale stimato *${euro(b.total)}*.\nTi confermiamo la disponibilità a breve, qui su WhatsApp.\n\nCodice: ${b.id}`,
  );
}

/** All'ospite: confermata */
export function guestConfirmed(b, s) {
  if (T) return sendTemplate(b.phone, 'soggiorno_confermato', [b.name, fmtStay(b), env.property.address, s.checkIn, b.email]);
  return sendText(
    b.phone,
    `Ottime notizie ${b.name}! ✅ Il tuo soggiorno a ${env.property.name} è confermato: *${fmtStay(b)}*.\n\n📍 ${env.property.address}\n🔑 Check-in ${s.checkIn} · check-out ${s.checkOut}${b.transfer ? `\n🚕 ${transferLine(b)}: ti veniamo a prendere noi` : ''}\n\nTi abbiamo mandato tutti i dettagli su ${b.email}. A presto!`,
  );
}

/** All'ospite: non disponibile */
export function guestRejected(b) {
  const link = `${env.publicUrl}/#prenota`;
  if (T) return sendTemplate(b.phone, 'soggiorno_rifiutato', [b.name, fmtStay(b), link]);
  return sendText(
    b.phone,
    `Ciao ${b.name}, purtroppo ${env.property.name} non è disponibile per *${fmtStay(b)}* 😕\nPuoi scegliere altre date qui: ${link}`,
  );
}

/** A te: risposta libera (mi hai appena scritto, quindi la finestra di 24h è aperta) */
export const replyAdmin = (text) => sendText(env.admin.phone, text);
