// Cosa succede quando accetti o rifiuti (da WhatsApp o dal pannello admin).
import { env } from './env.js';
import { store } from './store.js';
import { getSettings, blockNights } from './settings.js';
import { createStayEvent, createTransferEvent, sendEmail } from './google.js';
import { confirmedEmail, rejectedEmail } from './emails.js';
import * as notify from './notify.js';
import { fmtStay, fmtDay, euro, STATUS_LABEL } from './format.js';

const admin = () => ({ name: env.admin.name, email: env.admin.email });

async function alreadyHandled(id) {
  const cur = await store.get(id);
  return cur
    ? `ℹ️ La richiesta ${id} è già ${STATUS_LABEL[cur.status] ?? cur.status}.`
    : `❓ Nessuna richiesta con codice ${id}.`;
}

export async function acceptBooking(id) {
  const b = await store.transition(id, 'pending', 'processing');
  if (!b) return { ok: false, message: await alreadyHandled(id) };

  // Le notti sono ancora libere? (nel frattempo potresti averle bloccate o accettato un'altra richiesta)
  const s = await getSettings();
  const blocked = new Set(s.blocked || []);
  const taken = b.nightList.filter((d) => blocked.has(d));
  if (taken.length) {
    await store.update(id, { status: 'pending' });
    return {
      ok: false,
      message: `⚠️ Non posso confermare ${id}: le notti ${taken.map(fmtDay).join(', ')} risultano già occupate. Rispondi "no ${id}" per avvisare l'ospite.`,
    };
  }

  await blockNights(b.nightList);

  const problems = [];
  let ev = { eventId: null, eventLink: null };
  try {
    ev = await createStayEvent(b, s);
    await createTransferEvent(b).catch((err) => problems.push(`promemoria transfer non creato (${err.message})`));
  } catch (err) {
    console.error('Errore evento calendario:', err);
    problems.push(`evento Google Calendar non creato (${err.message})`);
  }

  const confirmed = await store.update(id, { status: 'confirmed', ...ev, confirmedAt: new Date().toISOString() });

  const mail = confirmedEmail(confirmed, s);
  const [emailRes, waRes] = await Promise.allSettled([
    sendEmail({ to: [{ name: b.name, email: b.email }], cc: [admin()], ...mail }),
    notify.guestConfirmed(confirmed, s),
  ]);
  if (emailRes.status === 'rejected') problems.push(`email non inviata (${emailRes.reason.message})`);
  if (waRes.status === 'rejected') problems.push(`WhatsApp all'ospite non inviato (${waRes.reason.message})`);
  problems.forEach((p) => console.error('⚠️', p));

  return {
    ok: true,
    booking: confirmed,
    message: [
      `✅ *Confermata* · ${b.name}`,
      `🗓️ ${fmtStay(b)} · ${euro(b.total)}`,
      b.transfer ? `🚕 Transfer da Orio${b.arrivalTime ? ` alle ${b.arrivalTime}` : ''}${b.flight ? ` (volo ${b.flight})` : ''}` : null,
      '🔒 Notti bloccate sul calendario del sito.',
      problems.length ? `⚠️ Attenzione: ${problems.join('; ')}.` : '📨 Email, invito Google Calendar e WhatsApp inviati.',
    ].filter(Boolean).join('\n'),
  };
}

export async function rejectBooking(id) {
  const b = await store.transition(id, 'pending', 'rejected');
  if (!b) return { ok: false, message: await alreadyHandled(id) };
  const results = await Promise.allSettled([
    notify.guestRejected(b),
    sendEmail({ to: [{ name: b.name, email: b.email }], ...rejectedEmail(b) }),
  ]);
  results.filter((r) => r.status === 'rejected').forEach((r) => console.error('Notifica rifiuto fallita:', r.reason));
  return { ok: true, booking: b, message: `❌ *Rifiutata* · ${b.name} (${fmtStay(b)}). L'ho avvisato/a con il link per scegliere altre date.` };
}

export async function listPending() {
  const pending = (await store.all()).filter((b) => b.status === 'pending').sort((a, b) => a.from.localeCompare(b.from));
  if (!pending.length) return '📭 Nessuna richiesta in attesa.';
  return [
    `📋 *Richieste in attesa (${pending.length})*`,
    ...pending.map((b) => `• *${b.id}* — ${b.name}, ${fmtStay(b)}, ${euro(b.total)}`),
    '',
    'Rispondi "si CODICE" o "no CODICE".',
  ].join('\n');
}

export const HELP = [
  '🤖 *Comandi*',
  '• Premi ✅ Accetta / ❌ Rifiuta sotto la richiesta',
  '• oppure scrivi "si CODICE" / "no CODICE"',
  '• "lista" → richieste in attesa',
].join('\n');

/** Interpreta un comando in arrivo da te su WhatsApp. Restituisce il testo da mandarti. */
export async function handleAdminCommand(raw) {
  const text = String(raw ?? '').trim();
  if (text.startsWith(notify.ACCEPT)) return (await acceptBooking(text.slice(notify.ACCEPT.length))).message;
  if (text.startsWith(notify.REJECT)) return (await rejectBooking(text.slice(notify.REJECT.length))).message;
  const m = text.match(/^(si|sì|ok|accetta|conferma|no|rifiuta)\s+#?([a-z0-9]{6})$/i);
  if (m) {
    const id = m[2].toUpperCase();
    return (/^(no|rifiuta)$/i.test(m[1]) ? await rejectBooking(id) : await acceptBooking(id)).message;
  }
  if (/^(lista|pending|richieste)$/i.test(text)) return listPending();
  return HELP;
}
