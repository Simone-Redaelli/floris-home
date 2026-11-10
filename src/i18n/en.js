const n = (c, one, many) => `${c} ${c === 1 ? one : many}`;

export default {
  nav: { links: ["The home", "Tour", "Amenities", "Reviews", "Bergamo", "Things to do"], book: "Book", menu: "Menu", close: "Close", lang: "Language" },
  door: {
    eyebrow: "Via San Pio X, 16 · Bergamo", title1: "Welcome", title2: "home", mat: "Welcome",
    bell: "Ring the bell", scroll: "or scroll to step inside", bellAria: "Ring the bell and open the door",
    skip: "Skip", photoAlt: "The living room at Flori's Home", cursor: "Ring",
  },
  hero: {
    open: "Now taking bookings", closed: "Bookings closed", from: "from", perNight: "per night",
    title1: "Your home in Bergamo,", title2: "perfect for",
    rotate: ["families", "remote workers", "flying from Orio", "a weekend for two", "dog lovers"],
    sub: "80 m² freshly renovated, two bedrooms, a balcony over the garden and free parking.",
    arrival: "Check-in", departure: "Check-out", guests: "Guests", addDate: "Add date",
    guestsN: (c) => n(c, "guest", "guests"), check: "Search", book: "Book",
    pickArrival: "Choose check-in", pickDeparture: "Choose check-out", nightsN: (c) => n(c, "night", "nights"),
    clear: "Clear", max: (c) => `Up to ${c}`, superb: "Superb", airport: "4 km from Orio al Serio",
    renovated: "Freshly renovated", sticker: "BOOK DIRECT • NO BOOKING FEES • ", stickerSmall: "fees",
  },
  trust: ["9.1 Superb on Booking", "Free parking", "4 km from Orio al Serio", "Pets welcome", "Air conditioning", "Freshly renovated", "Fast Wi-Fi", "Flexible check-in"],
  casa: {
    kicker: "The home", title1: "Flip through the home", title2: "like an album",
    sub: "The whole apartment is yours: 80 m², two bedrooms, kitchen, bathroom with tub and a balcony over the garden.",
    hintTouch: "Tap a photo to enlarge it", hintDrag: "Drag the photos, click to enlarge",
    caps: ["the living room ☀️", "double bedroom", "full kitchen", "bathtub 🛁", "the balcony 🌿", "twin bedroom", "the view"],
    rooms: "bedrooms", guests: "guests", scribble: "freshly renovated! ✨",
  },
  tour: {
    kicker: "The tour", scroll: "Scroll to step inside", go: "Go",
    rooms: [
      { kicker: "Come in", title: "Entrance", text: "The door opens onto a bright hallway. Free parking is just steps away.", tags: ["Free parking", "Self check-in"] },
      { kicker: "The heart of the home", title: "Living room", text: "Spacious and full of light, with a sofa bed, smart TV with streaming and a dining table for the whole family.", tags: ["Sofa bed", "Smart TV", "Air conditioning"] },
      { kicker: "Just like home", title: "Kitchen", text: "Fully equipped: hob, oven, microwave, fridge, kettle and coffee machine.", tags: ["Oven", "Microwave", "Coffee"] },
      { kicker: "Rest", title: "Double room", text: "Double bed, roomy wardrobe and light curtains. Bed linen and towels always included.", tags: ["Double bed", "Linen included"] },
      { kicker: "For everyone", title: "Twin room", text: "Two single beds, perfect for kids, friends or colleagues on a business trip.", tags: ["2 single beds", "Wardrobe"] },
      { kicker: "Relax", title: "Bathroom", text: "Bathtub, bidet, hairdryer and a washing machine for you to use.", tags: ["Bathtub", "Washing machine", "Hairdryer"] },
      { kicker: "Outdoors", title: "Balcony", text: "The perfect spot for morning coffee or a sunset aperitivo, overlooking the garden.", tags: ["Garden view", "Private outdoor space"] },
    ],
  },
  gallery: ["Living room", "Double bedroom", "Lounge area", "Kitchenette", "Twin bedroom", "Open space", "Bathtub", "The view", "Dining", "Relax"],
  lightbox: { close: "Close", prev: "Previous", next: "Next" },
  stack: {
    kicker: "Perfect for", title1: "One home,", title2: "many trips",
    items: [
      { title: "Families", text: "Two bedrooms, a sofa bed and a full kitchen: room for everyone, up to 5 guests.", tag: "Up to 5 guests" },
      { title: "Remote work", text: "Fast Wi-Fi, a desk and peace and quiet. For business trips or longer stays.", tag: "Free Wi-Fi" },
      { title: "Flying from Orio", text: "The airport is 4 km away: arrive late at night or leave at dawn, stress-free.", tag: "4 km from the airport" },
      { title: "With your dog", text: "Four-legged friends are welcome, and there's a balcony over the garden.", tag: "Pet friendly" },
    ],
  },
  amen: {
    kicker: "Amenities", title1: "All included,", title2: "no worries",
    sub: "Arrive, drop your bags and you're home. Linen, towels and cleaning are all taken care of.", photoAlt: "Living room",
    items: [
      { label: "Free Wi-Fi", text: "Fast, throughout the home" }, { label: "Parking", text: "Free, right outside" },
      { label: "Air conditioning", text: "Throughout the apartment" }, { label: "Pet friendly", text: "Pets are welcome" },
      { label: "Smart TV", text: "With streaming services" }, { label: "Full kitchen", text: "Oven, microwave, coffee" },
      { label: "Washing machine", text: "For longer stays" }, { label: "Remote work", text: "Dedicated desk" },
    ],
  },
  rev: {
    kicker: "Reviews", superb: "Superb", avg: (c) => `Average of ${c} verified reviews from real guests on Booking.com`,
    read: "Read the reviews", k2: "What guests say", t1: "Cleanliness and comfort", t2: "rated 9.7",
    scores: ["Cleanliness", "Comfort", "Facilities", "Staff", "Value for money", "Location"], sticker: "HAPPY GUESTS • REAL REVIEWS • ",
  },
  berg: {
    kicker: "Location", title1: "Bergamo", title2: "within reach",
    sub: "A quiet residential area. Within minutes you're at the airport, the Fair or the city centre; in a quarter of an hour, on the walls of the Upper Town.",
    places: ["Orio al Serio Airport", "Bergamo Fair", "Accademia Carrara", "Teatro Donizetti", "Gewiss Stadium", "Upper Town (Città Alta)"],
    alta: "Upper Town", porta: "Porta San Giacomo", directions: "Directions", mapTitle: "Flori's Home map", skyPin: "Orio al Serio · 4 km",
  },
  act: {
    zoomCity: "Bergamo", zoomAll: "Surroundings",
    view: "View", viewCards: "Cards", viewMap: "Map", home: "Flori's Home · your home",
    "kicker": "Discover",
    "title1": "Things to do",
    "title2": "near the house",
    "sub": "The experiences we recommend to our guests, all bookable online. Times are by car from the house.",
    "cats": {
      "all": "All",
      "culture": "Culture",
      "nature": "Lakes & nature",
      "family": "Families",
      "relax": "Relax",
      "food": "Food",
      "sport": "Sport",
      "shop": "Shopping"
    },
    "cta": {
      "book": "Book",
      "tickets": "Tickets",
      "info": "Discover"
    },
    "from": "from",
    "askT": "Not sure what to pick?",
    "askS": "Message us on WhatsApp: we'll suggest the right place and the restaurants where we eat ourselves.",
    "askCta": "Ask us",
    "waText": "Hi! I'm coming to Flori's Home soon: what do you recommend doing nearby?",
    "note": "Links lead to official websites or partners: prices and availability are managed by them.",
    "items": {
      "alta": {
        "title": "Upper Town with an official guide",
        "desc": "UNESCO Venetian walls, Piazza Vecchia and the Colleoni Chapel on a 2-hour walking tour. Sundays and holidays at 10:30 (in Italian).",
        "where": "Torre del Gombito"
      },
      "funi": {
        "title": "Upper Town & San Vigilio funiculars",
        "desc": "Ride up to the medieval town, then even higher to San Vigilio castle: sunset views over the plain.",
        "where": "Viale Vittorio Emanuele"
      },
      "carrara": {
        "title": "Accademia Carrara",
        "desc": "One of Italy's finest art galleries: Raphael, Botticelli, Mantegna, Bellini, plus exhibitions all year round.",
        "where": "Piazza Carrara"
      },
      "donizetti": {
        "title": "Donizetti Theatre",
        "desc": "Opera, drama, concerts and the Donizetti Opera Festival in the historic theatre of the Lower Town.",
        "where": "Lower Town"
      },
      "atalanta": {
        "title": "Atalanta at the Gewiss Stadium",
        "desc": "Watch Atalanta play in one of Italy's liveliest stadiums, just minutes from the house.",
        "where": "Gewiss Stadium"
      },
      "cooking": {
        "title": "Bergamo cooking class",
        "desc": "Casoncelli, polenta taragna and scarpinocc: cook with a local Cesarina in her home, then sit down and eat together.",
        "where": "Bergamo area"
      },
      "leolandia": {
        "title": "Leolandia",
        "desc": "Kids' favourite theme park: rides, shows and their favourite cartoon characters.",
        "where": "Capriate San Gervasio"
      },
      "crespi": {
        "title": "Crespi d'Adda village",
        "desc": "A UNESCO-listed company town, unchanged since the late 1800s. Guided tours and walks along the Adda river.",
        "where": "Capriate San Gervasio"
      },
      "terme": {
        "title": "QC Terme San Pellegrino",
        "desc": "A day of relaxation in Val Brembana: thermal pools, saunas and a wellness circuit in an Art Nouveau building.",
        "where": "San Pellegrino Terme"
      },
      "iseo": {
        "title": "Lake Iseo & Monte Isola",
        "desc": "Take the boat to Monte Isola, Europe's largest lake island: fishing villages, bikes and lake fish.",
        "where": "Sarnico · Iseo"
      },
      "como": {
        "title": "Lake Como",
        "desc": "From Lecco by boat to Bellagio and Varenna: villas, gardens and the lake's most famous views.",
        "where": "From Lecco"
      },
      "orio": {
        "title": "Orio Center",
        "desc": "One of Italy's largest shopping malls, next to the airport: shops, restaurants and a cinema.",
        "where": "Orio al Serio"
      }
    }
  },
  book: {
    perPerson: "per person", free: "Free",
    exTitle: "Extras", exSub: "Add them now and we'll have everything ready when you arrive.",
    ex: {
      crib: { t: "Baby cot", s: "For the little ones, bedding included" },
      highchair: { t: "High chair", s: "For mealtimes in the kitchen" },
      earlyIn: { t: "Early check-in", s: "From 12:00, subject to confirmation" },
      lateOut: { t: "Late check-out", s: "Until 13:00, subject to confirmation" },
      breakfast: { t: "Breakfast kit", s: "Coffee, milk, biscuits and juice on arrival" },
    },
    tax: "City tax",
    taxNote: (r, c, n) => `${r}% per night per adult, max ${c}${Number(n) ? `, first ${n} nights` : ""}`,
    taxPay: (x) => `The total includes ${x} of municipal city tax, payable on arrival. Under-18s are exempt.`,
    kicker: "Book direct", title1: "Pick your dates,", title2: "the rest is easy",
    sub: "Prices and availability updated in real time. No booking fees, no online payment.",
    steps: ["Dates", "Your details", "Sent"],
    closedT: "Bookings temporarily closed", closedS: "Write to us anyway: we'll let you know as soon as we reopen.",
    legend: ["Selected", "Booked", "Special price"],
    tfTitle: "Airport transfer", tfSub: "We'll pick you up at Orio al Serio and drive you home",
    tfTime: "Landing time", tfFlight: "Flight number", tfFlightPh: "e.g. FR1234", tfNote: "Optional: you can also send them later on WhatsApp.",
    formTitle: "Who's coming to stay?", formSub: "We'll message you on WhatsApp and email to confirm availability.",
    contacts: "Contact", email: "Email", phone: "WhatsApp number", mainGuest: "Main guest", asOnDoc: "as on your ID",
    firstName: "First name", lastName: "Last name", sex: "Sex", birth: "Date of birth", years: "years",
    birthPlace: "Place of birth", cityPh: "City", birthCountry: "Country of birth", nationality: "Nationality",
    minor: "The main guest must be 18 or over.", doc: "Identity document",
    docTypes: { "Carta d'identità": "ID card", Passaporto: "Passport", "Patente di guida": "Driving licence" },
    docNumber: "Document number", passportNumber: "Passport number", issuedBy: "Issued by", issuedByPh: "Authority or country",
    others: "Other guests", othersNote: "you can also complete this on arrival", guestN: (c) => `Guest ${c}`,
    notes: "Notes (optional)", notesPh: "Arrival time, special requests…", pet: "Travelling with a pet",
    law: "By Italian law (art. 109 TULPS) we report guest details to the police through the Alloggiati Web portal. We only use them for this and to manage your stay: they are never shared with anyone else.",
    consent: "I consent to the processing of my data and that of the other guests to manage the booking and meet legal obligations.",
    back: "Change dates", almost: "Almost there!", sent: "Request sent!",
    waDone1: "WhatsApp has opened with your message ready:", waDone2: "tap send", waDone3: "and we'll receive your request.", waNotOpen: "WhatsApp didn't open?",
    apiDone: (name) => `Thank you ${name}! We've messaged you on WhatsApp. Once we confirm, your dates are locked in and you'll receive an email and calendar invite with all the details.`,
    code: "code", newReq: "New request", perNight: "/ night", updating: "updating", updated: "up to date",
    status: {
      ok: "Available! Now your details", unavailable: "Some nights are already booked", closed: "We're not taking bookings at the moment",
      past: "These dates are in the past", min: (c) => `Minimum stay ${c} nights`, pickDeparture: "Now pick your check-out day", pickArrival: "Pick your check-in day on the calendar",
    },
    nightsN: (c) => n(c, "night", "nights"), season: "season", weekend: "weekend", cleaning: "Final cleaning", transferLine: "Transfer from Orio al Serio",
    total: "Total", cont: "Continue", send: "Send request", sendWa: "Send on WhatsApp", sending: "Sending…",
    fine: (dep) => `No payment now · ${dep} cash deposit, refunded at check-out`, less: "Less", more: "More",
  },
  faq: {
    kicker: "Good to know", title1: "Frequently asked", title2: "questions", facts: ["Check-in", "Check-out", "Minimum", "Deposit"],
    minN: (c) => n(c, "night", "nights"), rules: "No smoking indoors · no parties · pets welcome, just let us know",
    items: [
      { q: "How far is Orio al Serio airport?", a: "About 4 km: a few minutes by car or taxi. Ideal for early morning or late evening flights." },
      { q: "How do I get to the Upper Town?", a: "About 15 minutes by car, or by public transport to the centre and then the funicular." },
      { q: "Is parking included?", a: "Yes, it's free for guests." },
      { q: "Can I bring my dog?", a: "Of course, Flori's Home is pet friendly. Just let us know when you send your request." },
      { q: "Is it good for remote work?", a: "Yes: free Wi-Fi, a desk and quiet rooms." },
    ],
  },
  foot: {
    guide: "Guest guide",
    hint: "move your mouse here ✨", title1: "See you", title2: "in Bergamo", sub: "Pick your dates: we'll confirm availability within minutes.",
    cta: "Check availability", contacts: "Contact", explore: "Explore", copy: "Holiday apartment", photos: "City photos: Unsplash",
  },
  guide: {
    title: "House guide", welcome1: "Welcome", welcome2: "home",
    hello: (n) => `Hi ${n},`, helloEm: "welcome!",
    sub: "Everything you need during your stay, all in one place.",
    stay: (a, b) => `We're expecting you from ${a} to ${b}. Here's everything you need.`,
    checkIn: "Check-in", checkOut: "Check-out",
    codeTitle: "Got your stay code?", codeSub: "You'll find it in your confirmation message on WhatsApp or by email.",
    open: "Open the guide", checking: "Checking…", bad: "Invalid or expired code: double-check it or message us on WhatsApp.", logout: "Log out",
    locked: "Visible with your stay code",
    wifi: "Wi-Fi", network: "Network", password: "Password", copy: "Copy", copied: "Copied!", askHost: "Ask us for the password on WhatsApp.",
    entry: "How to get in", entryEmpty: "We'll send you the entry instructions on WhatsApp before you arrive.",
    times: "Arrival & departure", timesTxt: (ci, co) => `Check-in ${ci}, check-out ${co}.`, timesLate: "Arriving outside these hours? Message us and we'll sort it out.",
    parking: "Parking", parkingDefault: "Parking is free.",
    rules: "House rules",
    rulesList: (ci, co, dep) => [`Check-in ${ci}, check-out ${co}.`, "No parties or events.", "Pets welcome: just let us know before you arrive.", `${dep} security deposit in cash, returned at check-out.`],
    waste: "Recycling", wasteSub: "Bergamo has door-to-door collection: please sort your waste like this.",
    wasteItems: [["Organic", "in compostable bags"], ["Paper & cardboard", "flattened, in boxes or paper bags"], ["Plastic", "in the yellow bag"], ["Glass & metal", "together, cans included, no bag"], ["General waste", "in the clear bag"]],
    wasteDays: "Collection days",
    checkout: "Before you leave", checkoutList: ["Switch off lights, heating and air conditioning", "Close the windows and the balcony door", "Put the rubbish in the right bins", "Leave the keys as we explained"],
    numbers: "Useful numbers", host: "Us, on WhatsApp", n112: "Emergencies: police, ambulance, fire brigade", n116: "Out-of-hours doctor (nights & holidays)", taxi: "Radio Taxi Bergamo",
    notes: "Notes from your host", around: "Things to do nearby", aroundSub: "Upper Town, lakes, spas and our favourite experiences, bookable online.", aroundCta: "Discover activities",
    enjoy: "Enjoy your stay in Bergamo!", back: "Back to the website",
  },
  mbar: { perNight: "/ night", superb: "Superb", cta: "Pick dates" },
  cal: { wd: ["M", "T", "W", "T", "F", "S", "S"], unavailable: "Not available", perNight: "/ night", prev: "Previous month", next: "Next month" },
};
