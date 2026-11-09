# 🏠 Flori's Home — richieste automatiche (WhatsApp + Google Calendar + Gmail)

Stesso sistema del sito ripetizioni, adattato all'appartamento:

```
Ospite sceglie date (+ transfer da Orio) e invia la richiesta dal sito
   ├─► WhatsApp a TE con bottoni  [✅ Accetta] [❌ Rifiuta]
   └─► WhatsApp all'OSPITE: "richiesta ricevuta"

Tu premi ✅ Accetta (su WhatsApp o nel pannello admin → Richieste)
   ├─► Le notti si bloccano da sole sul calendario del sito
   ├─► Evento sul tuo Google Calendar (check-in → check-out), ospite invitato
   ├─► Promemoria "🚕 Transfer" sul calendario, se richiesto
   ├─► Email di conferma dalla tua Gmail (all'ospite, te in copia)
   └─► WhatsApp all'ospite con indirizzo e orari

Tu premi ❌ Rifiuta
   └─► WhatsApp + email all'ospite con il link per scegliere altre date
```

Comandi WhatsApp: `si CODICE`, `no CODICE`, `lista`.

---

## 1) Provalo subito in locale (senza configurare niente)
Serve **Node.js 20+**.
```bash
cd backend
npm install
cp .env.example .env        # lascia DRY_RUN=true
npm start
```
In un altro terminale, dalla cartella principale del sito:
```bash
echo "VITE_API_URL=http://localhost:3002" > .env
npm run dev
```
Fai una richiesta dal sito: nel terminale del backend vedi i messaggi WhatsApp simulati.
Per simulare il bottone ✅ apri `http://localhost:3002/api/dev/accept/CODICE`.

---

## 2) Firebase (account di servizio) — 2 minuti
Serve al server per leggere prezzi/disponibilità e bloccare le notti.
1. Console Firebase → progetto **flori-cf1fc** → ⚙️ **Impostazioni progetto → Account di servizio**.
2. **Genera nuova chiave privata** → salva il file come `backend/firebase-service-account.json` (non caricarlo su GitHub: è già escluso).
3. Firestore → **Regole**: incolla il file `firestore.rules` (con la tua email admin) e **Pubblica**.

## 3) Google (Calendar + Gmail) — 10 minuti
1. **console.cloud.google.com** → seleziona il progetto **flori-cf1fc** (è lo stesso di Firebase).
2. **API e servizi → Libreria**: abilita **Google Calendar API** e **Gmail API**.
3. **Schermata consenso OAuth**: Esterno, nome e la tua email → **PUBBLICA APP** (altrimenti il token scade dopo 7 giorni).
4. **Credenziali → Crea credenziali → ID client OAuth → Applicazione web**, URI di reindirizzamento: `http://localhost:5555/oauth2callback`
5. Copia **Client ID** e **Client secret** nel `.env`, poi:
   ```bash
   npm run google-auth
   ```
   Accedi, accetta (se dice "app non verificata": *Avanzate → Vai a…*) e copia `GOOGLE_REFRESH_TOKEN=...` nel `.env`.

## 4) WhatsApp (Meta) — 15 minuti
Come per le ripetizioni: puoi **usare la stessa app Meta e lo stesso numero business**, basta creare i template nuovi.
I messaggi partono dal numero business; a te arrivano sul tuo WhatsApp personale (`ADMIN_PHONE=393496299929`).

1. **developers.facebook.com → Le mie app** → (app esistente o nuova, tipo Business) → prodotto **WhatsApp**.
2. Nel `.env`: `WA_PHONE_NUMBER_ID`, `WA_TOKEN`, `WA_APP_SECRET`, `WA_VERIFY_TOKEN` (parola segreta inventata).
3. **Webhook**: URL `https://TUO-INDIRIZZO/webhook`, token = `WA_VERIFY_TOKEN`, campo **messages** attivo.
   ⚠️ Un'app Meta ha un solo webhook: se usi la stessa app delle ripetizioni, crea un'app separata per Flori's Home oppure usa un numero business diverso.

### Template da creare (WhatsApp Manager → Modelli, lingua Italiano, categoria Utilità)
**`nuova_richiesta_casa`** — con 2 bottoni *Risposta rapida*: `✅ Accetta`, `❌ Rifiuta`
```
🏠 Nuova richiesta Flori's Home
👤 {{1}}
🗓️ {{2}}
👥 {{3}}
💶 {{4}}
📇 {{5}}
📝 {{6}}
Codice: {{7}}
```
**`richiesta_ricevuta_casa`**
```
Ciao {{1}}! Abbiamo ricevuto la tua richiesta per Flori's Home: {{2}}, totale stimato {{3}}. Ti confermiamo la disponibilità a breve. Codice: {{4}}
```
**`soggiorno_confermato`**
```
Ottime notizie {{1}}! ✅ Il tuo soggiorno a Flori's Home è confermato: {{2}}. Indirizzo: {{3}}. Check-in {{4}}. Ti abbiamo mandato tutti i dettagli su {{5}}.
```
**`soggiorno_rifiutato`**
```
Ciao {{1}}, purtroppo Flori's Home non è disponibile per {{2}}. Puoi scegliere altre date qui: {{3}}
```
Finché i template non sono approvati puoi provare con `WA_USE_TEMPLATES=false` (funziona solo se hai scritto al numero nelle ultime 24 ore).

## 5) Mettilo online
Il backend può stare sulla stessa VPS delle ripetizioni (porta diversa, `PORT=3002`).
```bash
DRY_RUN=false
PUBLIC_URL=https://simone-redaelli.github.io/floris-home
ALLOWED_ORIGINS=https://simone-redaelli.github.io
```
Per provare al volo senza dominio: `cloudflared tunnel --url http://localhost:3002`.

Poi collega il sito al backend: nella cartella principale crea il file `.env` con
```
VITE_API_URL=https://indirizzo-del-tuo-backend
```
ricompila e pubblica. Da quel momento le richieste dal sito passano dal backend, e nel pannello admin compaiono in **Richieste** con i pulsanti Accetta/Rifiuta.
Finché `VITE_API_URL` è vuoto il sito funziona lo stesso: la richiesta parte come messaggio WhatsApp precompilato.
