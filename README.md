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

## Sezioni
Preloader · Hero cinematografica · Calendario con disponibilità e preventivo in tempo reale · Manifesto a scorrimento · Tour immersivo stanza per stanza ·
Galleria orizzontale con lightbox · Servizi · Bergamo e mappa · Recensioni · Prenotazione (WhatsApp/email) · Regole e FAQ
