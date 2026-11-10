import { DateTime } from 'luxon';
import { env } from './env.js';

const D = (s) => DateTime.fromISO(s, { zone: env.timezone }).setLocale('it');

/** "ven 20 nov" */
export const fmtDay = (s) => D(s).toFormat('ccc d LLL');
/** "venerdì 20 novembre 2026" */
export const fmtDayLong = (s) => D(s).toFormat('cccc d LLLL yyyy');
/** "ven 20 nov → lun 23 nov (3 notti)" */
export const fmtStay = (b) => `${fmtDay(b.from)} → ${fmtDay(b.to)} (${b.nights} ${b.nights === 1 ? 'notte' : 'notti'})`;
export const euro = (n) => {
  const v = Math.round((Number(n) || 0) * 100) / 100;
  return `€${Number.isInteger(v) ? v.toLocaleString('it-IT') : v.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
export const guestsLabel = (n) => `${n} ${n === 1 ? 'ospite' : 'ospiti'}`;

/** Riga transfer: "Transfer da Orio al Serio (arrivo 18:30, volo FR1234)" */
export function transferLine(b) {
  if (!b.transfer) return null;
  const extra = [b.arrivalTime && `arrivo ${b.arrivalTime}`, b.flight && `volo ${b.flight}`].filter(Boolean).join(', ');
  return `Transfer da Orio al Serio${extra ? ` (${extra})` : ''}`;
}

/** "Culla, Kit colazione ×3" */
export const extrasLine = (b) => (b.extras || []).map((e) => `${e.name}${e.qty > 1 ? ` ×${e.qty}` : ''}`).join(', ') || null;

/** Primo orario "HH:MM" dentro un testo tipo "16:00 – 20:00", altrimenti fallback */
export const firstTime = (text, fallback) => (String(text || '').match(/(\d{1,2}):(\d{2})/) || [null])[0] || fallback;

export const STATUS_LABEL = {
  pending: 'in attesa',
  processing: 'in elaborazione',
  confirmed: 'confermata',
  rejected: 'rifiutata',
  expired: 'scaduta',
};

export const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
