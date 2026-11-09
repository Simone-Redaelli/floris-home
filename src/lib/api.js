// ============================================================
//  BACKEND (richieste automatiche con WhatsApp, Calendar e Gmail)
//  Quando il server è online scrivi qui il suo indirizzo, es.
//  "https://floris.tuodominio.it". Vuoto = le richieste partono
//  come messaggio WhatsApp precompilato (funziona senza server).
// ============================================================
export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export const hasApi = () => Boolean(API_URL);

export async function api(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(json.error || json.message || `Errore ${res.status}`), { status: res.status, data: json });
  return json;
}
