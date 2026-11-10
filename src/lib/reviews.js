import { firebaseConfig, isConfigured } from "./firebase-config";
import { decodeFields } from "./settings";

/* Recensioni scritte dagli ospiti sul sito (senza SDK Firebase).
   Si scrivono con il codice del soggiorno (una sola per codice) e compaiono solo dopo la tua approvazione. */
const base = () => `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

export async function fetchApprovedReviews() {
  if (!isConfigured) return [];
  const r = await fetch(`${base()}:runQuery?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: "reviews" }],
        where: { fieldFilter: { field: { fieldPath: "status" }, op: "EQUAL", value: { stringValue: "approved" } } },
        limit: 40,
      },
    }),
  });
  if (!r.ok) return [];
  const rows = await r.json();
  return rows
    .filter((x) => x.document)
    .map((x) => ({ id: x.document.name.split("/").pop(), ...decodeFields(x.document.fields || {}) }))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

const str = (v) => ({ stringValue: String(v ?? "") });

export async function submitReview(code, { name, country, rating, text, lang }) {
  if (!isConfigured) throw new Error("offline");
  const body = {
    fields: {
      name: str(name.trim().slice(0, 60)),
      country: str(country.trim().slice(0, 60)),
      rating: { integerValue: String(Math.max(1, Math.min(5, Math.round(rating)))) },
      text: str(text.trim().slice(0, 1200)),
      lang: str(lang),
      createdAt: str(new Date().toISOString()),
      status: str("pending"),
    },
  };
  const r = await fetch(`${base()}/reviews?documentId=${encodeURIComponent(code)}&key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (r.status === 409) throw new Error("exists");
  if (!r.ok) throw new Error(r.status === 403 ? "denied" : "failed");
  return true;
}
