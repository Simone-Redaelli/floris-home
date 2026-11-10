const n = (c, one, many) => `${c} ${c === 1 ? one : many}`;

export default {
  nav: { links: ["La casa", "Recorrido", "Servicios", "Opiniones", "Bérgamo", "Actividades"], book: "Reservar", menu: "Menú", close: "Cerrar", lang: "Idioma" },
  door: {
    eyebrow: "Via San Pio X, 16 · Bérgamo", title1: "Bienvenidos a", title2: "casa", mat: "Bienvenidos",
    bell: "Toca el timbre", scroll: "o desplázate para entrar", bellAria: "Tocar el timbre y abrir la puerta",
    skip: "Saltar", photoAlt: "El salón de Flori's Home", cursor: "Tocar",
  },
  hero: {
    open: "Reservas abiertas", closed: "Reservas cerradas", from: "desde", perNight: "por noche",
    title1: "Tu casa en Bérgamo,", title2: "perfecta para",
    rotate: ["familias", "teletrabajar", "volar desde Orio", "un fin de semana en pareja", "viajar con tu perro"],
    sub: "80 m² recién reformados, dos dormitorios, balcón al jardín y aparcamiento gratuito cerca.",
    arrival: "Llegada", departure: "Salida", guests: "Huéspedes", addDate: "Añadir fecha",
    guestsN: (c) => n(c, "huésped", "huéspedes"), check: "Comprobar", book: "Reservar",
    pickArrival: "Elige la llegada", pickDeparture: "Elige la salida", nightsN: (c) => n(c, "noche", "noches"),
    clear: "Borrar", max: (c) => `Máximo ${c}`, superb: "Fantástico", airport: "A 4 km de Orio al Serio",
    renovated: "Recién reformado", sticker: "RESERVA DIRECTA • SIN COMISIONES • ", stickerSmall: "comisiones",
  },
  trust: ["9,1 Fantástico en Booking", "Aparcamiento gratuito cerca", "A 4 km de Orio al Serio", "Se admiten mascotas", "Aire acondicionado bajo petición", "Recién reformado", "Wi-Fi rápido", "Llegada flexible"],
  casa: {
    kicker: "La casa", title1: "Hojea la casa", title2: "como un álbum",
    sub: "Todo el apartamento es tuyo: 80 m², dos dormitorios, cocina, baño con bañera y un balcón al jardín.",
    hintTouch: "Toca una foto para ampliarla", hintDrag: "Arrastra las fotos, haz clic para ampliarlas",
    caps: ["el salón ☀️", "habitación doble", "cocina completa", "bañera 🛁", "el balcón 🌿", "habitación con dos camas", "las vistas"],
    rooms: "dormitorios", guests: "huéspedes", scribble: "¡recién reformado! ✨",
  },
  tour: {
    kicker: "El recorrido", scroll: "Desplázate para entrar", go: "Ir",
    rooms: [
      { kicker: "Adelante", title: "Entrada", text: "La puerta se abre a un pasillo luminoso. El aparcamiento gratuito está a dos pasos.", tags: ["Aparcamiento gratuito cerca", "Llegada autónoma"] },
      { kicker: "El corazón de la casa", title: "Salón", text: "Amplio y luminoso, con sofá cama, smart TV con streaming y mesa de comedor para toda la familia.", tags: ["Sofá cama", "Smart TV", "Aire acondicionado"] },
      { kicker: "Como en casa", title: "Cocina", text: "Totalmente equipada: placa, horno, microondas, nevera, hervidor y cafetera.", tags: ["Horno", "Microondas", "Café"] },
      { kicker: "Descanso", title: "Habitación doble", text: "Cama doble, armario amplio y cortinas ligeras. Ropa de cama y toallas siempre incluidas.", tags: ["Cama doble", "Ropa de cama incluida"] },
      { kicker: "Para todos", title: "Habitación con dos camas", text: "Dos camas individuales, perfectas para niños, amigos o compañeros en viaje de trabajo.", tags: ["2 camas individuales", "Armario"] },
      { kicker: "Relax", title: "Baño", text: "Bañera, bidé, secador de pelo y lavadora a tu disposición.", tags: ["Bañera", "Lavadora", "Secador"] },
      { kicker: "Al aire libre", title: "Balcón", text: "El lugar ideal para el café de la mañana o un aperitivo al atardecer, con vistas al jardín.", tags: ["Vistas al jardín", "Exterior privado"] },
    ],
  },
  gallery: ["Salón", "Habitación doble", "Zona de estar", "Rincón de cocina", "Habitación con dos camas", "Espacio abierto", "Bañera", "Las vistas", "Comedor", "Relax"],
  lightbox: { close: "Cerrar", prev: "Anterior", next: "Siguiente" },
  stack: {
    kicker: "Perfecta para", title1: "Una casa,", title2: "muchos viajes",
    items: [
      { title: "Familias", text: "Dos dormitorios, sofá cama y cocina completa: hay sitio para todos, hasta 5 huéspedes.", tag: "Hasta 5 huéspedes" },
      { title: "Teletrabajo", text: "Wi-Fi rápido, escritorio y tranquilidad. Para viajes de trabajo o estancias largas.", tag: "Wi-Fi gratis" },
      { title: "Vuelos desde Orio", text: "El aeropuerto está a 4 km: llega tarde por la noche o sal al amanecer sin estrés.", tag: "A 4 km del aeropuerto" },
      { title: "Con tu perro", text: "Los amigos de cuatro patas son bienvenidos, y hay un balcón al jardín.", tag: "Se admiten mascotas" },
    ],
  },
  amen: {
    kicker: "Servicios", title1: "Todo incluido,", title2: "sin preocupaciones",
    sub: "Llegas, dejas las maletas y ya estás en casa. Ropa de cama, toallas y limpieza ya están pensadas.", photoAlt: "Salón",
    items: [
      { label: "Wi-Fi gratis", text: "Rápido, en toda la casa" }, { label: "Aparcamiento", text: "Gratuito, cerca de casa" },
      { label: "Aire acondicionado", text: "Bajo petición, 10 € al día" }, { label: "Mascotas", text: "Los animales son bienvenidos" },
      { label: "Smart TV", text: "Con servicios de streaming" }, { label: "Cocina completa", text: "Horno, microondas, café" },
      { label: "Lavadora", text: "Para estancias largas" }, { label: "Teletrabajo", text: "Escritorio propio" },
    ],
  },
  rev: {
    kicker: "Opiniones", superb: "Fantástico", avg: (c) => `Media de ${c} opiniones verificadas de huéspedes reales en Booking.com`,
    read: "Leer las opiniones", k2: "Lo que dicen los huéspedes", t1: "Limpieza y confort", t2: "con un 9,7",
    scores: ["Limpieza", "Confort", "Instalaciones", "Personal", "Calidad / precio", "Ubicación"], sticker: "HUÉSPEDES FELICES • OPINIONES REALES • ",
  },
  berg: {
    kicker: "Ubicación", title1: "Bérgamo", title2: "a tu alcance",
    sub: "Zona residencial y tranquila. En pocos minutos estás en el aeropuerto, en la Feria o en el centro; en un cuarto de hora, en las murallas de la Ciudad Alta.",
    places: ["Aeropuerto de Orio al Serio", "Feria de Bérgamo", "Accademia Carrara", "Teatro Donizetti", "Gewiss Stadium", "Ciudad Alta (Città Alta)"],
    alta: "Ciudad Alta", porta: "Porta San Giacomo", directions: "Cómo llegar", mapTitle: "Mapa de Flori's Home", skyPin: "Orio al Serio · 4 km",
  },
  act: {
    zoomCity: "Bérgamo", zoomAll: "Alrededores",
    view: "Vista", viewCards: "Fichas", viewMap: "Mapa", home: "Flori's Home · tu casa",
    "kicker": "Por descubrir",
    "title1": "Qué hacer",
    "title2": "cerca de casa",
    "sub": "Las experiencias que recomendamos a nuestros huéspedes, todas reservables online. Tiempos en coche desde la casa.",
    "cats": {
      "all": "Todas",
      "culture": "Cultura",
      "nature": "Lagos y naturaleza",
      "family": "Familias",
      "relax": "Relax",
      "food": "Gastronomía",
      "sport": "Deporte",
      "shop": "Compras"
    },
    "cta": {
      "book": "Reservar",
      "tickets": "Entradas",
      "info": "Descubrir"
    },
    "from": "desde",
    "askT": "¿No sabes qué elegir?",
    "askS": "Escríbenos por WhatsApp: te recomendamos el sitio ideal y los restaurantes donde comemos nosotros.",
    "askCta": "Pregúntanos",
    "waText": "¡Hola! Voy a ir pronto a Flori's Home: ¿qué me recomendáis hacer por la zona?",
    "note": "Los enlaces llevan a webs oficiales o socios: precios y disponibilidad los gestionan ellos.",
    "items": {
      "alta": {
        "title": "Ciudad Alta con guía oficial",
        "desc": "Murallas venecianas Patrimonio UNESCO, Piazza Vecchia y la Capilla Colleoni en un tour a pie de 2 horas. Domingos y festivos a las 10:30 (en italiano).",
        "where": "Torre del Gombito"
      },
      "funi": {
        "title": "Funiculares de Ciudad Alta y San Vigilio",
        "desc": "Sube en funicular al casco medieval y luego aún más arriba, al castillo de San Vigilio: atardecer con vistas a la llanura.",
        "where": "Viale Vittorio Emanuele"
      },
      "carrara": {
        "title": "Accademia Carrara",
        "desc": "Una de las pinacotecas más bellas de Italia: Rafael, Botticelli, Mantegna, Bellini y exposiciones todo el año.",
        "where": "Piazza Carrara"
      },
      "donizetti": {
        "title": "Teatro Donizetti",
        "desc": "Ópera, teatro, conciertos y el Donizetti Opera Festival en el histórico teatro de la Ciudad Baja.",
        "where": "Ciudad Baja"
      },
      "atalanta": {
        "title": "El Atalanta en el Gewiss Stadium",
        "desc": "Vive un partido del Atalanta en uno de los estadios con más ambiente de Italia, a pocos minutos de casa.",
        "where": "Gewiss Stadium"
      },
      "cooking": {
        "title": "Clase de cocina bergamasca",
        "desc": "Casoncelli, polenta taragna y scarpinocc: cocina con una Cesarina en su casa y luego coméis juntos.",
        "where": "Bérgamo y alrededores"
      },
      "leolandia": {
        "title": "Leolandia",
        "desc": "El parque de atracciones favorito de los niños: atracciones, espectáculos y personajes de dibujos animados.",
        "where": "Capriate San Gervasio"
      },
      "crespi": {
        "title": "Villa obrera de Crespi d'Adda",
        "desc": "Pueblo obrero Patrimonio UNESCO, intacto desde finales del siglo XIX. Visitas guiadas y paseos junto al río Adda.",
        "where": "Capriate San Gervasio"
      },
      "terme": {
        "title": "QC Terme San Pellegrino",
        "desc": "Un día de relax en Val Brembana: piscinas termales, saunas y circuito de bienestar en un edificio modernista.",
        "where": "San Pellegrino Terme"
      },
      "iseo": {
        "title": "Lago de Iseo y Monte Isola",
        "desc": "En barco a Monte Isola, la mayor isla lacustre de Europa: pueblos de pescadores, bici y pescado de lago.",
        "where": "Sarnico · Iseo"
      },
      "como": {
        "title": "Lago de Como",
        "desc": "Desde Lecco en barco hacia Bellagio y Varenna: villas, jardines y las vistas más famosas del lago.",
        "where": "Desde Lecco"
      },
      "orio": {
        "title": "Orio Center",
        "desc": "Uno de los centros comerciales más grandes de Italia, junto al aeropuerto: tiendas, restaurantes y cine.",
        "where": "Orio al Serio"
      }
    }
  },
  book: {
    perPerson: "por persona", perNightEx: "al día", free: "Gratis",
    residence: "Ciudad de residencia", residencePh: "p. ej. Bérgamo",
    othersDue: (d) => `Si ahora no los tienes, envíanos los datos de los demás huéspedes antes del ${d}: por ley deben registrarse antes de la llegada, no en el check-in.`,
    extraGuest: (n, inc, p) => `Precio para ${n} huéspedes: precio base hasta ${inc}, +${p}% por noche por cada huésped adicional.`,
    cancelUntil: (d, n) => `Cancelación gratuita hasta el ${d} (${n} días antes de la llegada). Después ya no se puede cancelar.`,
    cancelNo: (n) => `Faltan menos de ${n} días para la llegada: esta reserva no se podrá cancelar.`,
    exTitle: "Servicios extra", exSub: "Añádelos ahora y lo tendremos todo listo a tu llegada. Se pagan en efectivo a la llegada.",
    ex: {
      cot: { t: "Cuna", s: "Cuna para los más pequeños, gratis" },
      highchair: { t: "Trona", s: "Para las comidas en la cocina, gratis" },
      earlyIn: { t: "Check-in anticipado", s: "Desde las 12:00, previa confirmación" },
      lateOut: { t: "Check-out tardío", s: "Hasta las 13:00, previa confirmación" },
      ac: { t: "Aire acondicionado", s: "Para toda la estancia" },
    },
    cashPay: (x, ex, tax) => `De los cuales ${x} se pagan en efectivo a la llegada: ${[ex && "servicios extra", tax && "tasa turística (menores exentos)"].filter(Boolean).join(" y ")}.`,
    tax: "Tasa turística",
    taxNote: (r, c, n) => `${r}% por noche y adulto, máx. ${c}${Number(n) ? `, primeras ${n} noches` : ""}`,
    taxPay: (x) => `El total incluye ${x} de tasa turística municipal, a pagar a la llegada. Los menores están exentos.`,
    kicker: "Reserva directa", title1: "Elige las fechas,", title2: "lo demás es fácil",
    sub: "Precios y disponibilidad actualizados en tiempo real. Sin comisiones ni pagos online.",
    steps: ["Fechas", "Tus datos", "Enviada"],
    closedT: "Reservas cerradas temporalmente", closedS: "Escríbenos igualmente: te avisaremos en cuanto reabramos.",
    legend: ["Seleccionadas", "Ocupadas", "Precio especial"],
    tfTitle: "Traslado desde el aeropuerto", tfSub: "Te recogemos en Orio al Serio y te llevamos a casa",
    tfTime: "Hora de aterrizaje", tfFlight: "Número de vuelo", tfFlightPh: "p. ej. FR1234", tfNote: "Opcionales: también puedes enviárnoslos después por WhatsApp.",
    formTitle: "¿Quién viene a visitarnos?", formSub: "Te escribiremos por WhatsApp y email para confirmar la disponibilidad.",
    contacts: "Contacto", email: "Email", phone: "Número de WhatsApp", mainGuest: "Huésped principal", asOnDoc: "como en el documento",
    firstName: "Nombre", lastName: "Apellidos", sex: "Sexo", birth: "Fecha de nacimiento", years: "años",
    birthPlace: "Lugar de nacimiento", cityPh: "Ciudad", birthCountry: "País de nacimiento", nationality: "Nacionalidad",
    minor: "El huésped principal debe ser mayor de edad.", doc: "Documento de identidad",
    docTypes: { "Carta d'identità": "DNI / documento de identidad", Passaporto: "Pasaporte", "Patente di guida": "Permiso de conducir" },
    docNumber: "Número del documento", passportNumber: "Número de pasaporte", issuedBy: "Expedido por", issuedByPh: "Autoridad o país",
    others: "Otros huéspedes", othersNote: "a enviar como tarde el día antes del check-in", guestN: (c) => `Huésped ${c}`,
    notes: "Notas (opcional)", notesPh: "Hora de llegada, peticiones especiales…", pet: "Viajo con una mascota", petFee: (x) => `máximo 1 · ${x} por estancia`, petLine: "Mascota",
    law: "Por ley italiana (art. 109 TULPS) comunicamos los datos de los huéspedes a la policía a través del portal Alloggiati Web. Solo los usamos para esto y para gestionar tu estancia: nunca se comparten con nadie.",
    consent: "Acepto el tratamiento de mis datos y los de los demás huéspedes para gestionar la reserva y cumplir las obligaciones legales.",
    back: "Cambiar fechas", almost: "¡Ya casi está!", sent: "¡Solicitud enviada!",
    waDone1: "Se ha abierto WhatsApp con el mensaje ya escrito:", waDone2: "pulsa enviar", waDone3: "y recibiremos tu solicitud.", waNotOpen: "¿No se ha abierto WhatsApp?",
    apiDone: (name) => `¡Gracias ${name}! Te hemos escrito por WhatsApp. En cuanto confirmemos, tus fechas quedan bloqueadas y recibirás un email y una invitación de calendario con todos los detalles.`,
    code: "código", newReq: "Nueva solicitud", perNight: "/ noche", updating: "actualizando", updated: "actualizado",
    status: {
      ok: "¡Disponible! Ahora tus datos", unavailable: "Algunas noches ya están ocupadas", closed: "Ahora mismo no aceptamos reservas",
      past: "Las fechas ya han pasado", min: (c) => `Estancia mínima de ${c} noches`, pickDeparture: "Ahora elige el día de salida", pickArrival: "Elige el día de llegada en el calendario",
    },
    nightsN: (c) => n(c, "noche", "noches"), season: "temporada", weekend: "fin de semana", cleaning: "Limpieza final", transferLine: "Traslado desde Orio al Serio",
    total: "Total", cont: "Continuar", send: "Enviar solicitud", sendWa: "Enviar por WhatsApp", sending: "Enviando…",
    fine: (dep) => `Sin pago ahora · fianza de ${dep} en efectivo, devuelta a la salida`, less: "Menos", more: "Más",
  },
  faq: {
    kicker: "A tener en cuenta", title1: "Preguntas", title2: "frecuentes", facts: ["Llegada", "Salida", "Mínimo", "Fianza"],
    minN: (c) => n(c, "noche", "noches"), rules: "No se fuma dentro · sin fiestas · se admite 1 mascota (50 € por estancia)",
    items: [
      { q: "¿A qué distancia está el aeropuerto de Orio al Serio?", a: "Unos 4 km: pocos minutos en coche o taxi. Ideal para vuelos de madrugada o a última hora." },
      { q: "¿Cómo se llega a la Ciudad Alta?", a: "En coche en unos 15 minutos, o en transporte público hasta el centro y luego el funicular." },
      { q: "¿El aparcamiento está incluido?", a: "Sí: hay aparcamiento gratuito cerca de la casa." },
      { q: "¿Puedo cancelar la reserva?", a: "Sí, gratis hasta 14 días antes de la llegada. Después la reserva ya no se puede cancelar." },
      { q: "¿Hay aire acondicionado?", a: "Sí, bajo petición por 10 € al día: puedes añadirlo al reservar." },
      { q: "¿Puedo traer a mi perro?", a: "Claro, Flori's Home admite mascotas: se admite 1 animal, con un suplemento de 50 € por estancia. Marca la opción al reservar." },
      { q: "¿Sirve para teletrabajar?", a: "Sí: Wi-Fi gratis, escritorio y estancias tranquilas." },
    ],
  },
  foot: {
    guide: "Guía para huéspedes",
    hint: "mueve el ratón aquí ✨", title1: "Te esperamos", title2: "en Bérgamo", sub: "Elige las fechas: te confirmamos la disponibilidad en pocos minutos.",
    cta: "Comprobar disponibilidad", contacts: "Contacto", explore: "Explorar", copy: "Apartamento turístico", photos: "Fotos de la ciudad: Unsplash",
  },
  guide: {
    title: "Guía de la casa", welcome1: "Bienvenido", welcome2: "a casa",
    hello: (n) => `Hola ${n},`, helloEm: "¡bienvenido!",
    sub: "Todo lo que necesitas durante la estancia, en un solo lugar.",
    stay: (a, b) => `Te esperamos del ${a} al ${b}. Aquí tienes todo lo que necesitas.`,
    checkIn: "Check-in", checkOut: "Check-out",
    codeTitle: "¿Tienes el código de tu estancia?", codeSub: "Lo encontrarás en el mensaje de confirmación por WhatsApp o email.",
    open: "Abrir la guía", checking: "Comprobando…", bad: "Código no válido o caducado: revísalo o escríbenos por WhatsApp.", logout: "Salir",
    locked: "Visible con el código de la estancia",
    wifi: "Wi-Fi", network: "Red", password: "Contraseña", copy: "Copiar", copied: "¡Copiado!", askHost: "Pídenos la contraseña por WhatsApp.",
    entry: "Cómo entrar", entryEmpty: "Te enviaremos las instrucciones para entrar por WhatsApp antes de tu llegada.",
    times: "Llegada y salida", timesTxt: (ci, co) => `Check-in ${ci}, check-out ${co}.`, timesLate: "¿Llegas fuera de horario? Escríbenos y nos organizamos.",
    parking: "Aparcamiento", parkingDefault: "Aparcamiento gratuito cerca.",
    rules: "Normas de la casa",
    rulesList: (ci, co, dep) => [`Check-in ${ci}, check-out ${co}.`, "No se permiten fiestas ni eventos.", "Mascotas admitidas: máximo 1, suplemento de 50 € por estancia.", `Fianza de ${dep} en efectivo, devuelta en el check-out.`],
    waste: "Reciclaje", wasteSub: "En Bérgamo la recogida es puerta a puerta: separa los residuos así.",
    wasteItems: [["Orgánico", "en bolsas compostables"], ["Papel y cartón", "aplastados, en cajas o bolsas de papel"], ["Plástico", "en la bolsa amarilla"], ["Vidrio y metales", "juntos, latas incluidas, sin bolsa"], ["Resto", "en la bolsa transparente"]],
    wasteDays: "Días de recogida",
    checkout: "Antes de irte", checkoutList: ["Apaga luces, calefacción y aire acondicionado", "Cierra las ventanas y la puerta del balcón", "Tira la basura en los contenedores correctos", "Deja las llaves como te indicamos"],
    numbers: "Teléfonos útiles", host: "Nosotros, por WhatsApp", n112: "Emergencias: policía, ambulancia, bomberos", n116: "Médico de guardia (noches y festivos)", taxi: "Radio Taxi Bérgamo",
    notes: "Notas del anfitrión", around: "Qué hacer cerca", aroundSub: "Ciudad Alta, lagos, termas y nuestras experiencias favoritas, reservables online.", aroundCta: "Ver actividades",
    enjoy: "¡Disfruta de Bérgamo!", back: "Volver a la web",
  },
  mbar: { perNight: "/ noche", superb: "Fantástico", cta: "Elegir fechas" },
  cal: { wd: ["L", "M", "X", "J", "V", "S", "D"], unavailable: "No disponible", perNight: "/ noche", prev: "Mes anterior", next: "Mes siguiente" },
};
