# Flori's Home — sito React

Sito vetrina per l'appartamento Flori's Home (Via San Pio X 16, Bergamo).
React 19 + Vite + Framer Motion + Lucide.

## Avvio
    npm install
    npm run dev        # sviluppo  -> http://localhost:5173
    npm run build      # produzione -> cartella dist/

## Personalizzare
Tutti i contenuti stanno in `src/data.js`:
- `SITE` -> contatti (WhatsApp, email, telefono), prezzo/notte, pulizia, orari check-in/out
- `PHOTOS` -> foto: mettile in `public/images/` con i nomi indicati
  (hero.jpg, soggiorno.jpg, camera1.jpg, camera2.jpg, cucina.jpg, bagno.jpg, balcone.jpg, esterno.jpg).
  Finché una foto manca viene mostrato un segnaposto colorato.
- `TOUR` -> ordine delle stanze del tour a scorrimento
- `AMENITIES`, `PLACES`, `RULES`, `FAQ` -> servizi, distanze, regole, domande

## Sezioni
Hero parallax · Tour immersivo a scorrimento (si entra stanza per stanza attraverso le porte) ·
Galleria bento con lightbox · Servizi · Mappa e distanze · Punteggi recensioni ·
Preventivo + richiesta via WhatsApp/email · Regole · FAQ
