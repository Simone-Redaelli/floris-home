import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Menu, X, Star, MapPin, ArrowRight, ChevronLeft, ChevronRight, Plus, Users, CalendarDays, MessageCircle, Mail, Phone, Plane, Landmark, Church, Trophy, Navigation } from "lucide-react";
import { SITE, PHOTOS, STATS, SPACES, AMENITIES, PLACES, SCORES, RULES, FAQ } from "../data";
import { Icon, Photo, SectionHead, Reveal, Counter, SplitWords, Magnetic } from "./ui";

/* ---------------- NAV ---------------- */
const LINKS = [
  ["Tour", "#tour"],
  ["Galleria", "#galleria"],
  ["Servizi", "#servizi"],
  ["Posizione", "#posizione"],
  ["Recensioni", "#recensioni"],
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} />
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a href="#top" className="logo">
          <span className="logo-mark">F</span>
          <span>Flori's <em>Home</em></span>
        </a>
        <nav className="nav-links">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h}>{l}</a>
          ))}
        </nav>
        <a href="#prenota" className="btn btn-sm">Prenota</a>
        <button className="burger" onClick={() => setOpen(true)} aria-label="Menu">
          <Menu />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <button className="burger close" onClick={() => setOpen(false)} aria-label="Chiudi">
              <X />
            </button>
            {[...LINKS, ["Prenota", "#prenota"]].map(([l, h], i) => (
              <motion.a
                key={h}
                href={h}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
              >
                {l}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- HERO ---------------- */
export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 220]);
  const scale = useTransform(scrollY, [0, 800], [1.05, 1.25]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="hero" id="top">
      <motion.div className="hero-bg" style={{ y, scale }}>
        <Photo photo={PHOTOS[0]} eager />
      </motion.div>
      <div className="hero-veil" />
      <div className="blob b1" />
      <div className="blob b2" />

      <motion.div className="hero-inner" style={{ opacity: fade }}>
        <motion.div
          className="pill"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Star size={14} fill="currentColor" /> {String(SITE.rating).replace(".", ",")} · {SITE.reviewsCount} recensioni · Superbo
        </motion.div>

        <h1>
          <SplitWords text="La tua casa" delay={0.3} />
          <br />
          <SplitWords text="a Bergamo." delay={0.55} className="accent" />
        </h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Appartamento di 80 m² appena ristrutturato, con due camere, balcone sul giardino
          e parcheggio gratuito. A soli 4 km dall'aeroporto di Orio al Serio.
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Magnetic href="#prenota" className="btn btn-lg">
            Verifica disponibilità <ArrowRight size={18} />
          </Magnetic>
          <a href="#tour" className="btn-ghost">Entra in casa</a>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-card"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <MapPin size={18} />
        <div>
          <strong>Via San Pio X, 16</strong>
          <span>Bergamo · Lombardia</span>
        </div>
      </motion.div>

      <div className="scroll-hint">
        <span />
      </div>
    </section>
  );
}

/* ---------------- MARQUEE ---------------- */
export function Marquee() {
  const items = ["Wi-Fi gratuito", "Parcheggio incluso", "Pet friendly", "Aria condizionata", "Balcone sul giardino", "4 km da Orio al Serio", "Fino a 5 ospiti", "Smart TV & streaming"];
  const row = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span key={i}>
            {t} <i>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- INTRO + STATS ---------------- */
export function Intro() {
  return (
    <section className="intro container">
      <Reveal className="intro-text">
        <span className="kicker">Benvenuti</span>
        <p className="big">
          Uno spazio <em>luminoso</em>, curato in ogni dettaglio, pensato per famiglie,
          coppie e chi viaggia per lavoro. Tutto l'appartamento è <em>solo per te</em>.
        </p>
      </Reveal>
      <div className="stats">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1} className="stat">
            <strong>
              <Counter value={s.value} decimals={s.decimals || 0} suffix={s.suffix} />
            </strong>
            <span>{s.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- SPAZI (tabs) ---------------- */
export function Spaces() {
  const [active, setActive] = useState(0);
  const s = SPACES[active];
  return (
    <section className="spaces" id="spazi">
      <div className="container">
        <SectionHead kicker="Gli spazi" title="Ogni stanza, <em>una storia</em>" />
        <div className="tabs">
          {SPACES.map((sp, i) => (
            <button key={sp.id} className={i === active ? "on" : ""} onClick={() => setActive(i)}>
              {i === active && <motion.span layoutId="tab-bg" className="tab-bg" />}
              <span className="tab-label">{sp.title}</span>
            </button>
          ))}
        </div>

        <div className="space-stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.id}
              className="space-photo"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              exit={{ clipPath: "inset(0 0 0 100%)" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
              <Photo photo={PHOTOS[s.photo]} />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={s.id + "t"}
              className="space-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="num">0{active + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <div className="tags">
                {s.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ---------------- GALLERIA + LIGHTBOX ---------------- */
export function Gallery() {
  const [idx, setIdx] = useState(null);
  const go = (d) => setIdx((i) => (i + d + PHOTOS.length) % PHOTOS.length);

  useEffect(() => {
    if (idx === null) return;
    const k = (e) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", k);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", k);
    };
  }, [idx]);

  return (
    <section className="gallery container" id="galleria">
      <SectionHead kicker="Galleria" title="Dai un'occhiata <em>dentro</em>" sub="Clicca su una foto per ingrandirla." />
      <div className="bento">
        {PHOTOS.map((p, i) => (
          <Reveal key={p.src} delay={(i % 4) * 0.08} className={`bento-item g${i}`}>
            <button onClick={() => setIdx(i)} aria-label={p.label}>
              <Photo photo={p}>
                <span className="cap">{p.label}</span>
              </Photo>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {idx !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIdx(null)}
          >
            <button className="lb-close" aria-label="Chiudi"><X /></button>
            <button className="lb-nav l" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Precedente"><ChevronLeft /></button>
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                className="lb-img"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
              >
                <Photo photo={PHOTOS[idx]} />
                <span className="lb-cap">{idx + 1} / {PHOTOS.length} — {PHOTOS[idx].label}</span>
              </motion.div>
            </AnimatePresence>
            <button className="lb-nav r" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Successiva"><ChevronRight /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------------- SERVIZI ---------------- */
export function Amenities() {
  return (
    <section className="amenities" id="servizi">
      <div className="container">
        <SectionHead light kicker="Servizi" title="Tutto quello che <em>ti serve</em>" />
        <div className="amen-grid">
          {AMENITIES.map((a, i) => (
            <Reveal key={a.label} delay={(i % 4) * 0.07} className="amen">
              <div className="amen-ico"><Icon name={a.icon} size={26} /></div>
              <span>{a.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- POSIZIONE ---------------- */
const kindIcon = { plane: Plane, museum: Landmark, church: Church, stadium: Trophy, pin: MapPin };

export function Location() {
  const { lat, lng } = SITE.coords;
  const d = 0.012;
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d * 1.6}%2C${lat - d}%2C${lng + d * 1.6}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
  const max = Math.max(...PLACES.map((p) => p.km));
  return (
    <section className="location container" id="posizione">
      <SectionHead kicker="Posizione" title="Comodo per <em>tutto</em>" sub="Zona residenziale e tranquilla, a pochi minuti dall'aeroporto e dal centro." />
      <div className="loc-grid">
        <Reveal className="map-wrap">
          <iframe title="Mappa" src={map} loading="lazy" />
          <a
            className="map-btn"
            target="_blank"
            rel="noreferrer"
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
          >
            <Navigation size={16} /> Indicazioni
          </a>
        </Reveal>
        <div className="places">
          {PLACES.map((p, i) => {
            const I = kindIcon[p.kind] || MapPin;
            return (
              <Reveal key={p.name} delay={i * 0.06} className="place">
                <I size={18} />
                <div className="place-main">
                  <div className="place-row">
                    <span>{p.name}</span>
                    <strong>{String(p.km).replace(".", ",")} km</strong>
                  </div>
                  <div className="bar">
                    <motion.i
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(p.km / max) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.2 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- RECENSIONI (punteggi) ---------------- */
export function Reviews() {
  return (
    <section className="reviews" id="recensioni">
      <div className="container rev-grid">
        <Reveal className="rev-big">
          <span className="kicker">Recensioni</span>
          <div className="score-ring">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" className="track" />
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                className="fill"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: SITE.rating / 10 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <div className="score-num">
              <Counter value={SITE.rating} decimals={1} />
              <small>Superbo</small>
            </div>
          </div>
          <p>Media su {SITE.reviewsCount} recensioni verificate di ospiti reali.</p>
          <a className="link" href={SITE.bookingUrl} target="_blank" rel="noreferrer">
            Leggi tutte le recensioni <ArrowRight size={16} />
          </a>
        </Reveal>
        <div className="scores">
          {SCORES.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07} className="score">
              <div className="score-row">
                <span>{s.label}</span>
                <strong>{String(s.value).replace(".", ",")}</strong>
              </div>
              <div className="bar">
                <motion.i
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.value * 10}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PRENOTAZIONE ---------------- */
const fmt = (d) => d.toISOString().slice(0, 10);
const euro = (n) => "€" + n.toLocaleString("it-IT");

export function Booking() {
  const today = useMemo(() => new Date(), []);
  const [inD, setIn] = useState(fmt(new Date(today.getTime() + 7 * 864e5)));
  const [outD, setOut] = useState(fmt(new Date(today.getTime() + 10 * 864e5)));
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [pet, setPet] = useState(false);

  const nights = Math.max(0, Math.round((new Date(outD) - new Date(inD)) / 864e5));
  const subtotal = nights * SITE.pricePerNight;
  const total = nights > 0 ? subtotal + SITE.cleaningFee : 0;
  const valid = nights >= SITE.minNights;

  const it = (d) => new Date(d).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
  const msg = `Ciao! Sono ${name || "interessato/a"} e vorrei prenotare Flori's Home dal ${it(inD)} al ${it(outD)} (${nights} notti) per ${guests} ospiti${pet ? " + un animale" : ""}. È disponibile?`;
  const wa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
  const mail = `mailto:${SITE.email}?subject=${encodeURIComponent("Richiesta prenotazione Flori's Home")}&body=${encodeURIComponent(msg)}`;

  return (
    <section className="booking" id="prenota">
      <div className="container book-grid">
        <div className="book-copy">
          <SectionHead light kicker="Prenota direttamente" title="Il tuo soggiorno <em>inizia qui</em>" sub="Scegli le date, guarda subito il preventivo e inviaci la richiesta su WhatsApp o via email. Ti rispondiamo in pochissimo tempo." />
          <Reveal className="contacts">
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}><Phone size={18} /> {SITE.phone}</a>
            <a href={`mailto:${SITE.email}`}><Mail size={18} /> {SITE.email}</a>
          </Reveal>
        </div>

        <Reveal className="book-card" y={60}>
          <div className="price-head">
            <strong>{euro(SITE.pricePerNight)}</strong> <span>/ notte</span>
            <em className="hint">prezzo indicativo</em>
          </div>

          <div className="fields">
            <label>
              <span><CalendarDays size={14} /> Arrivo</span>
              <input type="date" value={inD} min={fmt(today)} onChange={(e) => {
                setIn(e.target.value);
                if (e.target.value >= outD) setOut(fmt(new Date(new Date(e.target.value).getTime() + 864e5)));
              }} />
            </label>
            <label>
              <span><CalendarDays size={14} /> Partenza</span>
              <input type="date" value={outD} min={inD} onChange={(e) => setOut(e.target.value)} />
            </label>
            <label className="full">
              <span><Users size={14} /> Ospiti</span>
              <div className="stepper">
                <button onClick={() => setGuests((g) => Math.max(1, g - 1))}>−</button>
                <b>{guests}</b>
                <button onClick={() => setGuests((g) => Math.min(5, g + 1))}>+</button>
              </div>
            </label>
            <label className="full">
              <span>Il tuo nome</span>
              <input type="text" placeholder="Mario Rossi" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="check full">
              <input type="checkbox" checked={pet} onChange={(e) => setPet(e.target.checked)} />
              <span>Viaggio con un animale domestico</span>
            </label>
          </div>

          <AnimatePresence>
            {valid && (
              <motion.div
                className="summary"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div><span>{euro(SITE.pricePerNight)} × {nights} notti</span><span>{euro(subtotal)}</span></div>
                <div><span>Pulizia finale</span><span>{euro(SITE.cleaningFee)}</span></div>
                <div className="tot"><span>Totale stimato</span><motion.span key={total} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>{euro(total)}</motion.span></div>
              </motion.div>
            )}
          </AnimatePresence>

          <a className={`btn btn-lg wa ${valid ? "" : "disabled"}`} href={valid ? wa : undefined} target="_blank" rel="noreferrer">
            <MessageCircle size={18} /> Richiedi su WhatsApp
          </a>
          <a className={`btn-outline ${valid ? "" : "disabled"}`} href={valid ? mail : undefined}>
            <Mail size={16} /> Invia per email
          </a>
          <p className="fine">Nessun pagamento ora. Cauzione di {euro(SITE.deposit)} in contanti all'arrivo, restituita al check-out.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- REGOLE ---------------- */
export function Rules() {
  return (
    <section className="rules container">
      <SectionHead kicker="Da sapere" title="Regole della <em>casa</em>" />
      <div className="rules-grid">
        {RULES.map((r, i) => (
          <Reveal key={r.title} delay={(i % 3) * 0.08} className="rule">
            <Icon name={r.icon} size={24} />
            <h4>{r.title}</h4>
            <p>{r.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq container">
      <SectionHead kicker="FAQ" title="Domande <em>frequenti</em>" />
      <div className="faq-list">
        {FAQ.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.05} className={`faq-item ${open === i ? "open" : ""}`}>
            <button onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{f.q}</span>
              <motion.i animate={{ rotate: open === i ? 45 : 0 }}><Plus size={20} /></motion.i>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="faq-a"
                >
                  <p>{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <Reveal className="foot-cta">
          <h2>Ti aspettiamo a <em>Bergamo</em>.</h2>
          <Magnetic href="#prenota" className="btn btn-lg">Prenota ora <ArrowRight size={18} /></Magnetic>
        </Reveal>
        <div className="foot-bottom">
          <div>
            <a href="#top" className="logo"><span className="logo-mark">F</span><span>Flori's <em>Home</em></span></a>
            <p>{SITE.address}</p>
          </div>
          <div className="foot-links">
            {LINKS.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
          </div>
          <p className="copy">© {new Date().getFullYear()} Flori's Home · Appartamento ad uso turistico</p>
        </div>
      </div>
    </footer>
  );
}
