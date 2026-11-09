import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { env, checkEnv, digits } from './env.js';
import { auth, firebaseReady } from './firebase.js';
import { store, newCode } from './store.js';
import { getSettings, quote, isDay, today } from './settings.js';
import { webhook } from './webhook.js';
import { acceptBooking, rejectBooking } from './decisions.js';
import * as notify from './notify.js';

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

  const name = str(body.name, 80);
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

  const errors = [];
  if (name.length < 2) errors.push('nome');
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
  const q = quote({ from, to, guests, transfer }, s);
  if (q.status !== 'ok') return res.status(409).json({ error: STATUS_ERR[q.status] || 'Date non valide.' });

  const booking = {
    id: newCode(),
    status: 'pending',
    name, email, phone, guests, pet, notes,
    from, to,
    nights: q.nights.length,
    nightList: q.nights,
    transfer: transfer && Boolean(s.transferEnabled),
    arrivalTime, flight,
    stay: q.stay,
    cleaning: q.cleaning,
    transferFee: q.transferFee,
    total: q.total,
    createdAt: new Date().toISOString(),
    ip: req.ip,
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

app.listen(env.port, () => console.log(`🚀 Server su http://localhost:${env.port}`));
