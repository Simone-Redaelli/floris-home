// ============================================================
//  FLORI'S HOME — tutti i contenuti del sito
// ============================================================

// Foto ufficiali dell'annuncio (CDN Booking)
// Foto caricate nel progetto (public/images)
const loc = (f) => `${import.meta.env.BASE_URL}images/${f}`;

const bk = (id, k, size = "max1280x900") =>
  `https://cf.bstatic.com/xdata/images/hotel/${size}/${id}.jpg?k=${k}&o=`;

export const P = {
  living: loc("soggiorno.jpg"),
  living2:   bk("674872214", "cffe37dc146cdf9c39cc5cb21b0c5a84048dd186eed0776053b280a12af56ecc"),
  dining: loc("pranzo.jpg"),
  sofa: bk("549907859", "ea13e4a8c2f415e4e67b070b9d2827b418df3de88184a13f617f2c0f2db8de5e"),
  tv:        bk("674872244", "8ae6b361b3c972b1846919f53ad9c6ac77c5c341d6faae361e20c7596c6399be"),
  living3:   bk("559417766", "b56ef07a9b87a2faf5ad79b2f8cdcb48a467b819778e0b2f231ce22443aa3f14"),
  living4:   bk("674872187", "c5f01ada86467575ab470e49e4ce25c754a32675995fe52fe84944dfbae5049f"),
  view:      bk("549908080", "a279425aa1c80ec7928b452718ed6a5ea42c5620a5512008f65cae0b8dd6fbe4"),
  balcony:   bk("549908086", "7958d878d57e1cf247c0ff0eb3d7ec41e48020893e74b659a988d41f1e83249c"),
  twin:      bk("674872464", "0a11cdb3c6638428ee833c3729b48181a1fc380fcb57a3e3f91657e8ce06db44"),
  twin2:     bk("549908182", "c9840af931483dd7f0592c7091d2c810fc55119ef936c81aa3b6df724a5c70b4"),
  double: loc("matrimoniale.jpg"),
  double2:   bk("674872272", "3fd3d1ccea49778ae7700a735a882ecc46d4f5b2fad91095a11f9e50b15230da"),
  kitchen: loc("cucina.jpg"),
  kitchen2:  bk("791235933", "fd86076a6b838040963ab2885b4a1c642135fbc120ffe192a4cdbb606146aa43"),
  bath: loc("bagno.jpg"),
  bath2: loc("vasca.jpg"),
  bath3:     bk("934308358", "7fc62ff04b29b8f67e7ad1fb643c6033f75000bd44eabfbda92929dbd97fc233"),
  details:   bk("648241537", "7302c1fe983bbb0fec1b394f71d1c8f16f62d8945513df96124b2ee7da73231a"),
  entrance:  bk("674872692", "4600e5315093795a9ef8eabe36bbe92e0e5468cec2dca221cf14efb9cb508b64"),
};

// Foto di Bergamo (Unsplash, licenza libera)
export const CITY = {
  porta: "https://images.unsplash.com/photo-1662124158337-838ade9c98f5?auto=format&fit=crop&w=1800&q=80",
  alta: "https://images.unsplash.com/photo-1661857519018-e59569789e42?auto=format&fit=crop&w=1800&q=80",
  monti: "https://images.unsplash.com/photo-1645879785888-6f2829ba82c6?auto=format&fit=crop&w=1800&q=80",
};

export const SITE = {
  name: "Flori's Home",
  url: "https://simone-redaelli.github.io/floris-home", // indirizzo pubblico del sito
  address: "Via San Pio X, 16 — 24125 Bergamo",
  coords: { lat: 45.69282, lng: 9.70946 },

  // ⚠️ Inserisci i contatti reali
  whatsapp: "393496299929",
  email: "info@floris-home.it",
  phone: "+39 349 629 9929",

  pricePerNight: 130,   // indicativo
  cleaningFee: 40,
  deposit: 300,
  checkIn: "16:00 – 20:00",
  checkOut: "entro le 10:00",

  bookingUrl: "https://www.booking.com/hotel/it/floris-home-bergamo.it.html",
  rating: 9.1,
  reviewsCount: 34,
};

export const STATS = [
  { value: 80, suffix: "m²", label: "Superficie" },
  { value: 2, suffix: "", label: "Camere" },
  { value: 5, suffix: "", label: "Ospiti" },
  { value: 4, suffix: "km", label: "Da Orio al Serio" },
];

export const MANIFESTO =
  "Ottanta metri quadri di luce, appena ristrutturati. Due camere, un soggiorno ampio, un balcone che guarda il verde. Tutto per te, a pochi minuti dall'aeroporto e dal cuore di Bergamo.";

export const TOUR = [
  { id: "ingresso", photo: P.entrance, kicker: "Si entra", title: "Ingresso",
    text: "La porta si apre su un corridoio luminoso. Il parcheggio gratuito è a due passi.",
    tags: ["Parcheggio gratuito", "Self check-in"] },
  { id: "soggiorno", photo: P.living, kicker: "Il cuore della casa", title: "Soggiorno",
    text: "Ampio e pieno di luce, con divano letto, smart TV con streaming e tavolo da pranzo per tutta la famiglia.",
    tags: ["Divano letto", "Smart TV", "Aria condizionata"] },
  { id: "cucina", photo: P.kitchen, kicker: "Come a casa", title: "Cucina",
    text: "Completamente attrezzata: piano cottura, forno, microonde, frigorifero, bollitore e macchina del caffè.",
    tags: ["Forno", "Microonde", "Caffè"] },
  { id: "matrimoniale", photo: P.double, kicker: "Riposo", title: "Matrimoniale",
    text: "Letto matrimoniale, armadio capiente e tende leggere. Biancheria e asciugamani sempre inclusi.",
    tags: ["Letto matrimoniale", "Biancheria inclusa"] },
  { id: "doppia", photo: P.twin, kicker: "Per tutti", title: "Camera doppia",
    text: "Due letti singoli, perfetti per bambini, amici o colleghi in trasferta.",
    tags: ["2 letti singoli", "Armadio"] },
  { id: "bagno", photo: P.bath, kicker: "Relax", title: "Bagno",
    text: "Vasca da bagno, bidet, asciugacapelli e lavatrice a disposizione.",
    tags: ["Vasca", "Lavatrice", "Phon"] },
  { id: "balcone", photo: P.balcony, kicker: "All'aperto", title: "Balcone",
    text: "Il posto giusto per il caffè del mattino o un aperitivo al tramonto, affacciato sul verde.",
    tags: ["Vista giardino", "Esterno privato"] },
];

export const GALLERY = [
  { src: P.living2, label: "Soggiorno" },
  { src: P.double2, label: "Camera matrimoniale" },
  { src: P.sofa, label: "Zona living" },
  { src: P.kitchen2, label: "Angolo cottura" },
  { src: P.twin2, label: "Camera doppia" },
  { src: P.living4, label: "Open space" },
  { src: P.bath2, label: "Vasca" },
  { src: P.view, label: "La vista" },
  { src: P.dining, label: "Pranzo" },
  { src: P.tv, label: "Relax" },
];

export const AMENITIES = [
  { icon: "Wifi", label: "Wi-Fi gratuito", text: "Veloce, in tutta la casa" },
  { icon: "Car", label: "Parcheggio", text: "Gratuito, nelle vicinanze" },
  { icon: "Snowflake", label: "Aria condizionata", text: "In tutto l'appartamento" },
  { icon: "PawPrint", label: "Pet friendly", text: "Gli animali sono benvenuti" },
  { icon: "Tv", label: "Smart TV", text: "Con servizi di streaming" },
  { icon: "CookingPot", label: "Cucina completa", text: "Forno, microonde, caffè" },
  { icon: "WashingMachine", label: "Lavatrice", text: "Per i soggiorni lunghi" },
  { icon: "Laptop", label: "Smart working", text: "Scrivania dedicata" },
];

export const PLACES = [
  { name: "Aeroporto Orio al Serio", km: 4, min: "8 min" },
  { name: "Fiera di Bergamo", km: 3.1, min: "7 min" },
  { name: "Accademia Carrara", km: 4.2, min: "12 min" },
  { name: "Teatro Donizetti", km: 4.4, min: "12 min" },
  { name: "Gewiss Stadium", km: 5, min: "13 min" },
  { name: "Città Alta", km: 6, min: "15 min" },
];

export const SCORES = [
  { label: "Pulizia", value: 9.7 },
  { label: "Comfort", value: 9.6 },
  { label: "Servizi", value: 9.4 },
  { label: "Staff", value: 9.4 },
  { label: "Qualità / prezzo", value: 9.4 },
  { label: "Posizione", value: 8.6 },
];

export const RULES = [
  ["Check-in", SITE.checkIn],
  ["Check-out", SITE.checkOut],
  ["Cauzione", `€${SITE.deposit} in contanti, restituiti al check-out`],
  ["Fumo", "Non si fuma in casa"],
  ["Feste", "Non sono ammesse feste o addii al celibato"],
  ["Animali", "Ammessi, avvisaci prima"],
];

export const FAQ = [
  { q: "Quanto dista dall'aeroporto di Orio al Serio?", a: "Circa 4 km: pochi minuti in auto o taxi. Ideale per voli all'alba o in tarda serata." },
  { q: "Come si raggiunge Città Alta?", a: "In auto in circa 15 minuti, oppure con i mezzi fino al centro e poi la funicolare." },
  { q: "Il parcheggio è incluso?", a: "Sì: c'è parcheggio gratuito nelle vicinanze della casa." },
  { q: "Posso portare il mio cane?", a: "Certo, Flori's Home è pet friendly. Avvisaci al momento della richiesta." },
  { q: "Va bene per lavorare da remoto?", a: "Sì: Wi-Fi gratuito, scrivania e ambienti silenziosi." },
];

export const ROTATE = ["famiglie", "smart worker", "chi vola da Orio", "un weekend in due", "chi ha un cane"];

export const AUDIENCE = [
  { title: "Famiglie", text: "Due camere, divano letto e cucina completa: c'è spazio per tutti, fino a 5 ospiti.", photo: P.twin, tag: "Fino a 5 ospiti" },
  { title: "Smart working", text: "Wi-Fi veloce, scrivania e silenzio. Per trasferte di lavoro o soggiorni lunghi.", photo: P.living3, tag: "Wi-Fi gratuito" },
  { title: "Voli da Orio", text: "L'aeroporto è a 4 km: arrivi la sera tardi o riparti all'alba senza stress.", photo: P.entrance, tag: "4 km dall'aeroporto" },
  { title: "Con il tuo cane", text: "Gli amici a quattro zampe sono i benvenuti, e c'è un balcone sul verde.", photo: P.balcony, tag: "Pet friendly" },
];

export const TRUST = ["9,1 Superbo su Booking", "Parcheggio gratuito vicino", "4 km da Orio al Serio", "Animali ammessi", "Aria condizionata", "Appena ristrutturato", "Wi-Fi veloce", "Check-in flessibile"];

/* ---------- ATTIVITÀ VICINO A CASA ----------
   km / min = in auto da Via San Pio X. I testi sono in src/i18n (act.items.<id>).
   cta: "book" = prenota, "tickets" = biglietti, "info" = scopri */
export const ACTIVITIES = [
  { id: "alta", lat: 45.7035, lng: 9.6628, cat: "culture", icon: "Landmark", km: 6, min: 15, from: 13, cta: "book", featured: true, img: "alta",
    url: "https://www.visitbergamo.net/en/oggetto/guided-tour-of-upper-bergamo-on-sunday-and-on-public-holidays" },
  { id: "funi", lat: 45.701, lng: 9.6652, cat: "culture", icon: "TramFront", km: 5, min: 13, cta: "tickets",
    url: "https://www.atb.bergamo.it/en/atb-network/tourism-in-bergamo/bergamo-funiculars" },
  { id: "carrara", lat: 45.7046, lng: 9.6747, cat: "culture", icon: "Palette", km: 4.2, min: 12, cta: "tickets", url: "https://www.lacarrara.it/" },
  { id: "donizetti", lat: 45.6946, lng: 9.6723, cat: "culture", icon: "Drama", km: 4.4, min: 12, cta: "tickets", url: "https://www.teatrodonizetti.it/" },
  { id: "atalanta", lat: 45.7087, lng: 9.6807, cat: "sport", icon: "Trophy", km: 5, min: 13, cta: "tickets", url: "https://www.atalanta.it/biglietteria" },
  { id: "cooking", cat: "food", icon: "ChefHat", km: 10, min: 20, from: 102, cta: "book", url: "https://cesarine.com/search/bergamo" },
  { id: "leolandia", lat: 45.606, lng: 9.5383, cat: "family", icon: "FerrisWheel", km: 22, min: 25, cta: "tickets", url: "https://www.leolandia.it/" },
  { id: "crespi", lat: 45.5967, lng: 9.5361, cat: "culture", icon: "Factory", km: 20, min: 25, cta: "book", url: "https://www.crespidadda.it/" },
  { id: "terme", lat: 45.835, lng: 9.665, cat: "relax", icon: "Waves", km: 28, min: 35, cta: "book", url: "https://shop.qcterme.com/en/locations/san-pellegrino" },
  { id: "iseo", lat: 45.715, lng: 10.08, cat: "nature", icon: "Ship", km: 40, min: 40, cta: "tickets", url: "https://www.navigazionelagoiseo.it/" },
  { id: "como", lat: 45.8557, lng: 9.3969, cat: "nature", icon: "Sailboat", km: 35, min: 45, cta: "tickets", url: "https://www.navigazionelaghi.it/" },
  { id: "orio", lat: 45.6697, lng: 9.7004, cat: "shop", icon: "ShoppingBag", km: 4, min: 8, cta: "info", url: "https://www.oriocenter.it/" },
];
export const ACT_CATS = ["all", "culture", "nature", "family", "relax", "food", "sport", "shop"];
