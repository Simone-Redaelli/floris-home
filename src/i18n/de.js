const n = (c, one, many) => `${c} ${c === 1 ? one : many}`;

export default {
  fxNote: "Richtwert: Preise und Zahlung in Euro.", fxShort: "Richtwert, Zahlung in Euro",
  nav: { links: ["Die Wohnung", "Rundgang", "Ausstattung", "Bewertungen", "Bergamo", "Erleben"], book: "Buchen", menu: "Menü", close: "Schließen", lang: "Sprache" },
  door: {
    eyebrow: "Via San Pio X, 16 · Bergamo", title1: "Willkommen", title2: "zu Hause", mat: "Willkommen",
    bell: "Klingeln", scroll: "oder scrollen, um einzutreten", bellAria: "Klingeln und die Tür öffnen",
    skip: "Überspringen", photoAlt: "Das Wohnzimmer von Flori's Home", cursor: "Klingeln",
  },
  hero: {
    open: "Jetzt buchbar", closed: "Buchungen geschlossen", from: "ab", perNight: "pro Nacht",
    title1: "Dein Zuhause in Bergamo,", title2: "perfekt für",
    rotate: ["Familien", "Homeoffice", "Flüge ab Orio", "ein Wochenende zu zweit", "Reisen mit Hund"],
    sub: "80 m² frisch renoviert, zwei Schlafzimmer, Balkon zum Garten und kostenlose Parkplätze in der Nähe.",
    arrival: "Anreise", departure: "Abreise", guests: "Gäste", addDate: "Datum wählen",
    guestsN: (c) => n(c, "Gast", "Gäste"), check: "Prüfen", book: "Buchen",
    pickArrival: "Anreise wählen", pickDeparture: "Abreise wählen", nightsN: (c) => n(c, "Nacht", "Nächte"),
    clear: "Löschen", max: (c) => `Maximal ${c}`, superb: "Hervorragend", airport: "4 km vom Flughafen Orio al Serio",
    renovated: "Frisch renoviert", sticker: "DIREKT BUCHEN • KEINE GEBÜHREN • ", stickerSmall: "Gebühren",
  },
  trust: ["9,1 Hervorragend auf Booking", "Kostenlose Parkplätze in der Nähe", "4 km von Orio al Serio", "Haustiere willkommen", "Klimaanlage auf Anfrage", "Frisch renoviert", "Schnelles WLAN", "Flexibler Check-in"],
  casa: {
    kicker: "Die Wohnung", title1: "Blättere durch die Wohnung", title2: "wie durch ein Album",
    sub: "Die ganze Wohnung gehört dir: 80 m², zwei Schlafzimmer, Küche, Bad mit Wanne und ein Balkon zum Garten.",
    hintTouch: "Tippe auf ein Foto, um es zu vergrößern", hintDrag: "Fotos verschieben, zum Vergrößern anklicken",
    caps: ["das Wohnzimmer ☀️", "Doppelzimmer", "voll ausgestattete Küche", "Badewanne 🛁", "der Balkon 🌿", "Zweibettzimmer", "die Aussicht"],
    rooms: "Zimmer", guests: "Gäste", scribble: "frisch renoviert! ✨",
  },
  tour: {
    kicker: "Der Rundgang", scroll: "Scrollen, um einzutreten", go: "Los",
    rooms: [
      { kicker: "Herein", title: "Eingang", text: "Die Tür öffnet sich zu einem hellen Flur. Der kostenlose Parkplatz ist nur ein paar Schritte entfernt.", tags: ["Kostenlose Parkplätze in der Nähe", "Self-Check-in"] },
      { kicker: "Das Herz der Wohnung", title: "Wohnzimmer", text: "Geräumig und hell, mit Schlafsofa, Smart-TV mit Streaming und Esstisch für die ganze Familie.", tags: ["Schlafsofa", "Smart-TV", "Klimaanlage"] },
      { kicker: "Wie zu Hause", title: "Küche", text: "Voll ausgestattet: Kochfeld, Backofen, Mikrowelle, Kühlschrank, Wasserkocher und Kaffeemaschine.", tags: ["Backofen", "Mikrowelle", "Kaffee"] },
      { kicker: "Erholung", title: "Doppelzimmer", text: "Doppelbett, großer Kleiderschrank und leichte Vorhänge. Bettwäsche und Handtücher immer inklusive.", tags: ["Doppelbett", "Bettwäsche inklusive"] },
      { kicker: "Für alle", title: "Zweibettzimmer", text: "Zwei Einzelbetten, ideal für Kinder, Freunde oder Kollegen auf Geschäftsreise.", tags: ["2 Einzelbetten", "Kleiderschrank"] },
      { kicker: "Entspannung", title: "Bad", text: "Badewanne, Bidet, Föhn und Waschmaschine stehen zur Verfügung.", tags: ["Badewanne", "Waschmaschine", "Föhn"] },
      { kicker: "Draußen", title: "Balkon", text: "Der perfekte Ort für den Morgenkaffee oder einen Aperitif bei Sonnenuntergang, mit Blick ins Grüne.", tags: ["Gartenblick", "Privater Außenbereich"] },
    ],
  },
  gallery: ["Wohnzimmer", "Doppelzimmer", "Wohnbereich", "Küchenecke", "Zweibettzimmer", "Offener Raum", "Badewanne", "Die Aussicht", "Essbereich", "Entspannung"],
  lightbox: { close: "Schließen", prev: "Zurück", next: "Weiter" },
  stack: {
    kicker: "Perfekt für", title1: "Eine Wohnung,", title2: "viele Reisen",
    items: [
      { title: "Familien", text: "Zwei Schlafzimmer, Schlafsofa und komplette Küche: Platz für alle, bis zu 5 Gäste.", tag: "Bis zu 5 Gäste" },
      { title: "Homeoffice", text: "Schnelles WLAN, Schreibtisch und Ruhe. Für Geschäftsreisen oder längere Aufenthalte.", tag: "Kostenloses WLAN" },
      { title: "Flüge ab Orio", text: "Der Flughafen ist 4 km entfernt: spät abends ankommen oder im Morgengrauen abreisen, ganz ohne Stress.", tag: "4 km zum Flughafen" },
      { title: "Mit deinem Hund", text: "Vierbeinige Freunde sind willkommen, und es gibt einen Balkon zum Garten.", tag: "Haustiere erlaubt" },
    ],
  },
  amen: {
    kicker: "Ausstattung", title1: "Alles inklusive,", title2: "keine Sorgen",
    sub: "Ankommen, Koffer abstellen und zu Hause sein. Bettwäsche, Handtücher und Reinigung sind schon geregelt.", photoAlt: "Wohnzimmer",
    items: [
      { label: "Kostenloses WLAN", text: "Schnell, in der ganzen Wohnung" }, { label: "Parkplatz", text: "Kostenlos, in der Nähe" },
      { label: "Klimaanlage", text: "Auf Anfrage, 10 € pro Tag" }, { label: "Haustiere erlaubt", text: "Tiere sind willkommen" },
      { label: "Smart-TV", text: "Mit Streaming-Diensten" }, { label: "Komplette Küche", text: "Backofen, Mikrowelle, Kaffee" },
      { label: "Waschmaschine", text: "Für längere Aufenthalte" }, { label: "Homeoffice", text: "Eigener Schreibtisch" },
    ],
  },
  rev: {
    siteKicker: "Auf unserer Website", siteTitle1: "Geschrieben von Gästen,", siteTitle2: "die schon hier waren",
    kicker: "Bewertungen", superb: "Hervorragend", avg: (c) => `Durchschnitt aus ${c} verifizierten Bewertungen echter Gäste auf Booking.com`,
    read: "Bewertungen lesen", k2: "Das sagen unsere Gäste", t1: "Sauberkeit und Komfort", t2: "mit 9,7",
    scores: ["Sauberkeit", "Komfort", "Ausstattung", "Personal", "Preis-Leistung", "Lage"], sticker: "ZUFRIEDENE GÄSTE • ECHTE BEWERTUNGEN • ",
  },
  berg: {
    kicker: "Lage", title1: "Bergamo", title2: "zum Greifen nah",
    sub: "Ruhiges Wohngebiet. In wenigen Minuten bist du am Flughafen, auf der Messe oder im Zentrum; in einer Viertelstunde auf den Mauern der Oberstadt.",
    places: ["Flughafen Orio al Serio", "Messe Bergamo", "Accademia Carrara", "Teatro Donizetti", "Gewiss Stadium", "Oberstadt (Città Alta)"],
    alta: "Oberstadt", porta: "Porta San Giacomo", directions: "Route", mapTitle: "Karte Flori's Home", skyPin: "Orio al Serio · 4 km",
  },
  act: {
    zoomCity: "Bergamo", zoomAll: "Umgebung",
    view: "Ansicht", viewCards: "Karten", viewMap: "Karte", home: "Flori's Home · dein Zuhause",
    "kicker": "Entdecken",
    "title1": "Was man",
    "title2": "in der Nähe erleben kann",
    "sub": "Die Erlebnisse, die wir unseren Gästen empfehlen – alle online buchbar. Fahrzeiten mit dem Auto ab der Wohnung.",
    "cats": {
      "all": "Alle",
      "culture": "Kultur",
      "nature": "Seen & Natur",
      "family": "Familien",
      "relax": "Entspannung",
      "food": "Kulinarik",
      "sport": "Sport",
      "shop": "Shopping"
    },
    "cta": {
      "book": "Buchen",
      "tickets": "Tickets",
      "info": "Entdecken"
    },
    "from": "ab",
    "askT": "Unsicher, was du wählen sollst?",
    "askS": "Schreib uns auf WhatsApp: Wir empfehlen dir den richtigen Ort und die Restaurants, in denen wir selbst essen.",
    "askCta": "Frag uns",
    "waText": "Hallo! Ich komme bald ins Flori's Home: Was empfehlt ihr in der Umgebung?",
    "note": "Die Links führen zu offiziellen Websites oder Partnern: Preise und Verfügbarkeit liegen bei ihnen.",
    "items": {
      "alta": {
        "title": "Oberstadt mit offiziellem Guide",
        "desc": "Venezianische Mauern (UNESCO), Piazza Vecchia und Colleoni-Kapelle bei einer 2-stündigen Führung zu Fuß. Sonn- und feiertags um 10:30 Uhr (auf Italienisch).",
        "where": "Torre del Gombito"
      },
      "funi": {
        "title": "Standseilbahnen Oberstadt & San Vigilio",
        "desc": "Mit der Standseilbahn in die mittelalterliche Altstadt und weiter hinauf zur Burg San Vigilio: Sonnenuntergang über der Ebene.",
        "where": "Viale Vittorio Emanuele"
      },
      "carrara": {
        "title": "Accademia Carrara",
        "desc": "Eine der schönsten Gemäldegalerien Italiens: Raffael, Botticelli, Mantegna, Bellini – und Ausstellungen das ganze Jahr.",
        "where": "Piazza Carrara"
      },
      "donizetti": {
        "title": "Teatro Donizetti",
        "desc": "Oper, Schauspiel, Konzerte und das Donizetti Opera Festival im historischen Theater der Unterstadt.",
        "where": "Unterstadt"
      },
      "atalanta": {
        "title": "Atalanta im Gewiss Stadium",
        "desc": "Erlebe ein Spiel von Atalanta in einem der stimmungsvollsten Stadien Italiens, nur wenige Minuten entfernt.",
        "where": "Gewiss Stadium"
      },
      "cooking": {
        "title": "Bergamasker Kochkurs",
        "desc": "Casoncelli, Polenta Taragna und Scarpinocc: Koche mit einer Cesarina bei ihr zu Hause und esst danach zusammen.",
        "where": "Bergamo & Umgebung"
      },
      "leolandia": {
        "title": "Leolandia",
        "desc": "Der Lieblings-Freizeitpark der Kinder: Fahrgeschäfte, Shows und bekannte Zeichentrickfiguren.",
        "where": "Capriate San Gervasio"
      },
      "crespi": {
        "title": "Arbeiterdorf Crespi d'Adda",
        "desc": "UNESCO-Welterbe: eine Arbeitersiedlung, unverändert seit dem späten 19. Jahrhundert. Führungen und Spaziergänge an der Adda.",
        "where": "Capriate San Gervasio"
      },
      "terme": {
        "title": "QC Terme San Pellegrino",
        "desc": "Ein Wellness-Tag im Val Brembana: Thermalbecken, Saunen und Wellness-Parcours in einem Jugendstilgebäude.",
        "where": "San Pellegrino Terme"
      },
      "iseo": {
        "title": "Iseosee & Monte Isola",
        "desc": "Mit dem Schiff nach Monte Isola, Europas größter Seeinsel: Fischerdörfer, Radtouren und Fisch aus dem See.",
        "where": "Sarnico · Iseo"
      },
      "como": {
        "title": "Comer See",
        "desc": "Von Lecco mit dem Schiff nach Bellagio und Varenna: Villen, Gärten und die berühmtesten Ausblicke des Sees.",
        "where": "Ab Lecco"
      },
      "orio": {
        "title": "Orio Center",
        "desc": "Eines der größten Einkaufszentren Italiens, direkt am Flughafen: Shops, Restaurants und Kino.",
        "where": "Orio al Serio"
      }
    }
  },
  book: {
    tfMapFrom: "Flughafen Orio al Serio", tfMapEta: "≈ 10 Min. vom Flughafen bis zur Wohnung",
    perPerson: "pro Person", perNightEx: "pro Tag", free: "Gratis",
    residence: "Wohnort", residencePh: "z. B. Bergamo",
    othersDue: (d) => `Falls du sie jetzt nicht hast, schick uns die Daten der weiteren Gäste bis ${d}: Laut Gesetz müssen sie vor der Ankunft gemeldet werden, nicht beim Check-in.`,
    extraGuest: (n, inc, p) => `Preis für ${n} Gäste: Grundpreis bis ${inc} Personen, +${p} % pro Nacht für jeden weiteren Gast.`,
    cancelUntil: (d, n) => `Kostenlose Stornierung bis ${d} (${n} Tage vor Anreise). Danach ist keine Stornierung mehr möglich.`,
    cancelNo: (n) => `Weniger als ${n} Tage bis zur Anreise: Diese Buchung ist nicht stornierbar.`,
    exTitle: "Extras", exSub: "Jetzt hinzufügen – wir bereiten alles für deine Ankunft vor. Zahlung in bar bei Ankunft.",
    ex: {
      cot: { t: "Babybett", s: "Kinderbett für die Kleinsten, gratis" },
      highchair: { t: "Hochstuhl", s: "Für die Mahlzeiten in der Küche, gratis" },
      earlyIn: { t: "Früher Check-in", s: "Ab 12:00 Uhr, nach Bestätigung" },
      lateOut: { t: "Später Check-out", s: "Bis 13:00 Uhr, nach Bestätigung" },
      ac: { t: "Klimaanlage", s: "Für den ganzen Aufenthalt" },
    },
    cashPay: (x, ex, tax) => `Davon ${x} in bar bei Ankunft zu zahlen: ${[ex && "Extras", tax && "Kurtaxe (Minderjährige befreit)"].filter(Boolean).join(" und ")}.`,
    tax: "Kurtaxe",
    taxNote: (r, c, n) => `${r} % pro Nacht und Erwachsenem, max. ${c}${Number(n) ? `, erste ${n} Nächte` : ""}`,
    taxPay: (x) => `Im Gesamtpreis sind ${x} städtische Kurtaxe enthalten, zahlbar bei Ankunft. Minderjährige sind befreit.`,
    kicker: "Direkt buchen", title1: "Wähle deine Daten,", title2: "der Rest ist einfach",
    sub: "Preise und Verfügbarkeit in Echtzeit. Keine Gebühren, keine Online-Zahlung.",
    steps: ["Daten", "Deine Angaben", "Gesendet"],
    closedT: "Buchungen vorübergehend geschlossen", closedS: "Schreib uns trotzdem: Wir melden uns, sobald wieder geöffnet ist.",
    legend: ["Ausgewählt", "Belegt", "Sonderpreis"],
    tfTitle: "Flughafentransfer", tfSub: "Wir holen dich am Flughafen Orio al Serio ab und bringen dich zur Wohnung",
    tfTime: "Landezeit", tfFlight: "Flugnummer", tfFlightPh: "z. B. FR1234", tfNote: "Optional: Du kannst sie uns auch später per WhatsApp schicken.",
    formTitle: "Wer kommt zu Besuch?", formSub: "Wir schreiben dir per WhatsApp und E-Mail, um die Verfügbarkeit zu bestätigen.",
    contacts: "Kontakt", email: "E-Mail", phone: "WhatsApp-Nummer", mainGuest: "Hauptgast", asOnDoc: "wie im Ausweis",
    firstName: "Vorname", lastName: "Nachname", sex: "Geschlecht", birth: "Geburtsdatum", years: "Jahre",
    birthPlace: "Geburtsort", cityPh: "Stadt", birthCountry: "Geburtsland", nationality: "Staatsangehörigkeit",
    minor: "Der Hauptgast muss volljährig sein.", doc: "Ausweisdokument",
    docTypes: { "Carta d'identità": "Personalausweis", Passaporto: "Reisepass", "Patente di guida": "Führerschein" },
    docNumber: "Ausweisnummer", passportNumber: "Reisepassnummer", issuedBy: "Ausgestellt von", issuedByPh: "Behörde oder Land",
    others: "Weitere Gäste", othersNote: "spätestens am Tag vor dem Check-in senden", guestN: (c) => `Gast ${c}`,
    notes: "Anmerkungen (optional)", notesPh: "Ankunftszeit, besondere Wünsche…", pet: "Ich reise mit Haustier", petFee: (x) => `max. 1 · ${x} pro Aufenthalt`, petLine: "Haustier",
    law: "Nach italienischem Recht (Art. 109 TULPS) melden wir die Daten der Gäste über das Portal Alloggiati Web der Polizei. Wir nutzen sie nur dafür und für die Verwaltung deines Aufenthalts: Sie werden niemals weitergegeben.",
    consent: "Ich stimme der Verarbeitung meiner Daten und der Daten der anderen Gäste zur Abwicklung der Buchung und zur Erfüllung gesetzlicher Pflichten zu.",
    back: "Daten ändern", almost: "Fast geschafft!", sent: "Anfrage gesendet!",
    waDone1: "WhatsApp hat sich mit der fertigen Nachricht geöffnet:", waDone2: "tippe auf Senden", waDone3: "und wir erhalten deine Anfrage.", waNotOpen: "WhatsApp hat sich nicht geöffnet?",
    apiDone: (name) => `Danke ${name}! Wir haben dir per WhatsApp geschrieben. Sobald wir bestätigen, sind deine Daten reserviert und du erhältst eine E-Mail und eine Kalendereinladung mit allen Details.`,
    code: "Code", newReq: "Neue Anfrage", perNight: "/ Nacht", updating: "wird aktualisiert", updated: "aktuell",
    status: {
      ok: "Verfügbar! Jetzt deine Angaben", unavailable: "Einige Nächte sind bereits belegt", closed: "Derzeit nehmen wir keine Buchungen an",
      past: "Diese Daten liegen in der Vergangenheit", min: (c) => `Mindestaufenthalt ${c} Nächte`, pickDeparture: "Wähle jetzt den Abreisetag", pickArrival: "Wähle den Anreisetag im Kalender",
    },
    nightsN: (c) => n(c, "Nacht", "Nächte"), season: "Saison", weekend: "Wochenende", cleaning: "Endreinigung", transferLine: "Transfer ab Orio al Serio",
    total: "Gesamt", cont: "Weiter", send: "Anfrage senden", sendWa: "Per WhatsApp senden", sending: "Wird gesendet…",
    fine: (dep) => `Jetzt keine Zahlung · ${dep} Kaution in bar, Rückgabe beim Check-out`, less: "Weniger", more: "Mehr",
  },
  faq: {
    kicker: "Gut zu wissen", title1: "Häufige", title2: "Fragen", facts: ["Check-in", "Check-out", "Mindestens", "Kaution"],
    minN: (c) => n(c, "Nacht", "Nächte"), rules: "Rauchen in der Wohnung verboten · keine Partys · 1 Haustier erlaubt (50 € pro Aufenthalt)",
    items: [
      { q: "Wie weit ist der Flughafen Orio al Serio entfernt?", a: "Etwa 4 km: wenige Minuten mit Auto oder Taxi. Ideal für sehr frühe oder späte Flüge." },
      { q: "Wie komme ich in die Oberstadt?", a: "Mit dem Auto in etwa 15 Minuten, oder mit öffentlichen Verkehrsmitteln ins Zentrum und dann mit der Standseilbahn." },
      { q: "Ist der Parkplatz inklusive?", a: "Ja: In der Nähe des Hauses gibt es kostenlose Parkplätze." },
      { q: "Kann ich meine Buchung stornieren?", a: "Ja, kostenlos bis 14 Tage vor der Anreise. Danach ist die Buchung nicht mehr stornierbar." },
      { q: "Gibt es eine Klimaanlage?", a: "Ja, auf Anfrage für 10 € pro Tag: Du kannst sie bei der Buchung hinzufügen." },
      { q: "Darf ich meinen Hund mitbringen?", a: "Natürlich, Flori's Home ist haustierfreundlich: 1 Tier ist erlaubt, mit einem Aufpreis von 50 € pro Aufenthalt. Wähle die Option bei der Buchung." },
      { q: "Eignet sie sich fürs Homeoffice?", a: "Ja: kostenloses WLAN, Schreibtisch und ruhige Räume." },
    ],
  },
  foot: {
    guide: "Gäste-Guide",
    hint: "fahre mit der Maus hierher ✨", title1: "Wir freuen uns auf dich", title2: "in Bergamo", sub: "Wähle deine Daten: Wir bestätigen die Verfügbarkeit in wenigen Minuten.",
    cta: "Verfügbarkeit prüfen", contacts: "Kontakt", explore: "Entdecken", copy: "Ferienwohnung", photos: "Stadtfotos: Unsplash",
  },
  guide: {
    reviewT: "Wie war dein Aufenthalt?", reviewS: "Hinterlass uns eine Bewertung: Das dauert 30 Sekunden und hilft künftigen Gästen.", reviewCta: "Bewertung schreiben",
    cdDays: (n) => `Tage bis zu deiner Ankunft in Bergamo`, cdTomorrow: "Morgen geht's los! Bis bald in Bergamo.", cdToday: (ci) => `Heute ist es so weit! Wir erwarten dich ab ${String(ci).split(/[–-]/)[0].trim()} Uhr.`, cdStay: (d, n) => `Tag ${d} von ${n}: genieß Bergamo!`, cdAfter: "Danke, dass du bei uns warst: komm bald wieder!",
    title: "Hausguide", welcome1: "Willkommen", welcome2: "zu Hause",
    hello: (n) => `Hallo ${n},`, helloEm: "willkommen!",
    sub: "Alles, was du während deines Aufenthalts brauchst – an einem Ort.",
    stay: (a, b) => `Wir erwarten dich von ${a} bis ${b}. Hier findest du alles Wichtige.`,
    checkIn: "Check-in", checkOut: "Check-out",
    codeTitle: "Hast du deinen Aufenthaltscode?", codeSub: "Du findest ihn in der Bestätigung per WhatsApp oder E-Mail.",
    open: "Guide öffnen", checking: "Prüfe…", bad: "Ungültiger oder abgelaufener Code: prüfe ihn oder schreib uns auf WhatsApp.", logout: "Abmelden",
    locked: "Sichtbar mit deinem Aufenthaltscode",
    wifi: "WLAN", network: "Netzwerk", password: "Passwort", copy: "Kopieren", copied: "Kopiert!", askHost: "Frag uns auf WhatsApp nach dem Passwort.",
    entry: "So kommst du rein", entryEmpty: "Wir schicken dir die Anleitung vor deiner Ankunft per WhatsApp.",
    times: "Ankunft & Abreise", timesTxt: (ci, co) => `Check-in ${ci}, Check-out ${co}.`, timesLate: "Ankunft außerhalb dieser Zeiten? Schreib uns, wir finden eine Lösung.",
    parking: "Parken", parkingDefault: "Kostenlose Parkplätze in der Nähe.",
    rules: "Hausregeln",
    rulesList: (ci, co, dep) => [`Check-in ${ci}, Check-out ${co}.`, "Keine Partys oder Veranstaltungen.", "Haustiere erlaubt: max. 1, Aufpreis 50 € pro Aufenthalt.", `Kaution von ${dep} in bar, Rückgabe beim Check-out.`],
    waste: "Mülltrennung", wasteSub: "In Bergamo wird der Müll an der Haustür abgeholt: bitte so trennen.",
    wasteItems: [["Bioabfall", "in kompostierbaren Beuteln"], ["Papier & Karton", "flach, in Kartons oder Papiertüten"], ["Plastik", "im gelben Sack"], ["Glas & Metall", "zusammen, inkl. Dosen, ohne Beutel"], ["Restmüll", "im durchsichtigen Sack"]],
    wasteDays: "Abholtage",
    checkout: "Vor der Abreise", checkoutList: ["Licht, Heizung und Klimaanlage ausschalten", "Fenster und Balkontür schließen", "Müll in die richtigen Behälter werfen", "Schlüssel wie besprochen hinterlassen"],
    numbers: "Wichtige Nummern", host: "Wir, auf WhatsApp", n112: "Notruf: Polizei, Rettungsdienst, Feuerwehr", n116: "Ärztlicher Bereitschaftsdienst (nachts & feiertags)", taxi: "Radio Taxi Bergamo",
    notes: "Hinweise vom Gastgeber", around: "Was man in der Nähe erleben kann", aroundSub: "Oberstadt, Seen, Thermen und unsere Lieblingserlebnisse – online buchbar.", aroundCta: "Erlebnisse entdecken",
    enjoy: "Schöne Zeit in Bergamo!", back: "Zurück zur Website",
  },
  wx: { today: "Heute in Bergamo", kinds: { clear: "klar", cloudy: "bewölkt", fog: "Nebel", rain: "Regen", snow: "Schnee", storm: "Gewitter" } },
  rw: {
    kicker: "Bewertung", title: "Bewertung schreiben", title1: "Wie war dein", title2: "Aufenthalt?",
    sub: "Danke, dass du bei uns warst! Deine Meinung hilft künftigen Reisenden und uns, besser zu werden.",
    rating: "Bewertung", tap: "Tippe auf die Sterne", words: ["Verbesserungswürdig", "Geht so", "Gut", "Sehr schön", "Perfekt!"],
    name: "Dein Name", namePh: "z. B. Anna", country: "Woher kommst du (optional)", countryPh: "z. B. München, Deutschland",
    text: "Erzähl von deinem Aufenthalt", textPh: "Was dir an der Wohnung, der Gegend, dem Empfang gefallen hat…",
    code: "Aufenthaltscode", codeHint: "Du findest ihn in der Bestätigung oder im Hausguide.",
    send: "Bewertung senden", sending: "Wird gesendet…", note: "Die Bewertung erscheint nach einer kurzen Prüfung auf der Website. Wir veröffentlichen nur Name und Land.",
    errExists: "Du hast diesen Aufenthalt schon bewertet: danke!", errCode: "Ungültiger oder abgelaufener Code: prüfe ihn oder schreib uns auf WhatsApp.", errGeneric: "Senden fehlgeschlagen, bitte gleich nochmal versuchen.",
    thanks: (n) => `Danke${n ? `, ${n}` : ""}!`, thanksSub: "Deine Bewertung ist angekommen: Wir veröffentlichen sie nach einer kurzen Prüfung.",
    google: "Auch auf Google bewerten", back: "Zurück zur Website",
  },
  mbar: { perNight: "/ Nacht", superb: "Hervorragend", cta: "Daten wählen" },
  cal: { wd: ["M", "D", "M", "D", "F", "S", "S"], unavailable: "Nicht verfügbar", perNight: "/ Nacht", prev: "Vorheriger Monat", next: "Nächster Monat" },
};
