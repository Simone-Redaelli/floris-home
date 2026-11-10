import { firebaseConfig, isConfigured } from "./firebase-config";

/* Lista d'attesa: chi trova le date occupate lascia il WhatsApp e viene avvisato se si liberano */
const str = (v) => ({ stringValue: String(v ?? "") });

export async function joinWaitlist({ name, phone, email, from, to, guests, lang }) {
  if (!isConfigured) throw new Error("offline");
  const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/waitlist?key=${firebaseConfig.apiKey}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        name: str(name.trim().slice(0, 60)),
        phone: str(String(phone).replace(/\D/g, "")),
        email: str(email.trim().slice(0, 100)),
        from: str(from),
        to: str(to),
        guests: { integerValue: String(guests) },
        lang: str(lang),
        createdAt: str(new Date().toISOString()),
        status: str("waiting"),
      },
    }),
  });
  if (!r.ok) throw new Error("failed");
  return true;
}

/* link che apre il sito con le date già scelte */
export const bookLink = (base, w) => `${base}/?arrivo=${w.from}&partenza=${w.to}&ospiti=${w.guests || 2}#prenota`;
