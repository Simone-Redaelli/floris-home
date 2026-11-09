// Archivio richieste di soggiorno: Firestore (collezione "bookings") se configurato,
// altrimenti un file JSON in ./data. Tutti i cambi di stato sono atomici: niente doppie accettazioni.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { env } from './env.js';
import { db, firebaseReady } from './firebase.js';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // niente 0/O/1/I
export function newCode(len = 6) {
  return Array.from(crypto.randomBytes(len), (b) => ALPHABET[b % ALPHABET.length]).join('');
}

const now = () => new Date().toISOString();

/* ---------- Firestore ---------- */
const col = () => db.collection('bookings');
const fsStore = {
  async all() {
    const snap = await col().get();
    return snap.docs.map((d) => d.data());
  },
  async get(id) {
    const d = await col().doc(id).get();
    return d.exists ? d.data() : null;
  },
  async create(b) {
    let ref = col().doc(b.id);
    while ((await ref.get()).exists) {
      b.id = newCode();
      ref = col().doc(b.id);
    }
    await ref.set(b);
    return b;
  },
  async update(id, patch) {
    const ref = col().doc(id);
    await ref.set({ ...patch, updatedAt: now() }, { merge: true });
    return (await ref.get()).data();
  },
  /** Cambia stato solo se quello attuale è `from`. */
  async transition(id, from, to, patch = {}) {
    const ref = col().doc(id);
    return db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists || snap.data().status !== from) return null;
      const next = { ...snap.data(), ...patch, status: to, updatedAt: now() };
      tx.set(ref, next);
      return next;
    });
  },
};

/* ---------- File JSON (prove in locale) ---------- */
const FILE = path.resolve(env.dataDir, 'bookings.json');
let cache = null;
let chain = Promise.resolve();
async function load() {
  if (cache) return cache;
  try {
    cache = JSON.parse(await fs.readFile(FILE, 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    cache = [];
  }
  return cache;
}
async function persist() {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(`${FILE}.tmp`, JSON.stringify(cache, null, 2));
  await fs.rename(`${FILE}.tmp`, FILE);
}
function locked(fn) {
  const run = chain.then(fn);
  chain = run.catch(() => {});
  return run;
}
const fileStore = {
  async all() { return [...(await load())]; },
  async get(id) { return (await load()).find((b) => b.id === id) ?? null; },
  create(b) {
    return locked(async () => {
      const list = await load();
      while (list.some((x) => x.id === b.id)) b.id = newCode();
      list.push(b);
      await persist();
      return b;
    });
  },
  update(id, patch) {
    return locked(async () => {
      const b = (await load()).find((x) => x.id === id);
      if (!b) return null;
      Object.assign(b, patch, { updatedAt: now() });
      await persist();
      return { ...b };
    });
  },
  transition(id, from, to, patch = {}) {
    return locked(async () => {
      const b = (await load()).find((x) => x.id === id);
      if (!b || b.status !== from) return null;
      Object.assign(b, patch, { status: to, updatedAt: now() });
      await persist();
      return { ...b };
    });
  },
};

export const store = firebaseReady ? fsStore : fileStore;
