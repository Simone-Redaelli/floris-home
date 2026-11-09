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

## Sezioni
Preloader · Hero cinematografica · Manifesto a scorrimento · Tour immersivo stanza per stanza ·
Galleria orizzontale con lightbox · Servizi · Bergamo e mappa · Recensioni · Prenotazione (WhatsApp/email) · Regole e FAQ
