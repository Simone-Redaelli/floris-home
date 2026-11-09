import { env } from './env.js';
import { fmtDayLong, euro, guestsLabel, transferLine, escapeHtml as h } from './format.js';

function layout({ title, intro, rows, button, footer }) {
  const rowsHtml = rows
    .map(([k, v]) => `
      <tr>
        <td style="padding:10px 0;color:#8a7d70;font-size:14px;width:130px;vertical-align:top">${h(k)}</td>
        <td style="padding:10px 0;color:#221d18;font-size:15px;font-weight:600">${h(v)}</td>
      </tr>`)
    .join('');
  return `<!doctype html>
<html lang="it"><body style="margin:0;background:#faf7f2;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 50px -30px rgba(90,60,32,.4)">
        <tr><td style="height:6px;background:linear-gradient(90deg,#7f927c,#b5794a)"></td></tr>
        <tr><td style="padding:34px 34px 8px">
          <div style="display:inline-block;width:40px;height:40px;line-height:40px;text-align:center;border-radius:50%;background:#b5794a;color:#fff;font-family:Georgia,serif;font-style:italic;font-size:20px">F</div>
          <h1 style="margin:16px 0 0;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:30px;line-height:1.15;color:#221d18">${h(title)}</h1>
          <p style="margin:14px 0 0;color:#6f655a;font-size:15px;line-height:1.6">${intro}</p>
        </td></tr>
        <tr><td style="padding:14px 34px">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #efe6da;border-bottom:1px solid #efe6da">${rowsHtml}</table>
        </td></tr>
        ${button ? `<tr><td style="padding:20px 34px 6px">
          <a href="${h(button.href)}" style="display:inline-block;background:#b5794a;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 26px;border-radius:999px">${h(button.label)}</a>
        </td></tr>` : ''}
        <tr><td style="padding:22px 34px 34px;color:#8a7d70;font-size:13px;line-height:1.6">${footer}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function confirmedEmail(b, s) {
  const subject = `✅ Soggiorno confermato – ${env.property.name}`;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(env.property.address)}`;
  const rows = [
    ['Arrivo', `${fmtDayLong(b.from)} · ${s.checkIn}`],
    ['Partenza', `${fmtDayLong(b.to)} · ${s.checkOut}`],
    ['Ospiti', guestsLabel(b.guests) + (b.pet ? ' + animale' : '')],
    ...(b.transfer ? [['Transfer', transferLine(b).replace('Transfer ', '')]] : []),
    ['Totale', euro(b.total)],
    ['Cauzione', `${euro(s.deposit)} in contanti, restituita al check-out`],
    ['Indirizzo', env.property.address],
    ['Codice', b.id],
  ];
  const html = layout({
    title: 'Ti aspettiamo a Bergamo!',
    intro: `Ciao ${h(b.name)}, il tuo soggiorno a <b>${h(env.property.name)}</b> è confermato. Trovi l'evento anche nel tuo Google Calendar (controlla l'invito che ti è arrivato).`,
    rows,
    button: { href: maps, label: '📍 Apri su Google Maps' },
    footer: `${b.transfer ? 'Ti veniamo a prendere noi all\'aeroporto di Orio al Serio: scrivici su WhatsApp se il volo cambia orario.<br>' : ''}Parcheggio gratuito, Wi-Fi e biancheria inclusi. Per qualsiasi cosa rispondi a questa email o scrivici su WhatsApp.<br><br>— ${h(env.admin.name)}`,
  });
  const text = [
    `Ciao ${b.name}, il tuo soggiorno a ${env.property.name} è confermato!`,
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    `Mappa: ${maps}`,
    '',
    'Per qualsiasi cosa rispondi a questa email o scrivici su WhatsApp.',
    `— ${env.admin.name}`,
  ].join('\n');
  return { subject, html, text };
}

export function rejectedEmail(b) {
  const link = `${env.publicUrl}/#prenota`;
  const subject = `${env.property.name}: date non disponibili`;
  const html = layout({
    title: 'Queste date non sono disponibili',
    intro: `Ciao ${h(b.name)}, purtroppo ${h(env.property.name)} non è disponibile dal <b>${h(fmtDayLong(b.from))}</b> al <b>${h(fmtDayLong(b.to))}</b>. Ci dispiace! Puoi scegliere altre date dal sito.`,
    rows: [['Codice', b.id]],
    button: { href: link, label: 'Scegli altre date' },
    footer: `— ${h(env.admin.name)}`,
  });
  const text = `Ciao ${b.name}, purtroppo ${env.property.name} non è disponibile dal ${fmtDayLong(b.from)} al ${fmtDayLong(b.to)}.\nPuoi scegliere altre date qui: ${link}\n\n— ${env.admin.name}`;
  return { subject, html, text };
}
