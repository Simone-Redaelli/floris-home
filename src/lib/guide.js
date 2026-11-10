import { firebaseConfig, isConfigured } from "./firebase-config";
import { decodeFields } from "./settings";

/* Legge la parte riservata della guida con il codice del soggiorno (senza SDK Firebase).
   Le regole di Firestore la danno solo a chi conosce il codice, e solo fino a 2 giorni dopo la partenza. */
export async function fetchGuide(code) {
  if (!isConfigured || !code) return null;
  const { projectId, apiKey } = firebaseConfig;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/guestGuides/${encodeURIComponent(code)}?key=${apiKey}`;
  const r = await fetch(url);
  if (!r.ok) return null; // 404 = codice inesistente · 403 = scaduto
  const j = await r.json();
  return decodeFields(j.fields || {});
}
