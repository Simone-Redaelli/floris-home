# Flori's Home — sito React

Sito dell'appartamento Flori's Home (Via San Pio X 16, Bergamo).
React 19 · Vite · Framer Motion · Lenis (smooth scroll) · Lucide.

## Avvio
    npm install
    npm run dev       # http://localhost:5173
    npm run build     # cartella dist/

## Contenuti
Tutto è in `src/data.js`: contatti (WhatsApp, email, telefono), prezzo indicativo,
orari, foto, stanze del tour, servizi, distanze, regole, FAQ.

Le foto dell'appartamento sono quelle dell'annuncio, caricate dalla CDN di Booking.
Per non dipendere da Booking: salvale in `public/images/` e cambia gli URL in `data.js`.

## Pannello admin

Indirizzo: `https://simone-redaelli.github.io/floris-home/#admin`
(non è linkato da nessuna parte nel sito).

Dal pannello l'amministratore gestisce:
- **Disponibilità**: clicca o trascina sul calendario per segnare le notti occupate o libere
- **Prezzi**: prezzo a notte, prezzo di venerdì e sabato, pulizia, cauzione, notti minime, ospiti massimi, prezzi stagionali (Natale, fiere, estate...)
- **Prenotazioni aperte/chiuse** con un interruttore, e un avviso facoltativo sul sito
- **Contatti e orari**: WhatsApp, email, telefono, check-in e check-out

Le modifiche diventano visibili sul sito appena si preme "Salva e pubblica".

### Attivazione (una volta sola, ~10 minuti)
1. Vai su https://console.firebase.google.com → **Aggiungi progetto** (Analytics non serve).
2. **Build → Authentication → Inizia** → abilita **Email/password**.
   Poi scheda **Users → Aggiungi utente**: inserisci email e password dell'amministratore.
3. **Build → Firestore Database → Crea database** (modalità produzione, regione europe-west).
   Scheda **Regole**: incolla il contenuto di `firestore.rules` sostituendo
   `LA-TUA-EMAIL-ADMIN@esempio.it` con l'email dell'admin → **Pubblica**.
4. **Impostazioni progetto (ingranaggio) → Le tue app → Web (</>)**: registra l'app e copia i valori di `firebaseConfig`
   dentro `src/lib/firebase-config.js`; scrivi la stessa email in `ADMIN_EMAIL`.
5. **Authentication → Settings → Domini autorizzati**: aggiungi `simone-redaelli.github.io`.
6. `npm run build` e pubblica.

Finché Firebase non è configurato il sito funziona lo stesso con i valori di `src/data.js`.

**Sicurezza**: le chiavi in `firebase-config.js` sono pubbliche per design. Chi modifica i dati lo decidono le regole di Firestore:
solo l'utente autenticato con l'email admin può scrivere. Crea l'account admin (punto 2) prima di pubblicare le regole.

## Richieste automatiche (WhatsApp + Google Calendar + Gmail)
Nella cartella `backend/` c'è il server che gestisce le richieste come per il sito ripetizioni:
richiesta → WhatsApp con ✅/❌ → conferma con blocco notti, evento Calendar ed email.
Guida completa: **backend/README.md**. Le regole Firestore aggiornate sono in `firestore.rules`.

## Transfer dall'aeroporto
L'ospite può aggiungere il transfer da Orio al Serio (default €35): prezzo e attivazione dal pannello admin → Prezzi.

## Sezioni
Preloader · Hero cinematografica · Calendario con disponibilità e preventivo in tempo reale · Manifesto a scorrimento · Tour immersivo stanza per stanza ·
Galleria orizzontale con lightbox · Servizi · Bergamo e mappa · Recensioni · Prenotazione (WhatsApp/email) · Regole e FAQ

## Calendari Booking.com / Airbnb
Le notti prenotate sui portali si bloccano da sole sul sito e viceversa (formato iCal, ogni 30 minuti).
1. **Pannello → Disponibilità → Calendari**: aggiungi Booking.com e Airbnb incollando il loro **link di esportazione** (.ics) e salva.
2. Nello stesso riquadro copia i link del sito (`…/calendar-booking.ics`, `…/calendar-airbnb.ics`) e incollali nella sezione **Importa calendario** di ciascun portale.
3. Per farlo girare senza server, su GitHub: **Settings → Secrets and variables → Actions → New repository secret**
   - nome `FIREBASE_SERVICE_ACCOUNT_BASE64`
   - valore: il file dell'account di servizio Firebase in base64 (`base64 -w0 firebase-service-account.json` su Linux, `base64 -i firebase-service-account.json` su Mac)
   Poi **Actions → Sincronizza calendari → Run workflow** per la prima volta. Da lì parte da solo ogni 30 minuti (`.github/workflows/ical-sync.yml`).

## Guida della casa (`#guida`)
Pagina per gli ospiti con Wi-Fi, come entrare, parcheggio, regole, raccolta differenziata e numeri utili. Wi-Fi e ingresso si vedono solo con il codice personale (scade 2 giorni dopo la partenza). Si gestisce da **Pannello → Guida ospiti**; per le prenotazioni dal sito il codice si crea da solo quando accetti.

## Servizi extra e tassa di soggiorno
Culla, seggiolone, check-in anticipato, check-out posticipato e kit colazione: prezzi e attivazione in **Pannello → Prezzi**. Lì c'è anche la tassa di soggiorno (Bergamo: 7% del prezzo a notte per persona, max €5, prime 5 notti, minorenni esenti — verifica le tariffe aggiornate con il Comune).

## Regole Firestore
Dopo questo aggiornamento ripubblica `firestore.rules` (Firebase → Firestore → Regole) con la **tua email admin** al posto di `LA-TUA-EMAIL-ADMIN@esempio.it`: servono per calendari, guida e codici ospiti.
