const n = (c, one, many) => `${c} ${c === 1 ? one : many}`;

export default {
  nav: { links: ["La maison", "Visite", "Services", "Avis", "Bergame", "Activités"], book: "Réserver", menu: "Menu", close: "Fermer", lang: "Langue" },
  door: {
    eyebrow: "Via San Pio X, 16 · Bergame", title1: "Bienvenue", title2: "chez vous", mat: "Bienvenue",
    bell: "Sonnez à la porte", scroll: "ou faites défiler pour entrer", bellAria: "Sonner et ouvrir la porte",
    skip: "Passer", photoAlt: "Le séjour de Flori's Home", cursor: "Sonner",
  },
  hero: {
    open: "Réservations ouvertes", closed: "Réservations fermées", from: "dès", perNight: "la nuit",
    title1: "Votre maison à Bergame,", title2: "idéale pour",
    rotate: ["les familles", "le télétravail", "les vols d'Orio", "un week-end à deux", "voyager avec son chien"],
    sub: "80 m² entièrement rénovés, deux chambres, un balcon sur le jardin et le parking gratuit.",
    arrival: "Arrivée", departure: "Départ", guests: "Voyageurs", addDate: "Ajouter une date",
    guestsN: (c) => n(c, "voyageur", "voyageurs"), check: "Vérifier", book: "Réserver",
    pickArrival: "Choisissez l'arrivée", pickDeparture: "Choisissez le départ", nightsN: (c) => n(c, "nuit", "nuits"),
    clear: "Effacer", max: (c) => `Maximum ${c}`, superb: "Exceptionnel", airport: "À 4 km d'Orio al Serio",
    renovated: "Entièrement rénové", sticker: "RÉSERVEZ EN DIRECT • SANS FRAIS • ", stickerSmall: "de frais",
  },
  trust: ["9,1 Exceptionnel sur Booking", "Parking gratuit", "À 4 km d'Orio al Serio", "Animaux acceptés", "Climatisation", "Entièrement rénové", "Wi-Fi rapide", "Arrivée flexible"],
  casa: {
    kicker: "La maison", title1: "Feuilletez la maison", title2: "comme un album",
    sub: "Tout l'appartement est à vous : 80 m², deux chambres, cuisine, salle de bain avec baignoire et un balcon sur le jardin.",
    hintTouch: "Touchez une photo pour l'agrandir", hintDrag: "Faites glisser les photos, cliquez pour agrandir",
    caps: ["le séjour ☀️", "chambre double", "cuisine équipée", "baignoire 🛁", "le balcon 🌿", "chambre à deux lits", "la vue"],
    rooms: "chambres", guests: "voyageurs", scribble: "tout juste rénové ! ✨",
  },
  tour: {
    kicker: "La visite", scroll: "Faites défiler pour entrer", go: "Aller",
    rooms: [
      { kicker: "On entre", title: "Entrée", text: "La porte s'ouvre sur un couloir lumineux. Le parking gratuit est à deux pas.", tags: ["Parking gratuit", "Arrivée autonome"] },
      { kicker: "Le cœur de la maison", title: "Séjour", text: "Spacieux et lumineux, avec canapé-lit, smart TV avec streaming et table à manger pour toute la famille.", tags: ["Canapé-lit", "Smart TV", "Climatisation"] },
      { kicker: "Comme à la maison", title: "Cuisine", text: "Entièrement équipée : plaques, four, micro-ondes, réfrigérateur, bouilloire et machine à café.", tags: ["Four", "Micro-ondes", "Café"] },
      { kicker: "Repos", title: "Chambre double", text: "Lit double, grande armoire et rideaux légers. Linge de lit et serviettes toujours inclus.", tags: ["Lit double", "Linge inclus"] },
      { kicker: "Pour tous", title: "Chambre à deux lits", text: "Deux lits simples, parfaits pour les enfants, les amis ou les collègues en déplacement.", tags: ["2 lits simples", "Armoire"] },
      { kicker: "Détente", title: "Salle de bain", text: "Baignoire, bidet, sèche-cheveux et lave-linge à disposition.", tags: ["Baignoire", "Lave-linge", "Sèche-cheveux"] },
      { kicker: "En plein air", title: "Balcon", text: "L'endroit idéal pour le café du matin ou un apéritif au coucher du soleil, face au jardin.", tags: ["Vue jardin", "Extérieur privé"] },
    ],
  },
  gallery: ["Séjour", "Chambre double", "Coin salon", "Coin cuisine", "Chambre à deux lits", "Espace ouvert", "Baignoire", "La vue", "Salle à manger", "Détente"],
  lightbox: { close: "Fermer", prev: "Précédente", next: "Suivante" },
  stack: {
    kicker: "Idéal pour", title1: "Une maison,", title2: "mille voyages",
    items: [
      { title: "Familles", text: "Deux chambres, un canapé-lit et une cuisine complète : de la place pour tous, jusqu'à 5 voyageurs.", tag: "Jusqu'à 5 voyageurs" },
      { title: "Télétravail", text: "Wi-Fi rapide, bureau et calme. Pour les déplacements professionnels ou les longs séjours.", tag: "Wi-Fi gratuit" },
      { title: "Vols depuis Orio", text: "L'aéroport est à 4 km : arrivez tard le soir ou repartez à l'aube sans stress.", tag: "À 4 km de l'aéroport" },
      { title: "Avec votre chien", text: "Nos amis à quatre pattes sont les bienvenus, et il y a un balcon sur le jardin.", tag: "Animaux acceptés" },
    ],
  },
  amen: {
    kicker: "Services", title1: "Tout compris,", title2: "zéro souci",
    sub: "Vous arrivez, posez vos valises et vous êtes chez vous. Linge, serviettes et ménage sont prévus.", photoAlt: "Séjour",
    items: [
      { label: "Wi-Fi gratuit", text: "Rapide, dans tout le logement" }, { label: "Parking", text: "Gratuit, au pied de l'immeuble" },
      { label: "Climatisation", text: "Dans tout l'appartement" }, { label: "Animaux acceptés", text: "Les animaux sont les bienvenus" },
      { label: "Smart TV", text: "Avec services de streaming" }, { label: "Cuisine complète", text: "Four, micro-ondes, café" },
      { label: "Lave-linge", text: "Pour les longs séjours" }, { label: "Télétravail", text: "Bureau dédié" },
    ],
  },
  rev: {
    kicker: "Avis", superb: "Exceptionnel", avg: (c) => `Moyenne de ${c} avis vérifiés de vrais voyageurs sur Booking.com`,
    read: "Lire les avis", k2: "Ce qu'en disent les voyageurs", t1: "Propreté et confort", t2: "notés 9,7",
    scores: ["Propreté", "Confort", "Équipements", "Personnel", "Rapport qualité/prix", "Emplacement"], sticker: "VOYAGEURS RAVIS • VRAIS AVIS • ",
  },
  berg: {
    kicker: "Emplacement", title1: "Bergame", title2: "à portée de main",
    sub: "Un quartier résidentiel et calme. En quelques minutes vous êtes à l'aéroport, à la Foire ou au centre ; en un quart d'heure sur les remparts de la Ville Haute.",
    places: ["Aéroport d'Orio al Serio", "Foire de Bergame", "Accademia Carrara", "Théâtre Donizetti", "Gewiss Stadium", "Ville Haute (Città Alta)"],
    alta: "Ville Haute", porta: "Porta San Giacomo", directions: "Itinéraire", mapTitle: "Carte Flori's Home", skyPin: "Orio al Serio · 4 km",
  },
  act: {
    "kicker": "À découvrir",
    "title1": "Que faire",
    "title2": "près de la maison",
    "sub": "Les expériences que nous conseillons à nos hôtes, toutes réservables en ligne. Temps indiqués en voiture depuis la maison.",
    "cats": {
      "all": "Toutes",
      "culture": "Culture",
      "nature": "Lacs et nature",
      "family": "Familles",
      "relax": "Détente",
      "food": "Gastronomie",
      "sport": "Sport",
      "shop": "Shopping"
    },
    "cta": {
      "book": "Réserver",
      "tickets": "Billets",
      "info": "Découvrir"
    },
    "from": "dès",
    "askT": "Vous hésitez ?",
    "askS": "Écrivez-nous sur WhatsApp : on vous conseille le bon endroit et les restaurants où nous mangeons nous-mêmes.",
    "askCta": "Nous demander",
    "waText": "Bonjour ! Je viens bientôt à Flori's Home : que me conseillez-vous de faire dans le coin ?",
    "note": "Les liens mènent aux sites officiels ou partenaires : prix et disponibilités sont gérés par eux.",
    "items": {
      "alta": {
        "title": "La Ville Haute avec guide officiel",
        "desc": "Remparts vénitiens classés UNESCO, Piazza Vecchia et chapelle Colleoni lors d'une visite à pied de 2 h. Dimanches et jours fériés à 10h30 (en italien).",
        "where": "Torre del Gombito"
      },
      "funi": {
        "title": "Funiculaires de la Ville Haute et San Vigilio",
        "desc": "Montez jusqu'au bourg médiéval, puis encore plus haut jusqu'au château de San Vigilio : coucher de soleil sur la plaine.",
        "where": "Viale Vittorio Emanuele"
      },
      "carrara": {
        "title": "Accademia Carrara",
        "desc": "L'une des plus belles pinacothèques d'Italie : Raphaël, Botticelli, Mantegna, Bellini, et des expositions toute l'année.",
        "where": "Piazza Carrara"
      },
      "donizetti": {
        "title": "Théâtre Donizetti",
        "desc": "Opéra, théâtre, concerts et le Donizetti Opera Festival dans le théâtre historique de la Ville Basse.",
        "where": "Ville Basse"
      },
      "atalanta": {
        "title": "L'Atalanta au Gewiss Stadium",
        "desc": "Vivez un match de l'Atalanta dans l'un des stades les plus chauds d'Italie, à quelques minutes de la maison.",
        "where": "Gewiss Stadium"
      },
      "cooking": {
        "title": "Cours de cuisine bergamasque",
        "desc": "Casoncelli, polenta taragna et scarpinocc : cuisinez chez une Cesarina, puis on mange ensemble.",
        "where": "Bergame et alentours"
      },
      "leolandia": {
        "title": "Leolandia",
        "desc": "Le parc d'attractions préféré des enfants : manèges, spectacles et personnages de dessins animés.",
        "where": "Capriate San Gervasio"
      },
      "crespi": {
        "title": "Village de Crespi d'Adda",
        "desc": "Village ouvrier classé UNESCO, resté intact depuis la fin du XIXe siècle. Visites guidées et balades le long de l'Adda.",
        "where": "Capriate San Gervasio"
      },
      "terme": {
        "title": "QC Terme San Pellegrino",
        "desc": "Une journée de détente dans le Val Brembana : bassins thermaux, saunas et parcours bien-être dans un bâtiment Art nouveau.",
        "where": "San Pellegrino Terme"
      },
      "iseo": {
        "title": "Lac d'Iseo et Monte Isola",
        "desc": "En bateau vers Monte Isola, la plus grande île lacustre d'Europe : villages de pêcheurs, vélo et poisson du lac.",
        "where": "Sarnico · Iseo"
      },
      "como": {
        "title": "Lac de Côme",
        "desc": "De Lecco en bateau vers Bellagio et Varenna : villas, jardins et les plus beaux panoramas du lac.",
        "where": "Depuis Lecco"
      },
      "orio": {
        "title": "Orio Center",
        "desc": "L'un des plus grands centres commerciaux d'Italie, à côté de l'aéroport : boutiques, restaurants et cinéma.",
        "where": "Orio al Serio"
      }
    }
  },
  book: {
    kicker: "Réservez en direct", title1: "Choisissez vos dates,", title2: "le reste est simple",
    sub: "Prix et disponibilités mis à jour en temps réel. Aucun frais, aucun paiement en ligne.",
    steps: ["Dates", "Vos informations", "Envoyée"],
    closedT: "Réservations momentanément fermées", closedS: "Écrivez-nous quand même : nous vous préviendrons dès la réouverture.",
    legend: ["Sélectionnées", "Occupées", "Prix spécial"],
    tfTitle: "Transfert depuis l'aéroport", tfSub: "Nous venons vous chercher à Orio al Serio et vous conduisons au logement",
    tfTime: "Heure d'atterrissage", tfFlight: "Numéro de vol", tfFlightPh: "ex. FR1234", tfNote: "Facultatif : vous pouvez aussi nous les envoyer plus tard sur WhatsApp.",
    formTitle: "Qui vient séjourner ?", formSub: "Nous vous écrirons sur WhatsApp et par e-mail pour confirmer la disponibilité.",
    contacts: "Coordonnées", email: "E-mail", phone: "Numéro WhatsApp", mainGuest: "Voyageur principal", asOnDoc: "comme sur la pièce d'identité",
    firstName: "Prénom", lastName: "Nom", sex: "Sexe", birth: "Date de naissance", years: "ans",
    birthPlace: "Lieu de naissance", cityPh: "Ville", birthCountry: "Pays de naissance", nationality: "Nationalité",
    minor: "Le voyageur principal doit être majeur.", doc: "Pièce d'identité",
    docTypes: { "Carta d'identità": "Carte d'identité", Passaporto: "Passeport", "Patente di guida": "Permis de conduire" },
    docNumber: "Numéro du document", passportNumber: "Numéro de passeport", issuedBy: "Délivré par", issuedByPh: "Autorité ou pays",
    others: "Autres voyageurs", othersNote: "vous pouvez aussi compléter à l'arrivée", guestN: (c) => `Voyageur ${c}`,
    notes: "Remarques (facultatif)", notesPh: "Heure d'arrivée, demandes particulières…", pet: "Je voyage avec un animal",
    law: "Selon la loi italienne (art. 109 TULPS), nous transmettons les données des voyageurs à la police via le portail Alloggiati Web. Nous les utilisons uniquement pour cela et pour gérer votre séjour : elles ne sont jamais partagées.",
    consent: "J'accepte le traitement de mes données et de celles des autres voyageurs pour la gestion de la réservation et les obligations légales.",
    back: "Modifier les dates", almost: "Presque fini !", sent: "Demande envoyée !",
    waDone1: "WhatsApp s'est ouvert avec le message déjà rédigé :", waDone2: "appuyez sur envoyer", waDone3: "et nous recevrons votre demande.", waNotOpen: "WhatsApp ne s'est pas ouvert ?",
    apiDone: (name) => `Merci ${name} ! Nous vous avons écrit sur WhatsApp. Dès notre confirmation, vos dates sont bloquées et vous recevrez un e-mail et une invitation d'agenda avec tous les détails.`,
    code: "code", newReq: "Nouvelle demande", perNight: "/ nuit", updating: "mise à jour", updated: "à jour",
    status: {
      ok: "Disponible ! Vos informations maintenant", unavailable: "Certaines nuits sont déjà réservées", closed: "Nous ne prenons pas de réservations pour le moment",
      past: "Ces dates sont passées", min: (c) => `Séjour minimum ${c} nuits`, pickDeparture: "Choisissez maintenant le jour du départ", pickArrival: "Choisissez le jour d'arrivée dans le calendrier",
    },
    nightsN: (c) => n(c, "nuit", "nuits"), season: "saison", weekend: "week-end", cleaning: "Ménage final", transferLine: "Transfert depuis Orio al Serio",
    total: "Total", cont: "Continuer", send: "Envoyer la demande", sendWa: "Envoyer sur WhatsApp", sending: "Envoi…",
    fine: (dep) => `Aucun paiement maintenant · caution de ${dep} en espèces, rendue au départ`, less: "Moins", more: "Plus",
  },
  faq: {
    kicker: "Bon à savoir", title1: "Questions", title2: "fréquentes", facts: ["Arrivée", "Départ", "Minimum", "Caution"],
    minN: (c) => n(c, "nuit", "nuits"), rules: "Non-fumeur · pas de fêtes · animaux acceptés, prévenez-nous",
    items: [
      { q: "À quelle distance se trouve l'aéroport d'Orio al Serio ?", a: "Environ 4 km : quelques minutes en voiture ou en taxi. Idéal pour les vols tôt le matin ou tard le soir." },
      { q: "Comment rejoindre la Ville Haute ?", a: "Environ 15 minutes en voiture, ou en transports jusqu'au centre puis le funiculaire." },
      { q: "Le parking est-il inclus ?", a: "Oui, il est gratuit pour les voyageurs." },
      { q: "Puis-je venir avec mon chien ?", a: "Bien sûr, Flori's Home accepte les animaux. Prévenez-nous lors de la demande." },
      { q: "Convient-il au télétravail ?", a: "Oui : Wi-Fi gratuit, bureau et pièces calmes." },
    ],
  },
  foot: {
    hint: "passez la souris ici ✨", title1: "On vous attend", title2: "à Bergame", sub: "Choisissez vos dates : nous confirmons la disponibilité en quelques minutes.",
    cta: "Vérifier la disponibilité", contacts: "Contact", explore: "Explorer", copy: "Appartement de vacances", photos: "Photos de la ville : Unsplash",
  },
  mbar: { perNight: "/ nuit", superb: "Exceptionnel", cta: "Choisir les dates" },
  cal: { wd: ["L", "M", "M", "J", "V", "S", "D"], unavailable: "Indisponible", perNight: "/ nuit", prev: "Mois précédent", next: "Mois suivant" },
};
