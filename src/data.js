// ============================================================
//  FLORI'S HOME — tutti i contenuti del sito
// ============================================================

// Foto ufficiali dell'annuncio (CDN Booking)
const bk = (id, k, size = "max1280x900") =>
  `https://cf.bstatic.com/xdata/images/hotel/${size}/${id}.jpg?k=${k}&o=`;

export const P = {
  living:    bk("549907859", "ea13e4a8c2f415e4e67b070b9d2827b418df3de88184a13f617f2c0f2db8de5e"),
  living2:   bk("674872214", "cffe37dc146cdf9c39cc5cb21b0c5a84048dd186eed0776053b280a12af56ecc"),
  dining:    bk("934306171", "4e029d840e78422322ccffe6a88f89003404b1ae174deb75e5db6786efc0b852"),
  sofa:      bk("934308576", "02eb39f9f346326ae1d809ac59bf6a7107a18e5ae8ab9e85f6be67d7f2d44144"),
  tv:        bk("674872244", "8ae6b361b3c972b1846919f53ad9c6ac77c5c341d6faae361e20c7596c6399be"),
  living3:   bk("559417766", "b56ef07a9b87a2faf5ad79b2f8cdcb48a467b819778e0b2f231ce22443aa3f14"),
  living4:   bk("674872187", "c5f01ada86467575ab470e49e4ce25c754a32675995fe52fe84944dfbae5049f"),
  view:      bk("549908080", "a279425aa1c80ec7928b452718ed6a5ea42c5620a5512008f65cae0b8dd6fbe4"),
  balcony:   bk("549908086", "7958d878d57e1cf247c0ff0eb3d7ec41e48020893e74b659a988d41f1e83249c"),
  twin:      bk("674872464", "0a11cdb3c6638428ee833c3729b48181a1fc380fcb57a3e3f91657e8ce06db44"),
  twin2:     bk("549908182", "c9840af931483dd7f0592c7091d2c810fc55119ef936c81aa3b6df724a5c70b4"),
  double:    bk("674871963", "f7aeb11017e1c522ba463ce9a36f889c880a74e794e11c67650f897016b6cb7b"),
  double2:   bk("674872272", "3fd3d1ccea49778ae7700a735a882ecc46d4f5b2fad91095a11f9e50b15230da"),
  kitchen:   bk("674872549", "561011ffad06fb0ab7a24a5d1e971de270d7a388dea63908929ecc154c4e07b5"),
  kitchen2:  bk("791235933", "fd86076a6b838040963ab2885b4a1c642135fbc120ffe192a4cdbb606146aa43"),
  bath:      bk("674872618", "d4ef7f60bfdd7c9000812c8322ae4170ec41001e85c6a406ccd9808e8e5a2cfb"),
  bath2:     bk("934308202", "9dcdd8076cfb2fa773250ecb7afce334ce1fe996143985e41a2d31207339ee81"),
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
  address: "Via San Pio X, 16 — 24125 Bergamo",
  coords: { lat: 45.69282, lng: 9.70946 },

  // ⚠️ Inserisci i contatti reali
  whatsapp: "390000000000",
  email: "info@floris-home.it",
  phone: "+39 000 000 0000",

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
  { icon: "Car", label: "Parcheggio", text: "Gratuito, sotto casa" },
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
  { q: "Il parcheggio è incluso?", a: "Sì, è gratuito per gli ospiti." },
  { q: "Posso portare il mio cane?", a: "Certo, Flori's Home è pet friendly. Avvisaci al momento della richiesta." },
  { q: "Va bene per lavorare da remoto?", a: "Sì: Wi-Fi gratuito, scrivania e ambienti silenziosi." },
];
