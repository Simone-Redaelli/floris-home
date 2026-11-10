// Firebase Admin: legge/scrive impostazioni e richieste su Firestore (scavalca le regole, solo lato server).
import fs from 'node:fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { env } from './env.js';

function loadCredentials() {
  try {
    if (env.firebase.serviceAccountPath) return JSON.parse(fs.readFileSync(env.firebase.serviceAccountPath, 'utf8'));
    if (env.firebase.serviceAccountBase64) return JSON.parse(Buffer.from(env.firebase.serviceAccountBase64, 'base64').toString('utf8'));
  } catch (err) {
    console.error('❌ Account di servizio Firebase non valido:', err.message);
  }
  return null;
}

const creds = loadCredentials();
export const firebaseReady = Boolean(creds);

let db = null;
let auth = null;
if (creds) {
  const app = initializeApp({ credential: cert(creds) });
  db = getFirestore(app);
  auth = getAuth(app);
  console.log(`🔥 Firebase collegato (${creds.project_id})`);
} else {
  console.log('📁 Firebase non configurato: uso file locali in ./data (va bene per le prove).');
}

export { db, auth, FieldValue, Timestamp };
