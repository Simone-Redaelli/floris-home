import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { env, checkEnv, digits } from './env.js';
import { auth, firebaseReady } from './firebase.js';
import { store, newCode } from './store.js';
import { getSettings, quote, isDay, today, EXTRAS } from './settings.js';
import { webhook } from './webhook.js';
import { acceptBooking, rejectBooking } from './decisions.js';
import * as notify from './notify.js';
import { syncIcal, siteIcs } from './ical.js';
import { startScheduler } from './scheduler.js';

checkEnv();

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
// rawBody serve per verificare la firma del webhook di Meta
app.use(express.json({ limit: '50kb', verify: (req, _res, buf) => { req.rawBody = buf; } }));
app.use('/api', cors({ origin: env.allowedOrigins.length ? env.allowedOrigins : true }));

// ── API pubbliche ────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true, dryRun: env.dryRun, firebase: firebaseReady }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Troppe richieste. Riprova tra qualche minuto.' },
});

const EMAIL_RE = /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[a-z]{2,}$/i;
const str = (v, max) => String(v ?? '').trim().replace(/\s+/g, ' ').slice(0, max);
function normalizePhone(raw) {
  let p = digits(raw);
  if (p.startsWith('00')) p = p.slice(2);
  if (/^3\d{8,9}$/.test(p)) p = `39${p}`; // cellulare italiano scritto senza prefisso
  return /^\d{8,15}$/.test(p) ? p : null;
}

const STATUS_ERR = {
  closed: 'Al momento non accettiamo prenotazioni.',
  empty: 'Scegli le date di arrivo e partenza.',
  past: 'Le date sono nel passato.',
  unavailable: 'Alcune notti sono già occupate: scegli altre date.',
  min: 'Il soggiorno è più corto del minimo richiesto.',
  guests: 'Troppi ospiti per questo appartamento.',
};

app.post('/api/bookings', limiter, async (req, res) => {
  const body = req.body ?? {};
  if (body.website) return res.json({ ok: true, id: newCode(), status: 'pending' }); // honeypot anti-bot

  const name = str(body.name || `${body.guest?.firstName ?? ''} ${body.guest?.lastName ?? ''}`, 120);
  const email = str(body.email, 120).toLowerCase();
  const phone = normalizePhone(body.phone);
  const from = String(body.from ?? '');
  const to = String(body.to ?? '');
  const guests = Math.max(1, Math.min(20, Number(body.guests) || 1));
  const pet = body.pet === true;
  const transfer = body.transfer === true;
  const arrivalTime = /^\d{2}:\d{2}$/.test(String(body.arrivalTime ?? '')) ? body.arrivalTime : '';
  const flight = str(body.flight, 20).toUpperCase();
  const notes = String(body.notes ?? '').trim().slice(0, 600);

  // Dati per Alloggiati Web (ospite principale completo, altri ospiti anagrafica)
  const g = body.guest ?? {};
  const isBirth = (d) => /^\d{4}-\d{2}-\d{2}$/.test(String(d ?? '')) && String(d) < today();
  const ageOf = (d) => {
    if (!isBirth(d)) return null;
    const [y, m, dd] = d.split('-').map(Number);
    const n = new Date();
    let a = n.getFullYear() - y;
    if (n.getMonth() + 1 < m || (n.getMonth() + 1 === m && n.getDate() < dd)) a--;
    return a;
  };
  const DOCS = ["Carta d'identità", 'Passaporto', 'Patente di guida'];
  const guest = {
    firstName: str(g.firstName, 60),
    lastName: str(g.lastName, 60),
    sex: ['M', 'F'].includes(g.sex) ? g.sex : '',
    birthDate: isBirth(g.birthDate) ? g.birthDate : '',
    birthPlace: str(g.birthPlace, 80),
    birthCountry: str(g.birthCountry, 60),
    nationality: str(g.nationality, 60),
    residence: str(g.residence, 80),
    docType: DOCS.includes(g.docType) ? g.docType : '',
    docNumber: str(g.docNumber, 30).toUpperCase().replace(/\s/g, ''),
    docIssuedBy: str(g.docIssuedBy, 80),
  };
  const others = (Array.isArray(body.others) ? body.others : []).slice(0, 19).map((o) => ({
    firstName: str(o?.firstName, 60),
    lastName: str(o?.lastName, 60),
    sex: ['M', 'F'].includes(o?.sex) ? o.sex : '',
    birthDate: isBirth(o?.birthDate) ? o.birthDate : '',
    nationality: str(o?.nationality, 60),
    residence: str(o?.residence, 80),
  })).filter((o) => o.firstName || o.lastName);

  const errors = [];
  if (name.length < 2 || !guest.firstName || !guest.lastName) errors.push('nome e cognome');
  if (!guest.sex) errors.push('sesso');
  const age = ageOf(guest.birthDate);
  if (age === null) errors.push('data di nascita');
  else if (age < 18) errors.push("età (l'ospite principale deve essere maggiorenne)");
  if (!guest.birthPlace || !guest.birthCountry) errors.push('luogo di nascita');
  if (!guest.nationality) errors.push('nazionalità');
  // per gli italiani serve la città di residenza (anche per gli altri ospiti già inseriti)
  const IT = /^(italia|italy|italie|italien|italiana?|italiano|włochy|wlochy)$/i;
  if (IT.test(guest.nationality) && !guest.residence) errors.push('città di residenza');
  if (others.some((o) => o.firstName && IT.test(o.nationality || '') && !o.residence)) errors.push('città di residenza degli altri ospiti');
  if (!guest.docType || guest.docNumber.length < 5 || !guest.docIssuedBy) errors.push('documento');
  if (!EMAIL_RE.test(email)) errors.push('email');
  if (!phone) errors.push('numero WhatsApp');
  if (!isDay(from) || !isDay(to) || to <= from) errors.push('date');
  if (body.consent !== true) errors.push('consenso privacy');
  if (errors.length) return res.status(400).json({ error: `Controlla: ${errors.join(', ')}.` });

  let s;
  try {
    s = await getSettings();
  } catch (err) {
    console.error('Errore lettura impostazioni:', err);
    return res.status(502).json({ error: 'Errore temporaneo, riprova tra poco.' });
  }
  // minorenni esenti dalla tassa di soggiorno
  const minors = others.filter((o) => { const a = ageOf(o.birthDate); return a !== null && a < 18; }).length;
  const extras = (Array.isArray(body.extras) ? body.extras : []).map(String).filter((x) => EXTRAS.some((e) => e.id === x));
  const lang = ['it', 'en', 'fr', 'es', 'de', 'pl'].includes(body.lang) ? body.lang : 'it';
  const q = quote({ from, to, guests, adults: guests - minors, transfer, extras }, s);
  if (q.status !== 'ok') return res.status(409).json({ error: STATUS_ERR[q.status] || 'Date non valide.' });

  const booking = {
    id: newCode(),
    status: 'pending',
    name, email, phone, guests, pet, notes,
    // dati riservati: non compaiono in WhatsApp, email o calendario, solo nel pannello admin
    checkin: { guest: { ...guest, age }, others },
    from, to,
    nights: q.nights.length,
    nightList: q.nights,
    transfer: transfer && Boolean(s.transferEnabled),
    arrivalTime, flight,
    stay: q.stay,
    cleaning: q.cleaning,
    transferFee: q.transferFee,
    extras: q.extras,
    extrasTotal: q.extrasTotal,
    tax: q.tax,
    total: q.total,
    lang,
    createdAt: new Date().toISOString(),
  };

  let saved;
  try {
    saved = await store.create(booking);
  } catch (err) {
    console.error('Errore salvataggio:', err);
    return res.status(502).json({ error: 'Errore temporaneo, riprova tra poco.' });
  }

  const [adminRes, guestRes] = await Promise.allSettled([notify.adminNewBooking(saved), notify.guestReceived(saved)]);
  if (adminRes.status === 'rejected') console.error('❗ WhatsApp ad admin fallito:', adminRes.reason);
  if (guestRes.status === 'rejected') console.error('WhatsApp a ospite fallito:', guestRes.reason);

  console.log(`🆕 Richiesta ${saved.id} · ${saved.name} · ${saved.from} → ${saved.to} · €${saved.total}`);
  res.status(201).json({ ok: true, id: saved.id, status: saved.status, total: saved.total, whatsappSent: guestRes.status === 'fulfilled' });
});

// ── API del pannello admin (login Firebase) ──────────────────
async function requireAdmin(req, res, next) {
  try {
    if (!firebaseReady) {
      if (env.dryRun) return next();
      return res.status(503).json({ error: 'Firebase non configurato sul server.' });
    }
    const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
    const user = await auth.verifyIdToken(token);
    if (!env.admin.panelEmail || (user.email || '').toLowerCase() !== env.admin.panelEmail) {
      return res.status(403).json({ error: 'Account non autorizzato.' });
    }
    next();
  } catch {
    res.status(401).json({ error: 'Sessione scaduta: rientra nel pannello.' });
  }
}

app.post('/api/admin/bookings/:id/:action(accept|reject)', requireAdmin, async (req, res) => {
  const id = String(req.params.id).toUpperCase();
  try {
    const r = req.params.action === 'accept' ? await acceptBooking(id) : await rejectBooking(id);
    res.status(r.ok ? 200 : 409).json({ ok: r.ok, message: r.message.replace(/\*/g, '') });
  } catch (err) {
    console.error('Errore decisione dal pannello:', err);
    res.status(500).json({ error: err.message });
  }
});

// Sincronizza subito i calendari Booking/Airbnb (bottone nel pannello)
app.post('/api/admin/ical/sync', requireAdmin, async (_req, res) => {
  try {
    const r = await syncIcal();
    res.json({ ok: true, nights: r.extBlocked.length, clash: r.clash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Calendario del sito da incollare su Booking/Airbnb: /calendar.ics oppure /calendar-booking.ics
app.get(/^\/calendar(?:-([a-z0-9-]+))?\.ics$/, async (req, res) => {
  if (!firebaseReady) return res.status(503).send('Firebase non configurato');
  try {
    res.type('text/calendar; charset=utf-8').send(await siteIcs(req.params[0] || null));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ── Webhook WhatsApp ─────────────────────────────────────────
app.use(webhook);

// ── Rotte di test (solo DRY_RUN) ─────────────────────────────
if (env.dryRun) {
  app.get('/api/dev/bookings', async (_req, res) => res.json(await store.all()));
  // Simula il bottone WhatsApp: apri http://localhost:3002/api/dev/accept/CODICE
  app.get('/api/dev/:action(accept|reject)/:id', async (req, res) => {
    const id = req.params.id.toUpperCase();
    const r = req.params.action === 'accept' ? await acceptBooking(id) : await rejectBooking(id);
    res.type('text').send(r.message);
  });
}

// ── Pulizia: richieste mai gestite con arrivo ormai passato → scadute ──
async function expireOld() {
  const t = today();
  for (const b of await store.all()) {
    if (b.status === 'pending' && b.from < t) await store.transition(b.id, 'pending', 'expired');
  }
}
setInterval(() => expireOld().catch(console.error), 60 * 60 * 1000).unref();

// ── Calendari Booking/Airbnb ogni 30 minuti ──
if (firebaseReady) {
  const tick = () => syncIcal({ log: () => {} }).catch((err) => console.error('Sync iCal:', err.message));
  setTimeout(tick, 10_000).unref();
  setInterval(tick, 30 * 60 * 1000).unref();
}

// ── Messaggi automatici (istruzioni prima dell'arrivo, recensione dopo la partenza) ──
startScheduler();

app.listen(env.port, () => console.log(`🚀 Server su http://localhost:${env.port}`));
