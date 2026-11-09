import crypto from 'node:crypto';
import { google } from 'googleapis';
import { DateTime } from 'luxon';
import { env } from './env.js';
import { euro, guestsLabel, transferLine, firstTime } from './format.js';

const auth = new google.auth.OAuth2(env.google.clientId, env.google.clientSecret);
if (env.google.refreshToken) auth.setCredentials({ refresh_token: env.google.refreshToken });
const calendar = google.calendar({ version: 'v3', auth });
const gmail = google.gmail({ version: 'v1', auth });

export const googleReady = () => Boolean(env.google.clientId && env.google.clientSecret && env.google.refreshToken);

/**
 * Evento sul tuo Google Calendar dal check-in al check-out, con l'ospite invitato.
 * sendUpdates:'all' → Google manda l'invito calendario via email all'ospite.
 */
export async function createStayEvent(b, s) {
  if (env.dryRun || !googleReady()) {
    console.log(`📅 [${env.dryRun ? 'DRY_RUN' : 'Google non configurato'}] Evento soggiorno ${b.from} → ${b.to} per ${b.name}`);
    return { eventId: null, eventLink: null };
  }
  const at = (day, hhmm) => {
    const [hour, minute] = hhmm.split(':').map(Number);
    return DateTime.fromISO(day, { zone: env.timezone }).set({ hour, minute }).toISO();
  };
  const res = await calendar.events.insert({
    calendarId: env.google.calendarId,
    sendUpdates: 'all',
    requestBody: {
      summary: `🏠 ${env.property.name} – ${b.name} (${guestsLabel(b.guests)})`,
      location: env.property.address,
      description: [
        `Soggiorno confermato · ${b.nights} ${b.nights === 1 ? 'notte' : 'notti'} · totale ${euro(b.total)}`,
        transferLine(b),
        b.pet ? 'Con animale domestico' : null,
        b.notes ? `Note: ${b.notes}` : null,
        '',
        `Check-in ${s.checkIn} · check-out ${s.checkOut}`,
        `Cauzione ${euro(s.deposit)} in contanti all'arrivo`,
        '',
        `Ospite: ${b.name} · ${b.email} · +${b.phone}`,
        `Codice: ${b.id}`,
      ].filter((l) => l !== null).join('\n'),
      start: { dateTime: at(b.from, firstTime(s.checkIn, '16:00')), timeZone: env.timezone },
      end: { dateTime: at(b.to, firstTime(s.checkOut, '10:00')), timeZone: env.timezone },
      attendees: [{ email: b.email, displayName: b.name }],
      guestsCanInviteOthers: false,
      reminders: { useDefault: false, overrides: [{ method: 'email', minutes: 24 * 60 }, { method: 'popup', minutes: 120 }] },
      extendedProperties: { private: { bookingId: b.id } },
    },
  });
  return { eventId: res.data.id, eventLink: res.data.htmlLink };
}

/** Promemoria separato per il transfer (solo sul tuo calendario) */
export async function createTransferEvent(b) {
  if (!b.transfer || env.dryRun || !googleReady() || !b.arrivalTime) return null;
  const [hour, minute] = b.arrivalTime.split(':').map(Number);
  const start = DateTime.fromISO(b.from, { zone: env.timezone }).set({ hour, minute });
  const res = await calendar.events.insert({
    calendarId: env.google.calendarId,
    requestBody: {
      summary: `🚕 Transfer Orio → ${env.property.name} – ${b.name}`,
      location: 'Aeroporto di Bergamo Orio al Serio',
      description: [`Volo: ${b.flight || 'non indicato'}`, `Ospite: ${b.name} · +${b.phone}`, `Codice: ${b.id}`].join('\n'),
      start: { dateTime: start.toISO(), timeZone: env.timezone },
      end: { dateTime: start.plus({ minutes: 45 }).toISO(), timeZone: env.timezone },
      reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 60 }] },
    },
  });
  return res.data.id;
}

// ── Gmail ────────────────────────────────────────────────────
const encWord = (s) => `=?UTF-8?B?${Buffer.from(String(s)).toString('base64')}?=`;
const b64Lines = (s) => Buffer.from(s).toString('base64').replace(/.{76}/g, '$&\r\n');
const addr = (name, email) => `${encWord(name)} <${email}>`;

/** Invia un'email dalla tua Gmail. to/cc: [{name, email}] */
export async function sendEmail({ to, cc = [], subject, html, text }) {
  if (env.dryRun || !googleReady()) {
    console.log(`✉️  [${env.dryRun ? 'DRY_RUN' : 'Google non configurato'}] Email "${subject}" → ${[...to, ...cc].map((x) => x.email).join(', ')}`);
    return;
  }
  const boundary = `b_${crypto.randomBytes(12).toString('hex')}`;
  const mime = [
    `From: ${addr(env.admin.name, env.admin.email)}`,
    `To: ${to.map((x) => addr(x.name, x.email)).join(', ')}`,
    cc.length ? `Cc: ${cc.map((x) => addr(x.name, x.email)).join(', ')}` : null,
    `Reply-To: ${env.admin.email}`,
    `Subject: ${encWord(subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    b64Lines(text),
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    b64Lines(html),
    `--${boundary}--`,
  ].filter((l) => l !== null).join('\r\n');
  await gmail.users.messages.send({ userId: 'me', requestBody: { raw: Buffer.from(mime).toString('base64url') } });
}
