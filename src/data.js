// ============================================================
//  FLORI'S HOME — tutti i contenuti del sito sono qui.
//  Modifica questo file per cambiare testi, prezzi, contatti e foto.
// ============================================================

const IMG = import.meta.env.BASE_URL + "images/";

export const SITE = {
  name: "Flori's Home",
  tagline: "La tua casa a Bergamo",
  address: "Via San Pio X, 16 — 24125 Bergamo (BG)",
  coords: { lat: 45.69282, lng: 9.70946 },

  // ⚠️ Inserisci i contatti reali dell'host
  whatsapp: "390000000000",          // solo numeri, con prefisso 39
  email: "info@floris-home.it",
  phone: "+39 000 000 0000",

  // Prezzo indicativo per notte (usato dal calcolatore preventivo)
  pricePerNight: 130,
  cleaningFee: 40,
  deposit: 300,                       // cauzione in contanti, restituita al check-out
  minNights: 1,

  checkIn: "15:00 – 22:00",           // ⚠️ verifica gli orari reali
  checkOut: "entro le 10:00",

  bookingUrl: "https://www.booking.com/hotel/it/floris-home-bergamo.it.html",
  rating: 9.1,
  reviewsCount: 34,
};

// Metti le foto in /public/images/ con questi nomi (jpg).
// Se una foto manca, il sito mostra un elegante segnaposto colorato.
export const PHOTOS = [
  { src: IMG + "hero.jpg", label: "Soggiorno", tone: ["#c4683f", "#7a3b22"] },
  { src: IMG + "soggiorno.jpg", label: "Living luminoso", tone: ["#d9a066", "#a8582e"] },
  { src: IMG + "camera1.jpg", label: "Camera matrimoniale", tone: ["#6f8f7d", "#2e4a40"] },
  { src: IMG + "camera2.jpg", label: "Seconda camera", tone: ["#9bb3a3", "#4b6a5c"] },
  { src: IMG + "cucina.jpg", label: "Cucina attrezzata", tone: ["#e3c7a1", "#b0835a"] },
  { src: IMG + "bagno.jpg", label: "Bagno con vasca", tone: ["#a7bccb", "#55707f"] },
  { src: IMG + "balcone.jpg", label: "Balcone vista giardino", tone: ["#8fae7a", "#3f5f32"] },
  { src: IMG + "esterno.jpg", label: "Esterno", tone: ["#c99b7c", "#6f4a35"] },
];

export const STATS = [
  { value: 80, suffix: " m²", label: "di spazio tutto tuo" },
  { value: 2, suffix: "", label: "camere da letto" },
  { value: 5, suffix: "", label: "ospiti massimi" },
  { value: 9.1, suffix: "/10", label: "voto degli ospiti", decimals: 1 },
];

export const SPACES = [
  {
    id: "living",
    title: "Soggiorno",
    photo: 1,
    text:
      "Un living ampio e appena ristrutturato, con divano letto, smart TV con servizi di streaming, tavolo da pranzo e scrivania per lavorare in tranquillità.",
    tags: ["Divano letto", "Smart TV", "Scrivania", "Aria condizionata"],
  },
  {
    id: "camere",
    title: "Camere",
    photo: 2,
    text:
      "Due camere da letto separate, silenziose e luminose. Biancheria da letto e asciugamani sono sempre inclusi, così arrivi e ti senti subito a casa.",
    tags: ["2 camere", "Biancheria inclusa", "Armadi", "Oscuranti"],
  },
  {
    id: "cucina",
    title: "Cucina",
    photo: 4,
    text:
      "Cucina completamente attrezzata con piano cottura, forno, microonde, frigorifero, bollitore e macchina del caffè. Perfetta anche per soggiorni lunghi.",
    tags: ["Forno", "Microonde", "Macchina caffè", "Bollitore"],
  },
  {
    id: "bagno",
    title: "Bagno",
    photo: 5,
    text:
      "Bagno privato con vasca, bidet e asciugacapelli. Lavatrice a disposizione degli ospiti.",
    tags: ["Vasca", "Bidet", "Phon", "Lavatrice"],
  },
  {
    id: "balcone",
    title: "Balcone",
    photo: 6,
    text:
      "Il balcone affacciato sul giardino è il posto giusto per un caffè la mattina o un aperitivo al tramonto.",
    tags: ["Vista giardino", "Tranquillo", "Esterno privato"],
  },
];

export const AMENITIES = [
  { icon: "Wifi", label: "Wi-Fi gratuito veloce" },
  { icon: "Car", label: "Parcheggio gratuito" },
  { icon: "Snowflake", label: "Aria condizionata" },
  { icon: "PawPrint", label: "Animali ammessi" },
  { icon: "Tv", label: "Smart TV + streaming" },
  { icon: "CookingPot", label: "Cucina completa" },
  { icon: "WashingMachine", label: "Lavatrice" },
  { icon: "Bath", label: "Vasca da bagno" },
  { icon: "Coffee", label: "Macchina del caffè" },
  { icon: "Laptop", label: "Postazione lavoro" },
  { icon: "Trees", label: "Balcone vista giardino" },
  { icon: "BedDouble", label: "Biancheria inclusa" },
];

export const PLACES = [
  { name: "Aeroporto Orio al Serio", km: 4, kind: "plane" },
  { name: "Fiera di Bergamo", km: 3.1, kind: "pin" },
  { name: "Centro Congressi Giovanni XXIII", km: 3.8, kind: "pin" },
  { name: "Accademia Carrara", km: 4.2, kind: "museum" },
  { name: "Teatro Donizetti", km: 4.4, kind: "museum" },
  { name: "Gewiss Stadium", km: 5, kind: "stadium" },
  { name: "Duomo – Città Alta", km: 6, kind: "church" },
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
  { icon: "LogIn", title: "Check-in", text: SITE.checkIn + " — comunicaci l'orario d'arrivo" },
  { icon: "LogOut", title: "Check-out", text: SITE.checkOut },
  { icon: "CigaretteOff", title: "Non fumatori", text: "Vietato fumare in tutto l'appartamento" },
  { icon: "PartyPopper", title: "Niente feste", text: "Non sono ammessi addii al celibato/nubilato o feste" },
  { icon: "PawPrint", title: "Animali", text: "I tuoi amici a quattro zampe sono i benvenuti" },
  { icon: "ShieldCheck", title: "Cauzione", text: `€${SITE.deposit} in contanti all'arrivo, restituiti al check-out` },
];

export const FAQ = [
  {
    q: "Quanto dista dall'aeroporto di Orio al Serio?",
    a: "Circa 4 km: in auto o taxi sono pochi minuti. Perfetto per voli la mattina presto o in tarda serata.",
  },
  {
    q: "Come si raggiunge Città Alta?",
    a: "In auto in circa 15 minuti, oppure con i mezzi pubblici fino al centro e poi la funicolare per salire in Città Alta.",
  },
  {
    q: "Il parcheggio è incluso?",
    a: "Sì, il parcheggio è gratuito per gli ospiti.",
  },
  {
    q: "Posso portare il mio cane?",
    a: "Certo! Flori's Home è pet friendly. Avvisaci al momento della richiesta.",
  },
  {
    q: "È adatto a chi lavora da remoto?",
    a: "Sì: Wi-Fi gratuito, scrivania dedicata e ambienti silenziosi.",
  },
];

// Tour a scorrimento: l'ordine delle stanze in cui "entri" scrollando.
// photo = indice nell'array PHOTOS
export const TOUR = [
  {
    id: "ingresso", photo: 7, kicker: "Benvenuto", title: "Ingresso",
    text: "Una zona residenziale tranquilla, il parcheggio gratuito a due passi. Apri la porta: da qui inizia il tuo soggiorno.",
    tags: ["Parcheggio gratuito", "Check-in flessibile"],
  },
  ...SPACES.filter((s) => s.id === "living").map((s) => ({ ...s, kicker: "Stanza 1" })),
  ...SPACES.filter((s) => s.id === "cucina").map((s) => ({ ...s, kicker: "Stanza 2" })),
  ...SPACES.filter((s) => s.id === "camere").map((s) => ({ ...s, kicker: "Stanza 3" })),
  ...SPACES.filter((s) => s.id === "bagno").map((s) => ({ ...s, kicker: "Stanza 4" })),
  ...SPACES.filter((s) => s.id === "balcone").map((s) => ({ ...s, kicker: "All'aperto" })),
];
