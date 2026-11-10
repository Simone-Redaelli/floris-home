const n = (c, one, many) => `${c} ${c === 1 ? one : many}`;

export default {
  nav: { links: ["La casa", "Tour", "Servizi", "Recensioni", "Bergamo", "Attività"], book: "Prenota", menu: "Menu", close: "Chiudi", lang: "Lingua" },
  door: {
    eyebrow: "Via San Pio X, 16 · Bergamo", title1: "Benvenuti a", title2: "casa", mat: "Benvenuti",
    bell: "Suona il campanello", scroll: "oppure scorri per entrare", bellAria: "Suona il campanello e apri la porta",
    skip: "Salta", photoAlt: "Il soggiorno di Flori's Home", cursor: "Suona",
  },
  hero: {
    open: "Prenotazioni aperte", closed: "Prenotazioni chiuse", from: "da", perNight: "a notte",
    title1: "La tua casa a Bergamo,", title2: "perfetta per",
    rotate: ["famiglie", "smart worker", "chi vola da Orio", "un weekend in due", "chi ha un cane"],
    sub: "80 m² appena ristrutturati, due camere, balcone sul verde e parcheggio gratuito nelle vicinanze.",
    arrival: "Arrivo", departure: "Partenza", guests: "Ospiti", addDate: "Aggiungi data",
    guestsN: (c) => n(c, "ospite", "ospiti"), check: "Verifica", book: "Prenota",
    pickArrival: "Scegli l'arrivo", pickDeparture: "Scegli la partenza", nightsN: (c) => n(c, "notte", "notti"),
    clear: "Cancella", max: (c) => `Massimo ${c}`, superb: "Superbo", airport: "4 km da Orio al Serio",
    renovated: "Appena ristrutturato", sticker: "PRENOTA DIRETTO • NIENTE COMMISSIONI • ", stickerSmall: "commissioni",
  },
  trust: ["9,1 Superbo su Booking", "Parcheggio gratuito vicino", "4 km da Orio al Serio", "Animali ammessi", "Aria condizionata su richiesta", "Appena ristrutturato", "Wi-Fi veloce", "Check-in flessibile"],
  casa: {
    kicker: "La casa", title1: "Sfoglia la casa", title2: "come un album",
    sub: "L'intero appartamento è tuo: 80 m², due camere, cucina, bagno con vasca e un balcone sul verde.",
    hintTouch: "Tocca una foto per ingrandirla", hintDrag: "Trascina le foto, cliccale per ingrandirle",
    caps: ["il soggiorno ☀️", "camera matrimoniale", "cucina completa", "vasca da bagno 🛁", "il balcone 🌿", "camera doppia", "la vista"],
    rooms: "camere", guests: "ospiti", scribble: "appena ristrutturato! ✨",
  },
  tour: {
    kicker: "Il tour", scroll: "Scorri per entrare in casa", go: "Vai",
    rooms: [
      { kicker: "Si entra", title: "Ingresso", text: "La porta si apre su un corridoio luminoso. Il parcheggio gratuito è a due passi.", tags: ["Parcheggio gratuito vicino", "Self check-in"] },
      { kicker: "Il cuore della casa", title: "Soggiorno", text: "Ampio e pieno di luce, con divano letto, smart TV con streaming e tavolo da pranzo per tutta la famiglia.", tags: ["Divano letto", "Smart TV", "Aria condizionata"] },
      { kicker: "Come a casa", title: "Cucina", text: "Completamente attrezzata: piano cottura, forno, microonde, frigorifero, bollitore e macchina del caffè.", tags: ["Forno", "Microonde", "Caffè"] },
      { kicker: "Riposo", title: "Matrimoniale", text: "Letto matrimoniale, armadio capiente e tende leggere. Biancheria e asciugamani sempre inclusi.", tags: ["Letto matrimoniale", "Biancheria inclusa"] },
      { kicker: "Per tutti", title: "Camera doppia", text: "Due letti singoli, perfetti per bambini, amici o colleghi in trasferta.", tags: ["2 letti singoli", "Armadio"] },
      { kicker: "Relax", title: "Bagno", text: "Vasca da bagno, bidet, asciugacapelli e lavatrice a disposizione.", tags: ["Vasca", "Lavatrice", "Phon"] },
      { kicker: "All'aperto", title: "Balcone", text: "Il posto giusto per il caffè del mattino o un aperitivo al tramonto, affacciato sul verde.", tags: ["Vista giardino", "Esterno privato"] },
    ],
  },
  gallery: ["Soggiorno", "Camera matrimoniale", "Zona living", "Angolo cottura", "Camera doppia", "Open space", "Vasca", "La vista", "Pranzo", "Relax"],
  lightbox: { close: "Chiudi", prev: "Precedente", next: "Successiva" },
  stack: {
    kicker: "Perfetto per", title1: "Una casa,", title2: "tanti viaggi",
    items: [
      { title: "Famiglie", text: "Due camere, divano letto e cucina completa: c'è spazio per tutti, fino a 5 ospiti.", tag: "Fino a 5 ospiti" },
      { title: "Smart working", text: "Wi-Fi veloce, scrivania e silenzio. Per trasferte di lavoro o soggiorni lunghi.", tag: "Wi-Fi gratuito" },
      { title: "Voli da Orio", text: "L'aeroporto è a 4 km: arrivi la sera tardi o riparti all'alba senza stress.", tag: "4 km dall'aeroporto" },
      { title: "Con il tuo cane", text: "Gli amici a quattro zampe sono i benvenuti, e c'è un balcone sul verde.", tag: "Pet friendly" },
    ],
  },
  amen: {
    kicker: "Servizi", title1: "Tutto incluso,", title2: "niente pensieri",
    sub: "Arrivi, posi le valigie e sei a casa. Biancheria, asciugamani e pulizie sono già pensati.", photoAlt: "Soggiorno",
    items: [
      { label: "Wi-Fi gratuito", text: "Veloce, in tutta la casa" }, { label: "Parcheggio", text: "Gratuito, nelle vicinanze" },
      { label: "Aria condizionata", text: "Su richiesta, €10 al giorno" }, { label: "Pet friendly", text: "Gli animali sono benvenuti" },
      { label: "Smart TV", text: "Con servizi di streaming" }, { label: "Cucina completa", text: "Forno, microonde, caffè" },
      { label: "Lavatrice", text: "Per i soggiorni lunghi" }, { label: "Smart working", text: "Scrivania dedicata" },
    ],
  },
  rev: {
    kicker: "Recensioni", superb: "Superbo", avg: (c) => `Media di ${c} recensioni verificate di ospiti reali su Booking.com`,
    read: "Leggi le recensioni", k2: "Cosa dicono gli ospiti", t1: "Pulizia e comfort", t2: "da 9,7",
    scores: ["Pulizia", "Comfort", "Servizi", "Staff", "Qualità / prezzo", "Posizione"], sticker: "OSPITI FELICI • RECENSIONI VERE • ",
  },
  berg: {
    kicker: "Posizione", title1: "Bergamo", title2: "a portata di mano",
    sub: "Zona residenziale e tranquilla. In pochi minuti sei in aeroporto, in Fiera o in centro; in un quarto d'ora sulle mura di Città Alta.",
    places: ["Aeroporto Orio al Serio", "Fiera di Bergamo", "Accademia Carrara", "Teatro Donizetti", "Gewiss Stadium", "Città Alta"],
    alta: "Città Alta", porta: "Porta San Giacomo", directions: "Indicazioni", mapTitle: "Mappa Flori's Home", skyPin: "Orio al Serio · 4 km",
  },
  act: {
    zoomCity: "Bergamo", zoomAll: "Dintorni",
    view: "Vista", viewCards: "Schede", viewMap: "Mappa", home: "Flori's Home · casa tua",
    "kicker": "Da scoprire",
    "title1": "Cosa fare",
    "title2": "vicino a casa",
    "sub": "Le esperienze che consigliamo ai nostri ospiti, tutte prenotabili online. I tempi sono in auto da casa.",
    "cats": {
      "all": "Tutte",
      "culture": "Cultura",
      "nature": "Laghi e natura",
      "family": "Famiglie",
      "relax": "Relax",
      "food": "Gusto",
      "sport": "Sport",
      "shop": "Shopping"
    },
    "cta": {
      "book": "Prenota",
      "tickets": "Biglietti",
      "info": "Scopri"
    },
    "from": "da",
    "askT": "Non sai cosa scegliere?",
    "askS": "Scrivici su WhatsApp: ti consigliamo il posto giusto e i ristoranti dove mangiamo noi.",
    "askCta": "Chiedi a noi",
    "waText": "Ciao! Sto per venire a Flori's Home: cosa mi consigliate di fare in zona?",
    "note": "I link portano ai siti ufficiali o ai partner: prezzi e disponibilità sono gestiti da loro.",
    "items": {
      "alta": {
        "title": "Città Alta con guida ufficiale",
        "desc": "Mura veneziane patrimonio UNESCO, Piazza Vecchia e Cappella Colleoni in un tour a piedi di 2 ore. Domenica e festivi alle 10:30.",
        "where": "Torre del Gombito"
      },
      "funi": {
        "title": "Funicolari di Città Alta e San Vigilio",
        "desc": "Sali in funicolare fino al borgo medievale e poi ancora più su, al castello di San Vigilio: tramonto con vista sulla pianura.",
        "where": "Viale Vittorio Emanuele"
      },
      "carrara": {
        "title": "Accademia Carrara",
        "desc": "Una delle pinacoteche più belle d'Italia: Raffaello, Botticelli, Mantegna, Bellini. E mostre temporanee tutto l'anno.",
        "where": "Piazza Carrara"
      },
      "donizetti": {
        "title": "Teatro Donizetti",
        "desc": "Opera, prosa, concerti e il Donizetti Opera Festival nello storico teatro della Città Bassa.",
        "where": "Città Bassa"
      },
      "atalanta": {
        "title": "Atalanta al Gewiss Stadium",
        "desc": "Vivi una partita della Dea in uno degli stadi più caldi d'Italia, a pochi minuti da casa.",
        "where": "Gewiss Stadium"
      },
      "cooking": {
        "title": "Corso di cucina bergamasca",
        "desc": "Casoncelli, polenta taragna e scarpinocc: cucini con una Cesarina a casa sua e poi si mangia insieme.",
        "where": "Bergamo e dintorni"
      },
      "leolandia": {
        "title": "Leolandia",
        "desc": "Il parco divertimenti preferito dai bambini: attrazioni, spettacoli e i personaggi dei cartoni.",
        "where": "Capriate San Gervasio"
      },
      "crespi": {
        "title": "Villaggio di Crespi d'Adda",
        "desc": "Villaggio operaio patrimonio UNESCO, rimasto com'era a fine Ottocento. Visite guidate e passeggiate lungo l'Adda.",
        "where": "Capriate San Gervasio"
      },
      "terme": {
        "title": "QC Terme San Pellegrino",
        "desc": "Una giornata di relax in Val Brembana: vasche termali, saune e percorso benessere in un edificio liberty.",
        "where": "San Pellegrino Terme"
      },
      "iseo": {
        "title": "Lago d'Iseo e Monte Isola",
        "desc": "In battello a Monte Isola, la più grande isola lacustre d'Europa: borghi di pescatori, bici e pesce di lago.",
        "where": "Sarnico · Iseo"
      },
      "como": {
        "title": "Lago di Como",
        "desc": "Da Lecco in battello verso Bellagio e Varenna: ville, giardini e i panorami più famosi del lago.",
        "where": "Da Lecco"
      },
      "orio": {
        "title": "Orio Center",
        "desc": "Uno dei centri commerciali più grandi d'Italia, accanto all'aeroporto: shopping, ristoranti e cinema.",
        "where": "Orio al Serio"
      }
    }
  },
  book: {
    perPerson: "a persona", perNightEx: "al giorno", free: "Gratis",
    residence: "Città di residenza", residencePh: "es. Bergamo",
    othersDue: (d) => `Se non li hai ora, mandaci i dati degli altri ospiti entro ${d}: per legge vanno registrati prima dell'arrivo, non al check-in.`,
    extraGuest: (n, inc, p) => `Prezzo per ${n} ospiti: fino a ${inc} è il prezzo base, +${p}% a notte per ogni ospite in più.`,
    cancelUntil: (d, n) => `Cancellazione gratuita fino al ${d} (${n} giorni prima dell'arrivo). Dopo non è più cancellabile.`,
    cancelNo: (n) => `Mancano meno di ${n} giorni all'arrivo: questa prenotazione non sarà cancellabile.`,
    exTitle: "Servizi extra", exSub: "Aggiungili ora, li prepariamo per il tuo arrivo. Si pagano in contanti all'arrivo.",
    ex: {
      cot: { t: "Lettino", s: "Lettino per bambini, gratis" },
      highchair: { t: "Seggiolone", s: "Per la pappa in cucina, gratis" },
      earlyIn: { t: "Check-in anticipato", s: "Entra dalle 12:00, su conferma" },
      lateOut: { t: "Check-out posticipato", s: "Esci entro le 13:00, su conferma" },
      ac: { t: "Aria condizionata", s: "Per tutto il soggiorno" },
    },
    cashPay: (x, ex, tax) => `Di cui ${x} da pagare in contanti all'arrivo: ${[ex && "servizi extra", tax && "tassa di soggiorno (minorenni esenti)"].filter(Boolean).join(" e ")}.`,
    tax: "Tassa di soggiorno",
    taxNote: (r, c, n) => `${r}% a notte per adulto, max ${c}${Number(n) ? `, prime ${n} notti` : ""}`,
    taxPay: (x) => `Il totale include ${x} di tassa di soggiorno del Comune, da pagare all'arrivo. I minorenni sono esenti.`,
    kicker: "Prenota diretto", title1: "Scegli le date,", title2: "il resto è facile",
    sub: "Prezzi e disponibilità aggiornati in tempo reale. Nessuna commissione, nessun pagamento online.",
    steps: ["Date", "I tuoi dati", "Inviata"],
    closedT: "Prenotazioni momentaneamente chiuse", closedS: "Scrivici comunque: ti avvisiamo appena riapriamo.",
    legend: ["Selezionate", "Occupate", "Prezzo speciale"],
    tfTitle: "Transfer dall'aeroporto", tfSub: "Ti veniamo a prendere a Orio al Serio e ti portiamo a casa",
    tfTime: "Orario di atterraggio", tfFlight: "Numero del volo", tfFlightPh: "es. FR1234", tfNote: "Facoltativi: puoi comunicarceli anche dopo su WhatsApp.",
    formTitle: "Chi viene a trovarci?", formSub: "Ti scriviamo su WhatsApp ed email per confermare la disponibilità.",
    contacts: "Contatti", email: "Email", phone: "Numero WhatsApp", mainGuest: "Ospite principale", asOnDoc: "come sul documento",
    firstName: "Nome", lastName: "Cognome", sex: "Sesso", birth: "Data di nascita", years: "anni",
    birthPlace: "Luogo di nascita", cityPh: "Città", birthCountry: "Stato di nascita", nationality: "Nazionalità",
    minor: "L'ospite principale deve essere maggiorenne.", doc: "Documento d'identità",
    docTypes: { "Carta d'identità": "Carta d'identità", Passaporto: "Passaporto", "Patente di guida": "Patente di guida" },
    docNumber: "Numero documento", passportNumber: "Numero passaporto", issuedBy: "Rilasciato da", issuedByPh: "Comune o Stato",
    others: "Altri ospiti", othersNote: "da mandare entro il giorno prima del check-in", guestN: (c) => `Ospite ${c}`,
    notes: "Note (facoltative)", notesPh: "Orario di arrivo, richieste particolari…", pet: "Viaggio con un animale", petFee: (x) => `massimo 1 · ${x} a soggiorno`, petLine: "Animale",
    law: "Per legge (art. 109 TULPS) comunichiamo i dati degli ospiti alla Questura tramite il portale Alloggiati Web. Li usiamo solo per questo e per gestire il soggiorno: non vengono mai condivisi con altri.",
    consent: "Acconsento al trattamento dei miei dati e di quelli degli ospiti per la gestione della prenotazione e per gli obblighi di legge.",
    back: "Cambia date", almost: "Ci siamo quasi!", sent: "Richiesta inviata!",
    waDone1: "Ti si è aperto WhatsApp con il messaggio già scritto:", waDone2: "premi invia", waDone3: "e la richiesta ci arriva.", waNotOpen: "WhatsApp non si è aperto?",
    apiDone: (name) => `Grazie ${name}! Ti abbiamo scritto su WhatsApp. Appena confermiamo, le date si bloccano e ti arrivano email e invito nel calendario con tutti i dettagli.`,
    code: "codice", newReq: "Nuova richiesta", perNight: "/ notte", updating: "aggiorno", updated: "aggiornato",
    status: {
      ok: "Disponibile! Ora i tuoi dati", unavailable: "Alcune notti sono già occupate", closed: "Al momento non accettiamo prenotazioni",
      past: "Le date sono nel passato", min: (c) => `Soggiorno minimo ${c} notti`, pickDeparture: "Ora scegli il giorno di partenza", pickArrival: "Scegli il giorno di arrivo sul calendario",
    },
    nightsN: (c) => n(c, "notte", "notti"), season: "stagione", weekend: "weekend", cleaning: "Pulizia finale", transferLine: "Transfer da Orio al Serio",
    total: "Totale", cont: "Continua", send: "Invia la richiesta", sendWa: "Invia su WhatsApp", sending: "Invio…",
    fine: (dep) => `Nessun pagamento ora · cauzione ${dep} in contanti, restituita al check-out`, less: "Meno", more: "Più",
  },
  faq: {
    kicker: "Da sapere", title1: "Domande", title2: "frequenti", facts: ["Check-in", "Check-out", "Minimo", "Cauzione"],
    minN: (c) => n(c, "notte", "notti"), rules: "Non si fuma in casa · niente feste · 1 animale ammesso (€50 a soggiorno)",
    items: [
      { q: "Quanto dista dall'aeroporto di Orio al Serio?", a: "Circa 4 km: pochi minuti in auto o taxi. Ideale per voli all'alba o in tarda serata." },
      { q: "Come si raggiunge Città Alta?", a: "In auto in circa 15 minuti, oppure con i mezzi fino al centro e poi la funicolare." },
      { q: "Il parcheggio è incluso?", a: "Sì: c'è parcheggio gratuito nelle vicinanze della casa." },
      { q: "Posso cancellare la prenotazione?", a: "Sì, gratis fino a 14 giorni prima dell'arrivo. Dopo la prenotazione non è più cancellabile." },
      { q: "C'è l'aria condizionata?", a: "Sì, su richiesta a €10 al giorno: puoi aggiungerla quando prenoti." },
      { q: "Posso portare il mio cane?", a: "Certo, Flori's Home è pet friendly: è ammesso 1 animale, con un supplemento di €50 a soggiorno. Seleziona l'opzione quando prenoti." },
      { q: "Va bene per lavorare da remoto?", a: "Sì: Wi-Fi gratuito, scrivania e ambienti silenziosi." },
    ],
  },
  foot: {
    guide: "Guida ospiti",
    hint: "muovi il mouse qui ✨", title1: "Ti aspettiamo", title2: "a Bergamo", sub: "Scegli le date: in pochi minuti ti confermiamo la disponibilità.",
    cta: "Verifica disponibilità", contacts: "Contatti", explore: "Esplora", copy: "Appartamento ad uso turistico", photos: "Foto città: Unsplash",
  },
  guide: {
    cdDays: (n) => `giorni al tuo arrivo a Bergamo`, cdTomorrow: "Domani si parte! Ti aspettiamo a Bergamo.", cdToday: (ci) => `È oggi! Ti aspettiamo dalle ${String(ci).split(/[–-]/)[0].trim()}.`, cdStay: (d, n) => `Giorno ${d} di ${n}: goditi Bergamo!`, cdAfter: "Grazie di essere stato nostro ospite: torna presto!",
    title: "Guida della casa", welcome1: "Benvenuto", welcome2: "a casa",
    hello: (n) => `Ciao ${n},`, helloEm: "benvenuto!",
    sub: "Tutto quello che ti serve durante il soggiorno, in un posto solo.",
    stay: (a, b) => `Ti aspettiamo da ${a} a ${b}. Qui trovi tutto quello che ti serve.`,
    checkIn: "Check-in", checkOut: "Check-out",
    codeTitle: "Hai il codice del soggiorno?", codeSub: "Lo trovi nel messaggio di conferma su WhatsApp o via email.",
    open: "Apri la guida", checking: "Controllo…", bad: "Codice non valido o scaduto: controllalo o scrivici su WhatsApp.", logout: "Esci",
    locked: "Visibile con il codice del soggiorno",
    wifi: "Wi-Fi", network: "Rete", password: "Password", copy: "Copia", copied: "Copiato!", askHost: "Chiedici la password su WhatsApp.",
    entry: "Come entrare", entryEmpty: "Ti mandiamo le istruzioni per entrare su WhatsApp prima dell'arrivo.",
    times: "Arrivo e partenza", timesTxt: (ci, co) => `Check-in ${ci}, check-out ${co}.`, timesLate: "Arrivi fuori orario? Scrivici e ci organizziamo.",
    parking: "Parcheggio", parkingDefault: "Parcheggio gratuito nelle vicinanze.",
    rules: "Regole della casa",
    rulesList: (ci, co, dep) => [`Check-in ${ci}, check-out ${co}.`, "Niente feste o eventi.", "Animali ammessi: massimo 1, supplemento di €50 a soggiorno.", `Cauzione di ${dep} in contanti, restituita al check-out.`],
    waste: "Raccolta differenziata", wasteSub: "A Bergamo la raccolta è porta a porta: separa i rifiuti così.",
    wasteItems: [["Organico", "nei sacchetti compostabili"], ["Carta e cartone", "schiacciati, in scatole o sacchetti di carta"], ["Plastica", "nel sacco giallo"], ["Vetro e metalli", "insieme, lattine comprese, senza sacchetto"], ["Indifferenziato", "nel sacco trasparente"]],
    wasteDays: "Giorni di ritiro",
    checkout: "Prima di partire", checkoutList: ["Spegni luci, riscaldamento e aria condizionata", "Chiudi le finestre e la porta del balcone", "Butta i rifiuti nei contenitori giusti", "Lascia le chiavi come ti abbiamo indicato"],
    numbers: "Numeri utili", host: "Noi, su WhatsApp", n112: "Emergenze: polizia, ambulanza, vigili del fuoco", n116: "Guardia medica (notte e festivi)", taxi: "Radio Taxi Bergamo",
    notes: "Note dell'host", around: "Cosa fare nei dintorni", aroundSub: "Città Alta, laghi, terme e le nostre esperienze preferite, prenotabili online.", aroundCta: "Scopri le attività",
    enjoy: "Buon soggiorno a Bergamo!", back: "Torna al sito",
  },
  wx: { today: "Oggi a Bergamo", kinds: { clear: "sereno", cloudy: "nuvoloso", fog: "nebbia", rain: "pioggia", snow: "neve", storm: "temporale" } },
  mbar: { perNight: "/ notte", superb: "Superbo", cta: "Scegli le date" },
  cal: { wd: ["L", "M", "M", "G", "V", "S", "D"], unavailable: "Non disponibile", perNight: "/ notte", prev: "Mese precedente", next: "Mese successivo" },
};
