import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, ArrowRight, X, ChevronLeft, ChevronRight, Plus, Minus, MessageCircle, Mail, Navigation, Star } from "lucide-react";
import { P, CITY, SITE, GALLERY, AMENITIES, PLACES, SCORES, FAQ } from "../data";
import { useSettings, quote, euro, fmtDate } from "../lib/settings";
import Calendar from "./Calendar";
import { Img, MaskText, Reveal, Counter, Magnetic, Spotlight, Icon, EASE, EASE_IO } from "./ui";
import { LINKS } from "./Chrome";

/* ---------------- GALLERIA ORIZZONTALE ---------------- */
function GCard({ g, i, p, onOpen }) {
  const inner = useTransform(p, [0, 1], ["-12%", "12%"]);
  return (
    <button className={`gcard g${i % 3}`} onClick={() => onOpen(i)} data-cursor="Apri">
      <div className="gcard-img">
        <motion.div style={{ x: inner }} className="gcard-par">
          <Img src={g.src} alt={g.label} />
        </motion.div>
      </div>
      <div className="gcard-cap">
        <span>{String(i + 1).padStart(2, "0")}</span>
        <b>{g.label}</b>
      </div>
    </button>
  );
}

export function HGallery() {
  const ref = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);
  const [idx, setIdx] = useState(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const x = useTransform(p, [0, 1], [0, -dist]);
  const bar = useTransform(p, [0, 1], ["0%", "100%"]);

  useLayoutEffect(() => {
    const m = () => track.current && setDist(track.current.scrollWidth - innerWidth);
    m();
    addEventListener("resize", m);
    const t = setTimeout(m, 800);
    return () => (removeEventListener("resize", m), clearTimeout(t));
  }, []);

  const go = (d) => setIdx((i) => (i + d + GALLERY.length) % GALLERY.length);
  useEffect(() => {
    if (idx === null) return;
    window.__lenis?.stop();
    const k = (e) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    addEventListener("keydown", k);
    return () => (removeEventListener("keydown", k), window.__lenis?.start());
  }, [idx]);

  return (
    <section className="hgal" id="galleria" ref={ref} style={{ height: `${Math.max(250, GALLERY.length * 55)}vh` }}>
      <div className="hgal-sticky">
        <div className="hgal-head">
          <span className="kicker"><i>03</i>Galleria</span>
          <h2 className="h2"><MaskText>Ogni angolo,</MaskText> <em><MaskText delay={0.15}>una luce diversa</MaskText></em></h2>
        </div>
        <motion.div className="hgal-track" ref={track} style={{ x }}>
          {GALLERY.map((g, i) => <GCard key={g.src} g={g} i={i} p={p} onOpen={setIdx} />)}
          <div className="gcard-end">
            <p>Vuoi vederla dal vivo?</p>
            <Magnetic href="#prenota" className="big-link" data-cursor="Prenota">
              Prenota <ArrowUpRight size={40} strokeWidth={1.2} />
            </Magnetic>
          </div>
        </motion.div>
        <div className="hgal-bar"><motion.i style={{ width: bar }} /></div>
      </div>

      <AnimatePresence>
        {idx !== null && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIdx(null)}>
            <button className="lb-close" aria-label="Chiudi" data-cursor="Chiudi"><X size={28} strokeWidth={1.3} /></button>
            <button className="lb-nav l" onClick={(e) => (e.stopPropagation(), go(-1))} aria-label="Precedente"><ChevronLeft /></button>
            <AnimatePresence mode="wait">
              <motion.figure
                key={idx}
                className="lb-fig"
                onClick={(e) => e.stopPropagation()}
                initial={{ clipPath: "inset(10% 10% 10% 10% round 20px)", opacity: 0 }}
                animate={{ clipPath: "inset(0% 0% 0% 0% round 14px)", opacity: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.6, ease: EASE_IO }}
              >
                <Img src={GALLERY[idx].src} alt={GALLERY[idx].label} eager />
                <figcaption>{String(idx + 1).padStart(2, "0")} / {GALLERY.length} — {GALLERY[idx].label}</figcaption>
              </motion.figure>
            </AnimatePresence>
            <button className="lb-nav r" onClick={(e) => (e.stopPropagation(), go(1))} aria-label="Successiva"><ChevronRight /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------------- SERVIZI ---------------- */
export function Amenities() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const clip = useTransform(p, [0.05, 0.4], ["inset(18% 22% 18% 22% round 30px)", "inset(0% 0% 0% 0% round 24px)"]);
  const sc = useTransform(p, [0.05, 0.6], [1.4, 1]);
  return (
    <section className="amen" id="servizi" ref={ref}>
      <div className="wrap">
        <div className="amen-head">
          <span className="kicker"><i>04</i>Servizi</span>
          <h2 className="h2"><MaskText>Tutto incluso,</MaskText> <em><MaskText delay={0.12}>niente pensieri</MaskText></em></h2>
        </div>
        <div className="amen-grid">
          <motion.div className="amen-photo" style={{ clipPath: clip }}>
            <motion.div style={{ scale: sc }} className="fill">
              <Img src={P.living3} alt="Soggiorno" />
            </motion.div>
            <div className="amen-photo-tag">
              <b>80 m²</b> appena ristrutturati
            </div>
          </motion.div>
          <div className="amen-cards">
            {AMENITIES.map((a, i) => (
              <Reveal key={a.label} delay={(i % 2) * 0.08 + Math.floor(i / 2) * 0.05}>
                <Spotlight className="acard">
                  <div className="acard-ico"><Icon name={a.icon} size={24} /></div>
                  <div>
                    <b>{a.label}</b>
                    <span>{a.text}</span>
                  </div>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- MARQUEE ---------------- */
export function Marquee({ items, reverse }) {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(p, [0, 1], reverse ? ["-30%", "0%"] : ["0%", "-30%"]);
  const row = [...items, ...items, ...items];
  return (
    <div className="marquee" ref={ref}>
      <motion.div className="marquee-row" style={{ x }}>
        {row.map((t, i) => (
          <span key={i}>{t}<i>✦</i></span>
        ))}
      </motion.div>
    </div>
  );
}

/* ---------------- BERGAMO ---------------- */
export function Bergamo() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(p, [0, 1], [140, -140]);
  const y2 = useTransform(p, [0, 1], [260, -200]);
  const y3 = useTransform(p, [0, 1], [60, -60]);
  const { lat, lng } = SITE.coords;
  const d = 0.014;
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d * 1.6}%2C${lat - d}%2C${lng + d * 1.6}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
  const max = Math.max(...PLACES.map((x) => x.km));

  return (
    <section className="berg" id="bergamo" ref={ref}>
      <div className="wrap berg-grid">
        <div className="berg-collage">
          <motion.div className="bc bc1" style={{ y: y3 }}><Img src={CITY.alta} alt="Bergamo Città Alta" /></motion.div>
          <motion.div className="bc bc2" style={{ y: y1 }}><Img src={CITY.porta} alt="Porta San Giacomo" /></motion.div>
          <motion.div className="bc bc3" style={{ y: y2 }}><Img src={CITY.monti} alt="Bergamo e le montagne" /></motion.div>
        </div>
        <div className="berg-text">
          <span className="kicker"><i>05</i>Posizione</span>
          <h2 className="h2"><MaskText>Bergamo</MaskText> <em><MaskText delay={0.1}>a portata di mano</MaskText></em></h2>
          <Reveal as="p" className="lead">
            Zona residenziale e silenziosa, con parcheggio gratuito. Pochi minuti per l'aeroporto, la Fiera e il centro; un quarto d'ora per le mura veneziane di Città Alta.
          </Reveal>
          <div className="places">
            {PLACES.map((pl, i) => (
              <Reveal key={pl.name} delay={i * 0.06} className="place">
                <div className="place-row">
                  <span>{pl.name}</span>
                  <em>{pl.min}</em>
                  <b>{String(pl.km).replace(".", ",")} km</b>
                </div>
                <div className="pbar">
                  <motion.i
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: pl.km / max }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.2 + i * 0.07, ease: EASE }}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <Reveal className="wrap map-wrap" y={80}>
        <iframe title="Mappa Flori's Home" src={map} loading="lazy" />
        <div className="map-card">
          <span className="brand-mark">F</span>
          <div>
            <b>Flori's Home</b>
            <span>{SITE.address}</span>
          </div>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`} target="_blank" rel="noreferrer" data-cursor="Vai">
            <Navigation size={16} /> Indicazioni
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- RECENSIONI ---------------- */
export function Reviews() {
  return (
    <section className="rev" id="recensioni">
      <div className="wrap rev-grid">
        <div className="rev-left">
          <span className="kicker"><i>06</i>Recensioni</span>
          <div className="rev-score">
            <Counter value={SITE.rating} decimals={1} duration={2.6} />
          </div>
          <div className="rev-stars">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -90 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 260, damping: 14 }}
              >
                <Star size={22} fill="currentColor" strokeWidth={0} />
              </motion.span>
            ))}
          </div>
          <p>Superbo — media di {SITE.reviewsCount} recensioni verificate su Booking.com</p>
          <a className="ulink" href={SITE.bookingUrl} target="_blank" rel="noreferrer" data-cursor="Leggi">
            Leggi le recensioni <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="rev-bars">
          {SCORES.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07} className="rbar">
              <div className="rbar-row">
                <span>{s.label}</span>
                <b><Counter value={s.value} decimals={1} /></b>
              </div>
              <div className="pbar thick">
                <motion.i
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: s.value / 10 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: 0.2 + i * 0.08, ease: EASE }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PRENOTA ---------------- */
const STATUS = {
  ok: { cls: "ok", text: "Disponibile per queste date" },
  unavailable: { cls: "bad", text: "Alcune notti non sono disponibili" },
  closed: { cls: "bad", text: "Al momento non accettiamo prenotazioni" },
  past: { cls: "bad", text: "Le date sono nel passato" },
};

export function Booking() {
  const { settings: s, loading } = useSettings();
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(p, [0, 1], ["-15%", "15%"]);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [pet, setPet] = useState(false);

  const q = quote(from, to, s);
  const st = q.status === "min" ? { cls: "bad", text: `Soggiorno minimo ${s.minNights} notti` } : STATUS[q.status];
  const valid = q.status === "ok";
  const maxG = Number(s.maxGuests) || 5;

  const msg = from && to
    ? `Ciao! Sono ${name || "interessato/a"} e vorrei soggiornare a Flori's Home dal ${fmtDate(from)} al ${fmtDate(to)} (${q.nights.length} notti), ${guests} ospiti${pet ? " + un animale" : ""}. Totale stimato ${euro(q.total)}. È disponibile?`
    : "";
  const wa = `https://wa.me/${s.whatsapp}?text=${encodeURIComponent(msg)}`;
  const mail = `mailto:${s.email}?subject=${encodeURIComponent("Richiesta Flori's Home")}&body=${encodeURIComponent(msg)}`;

  return (
    <section className="book" id="prenota" ref={ref}>
      <motion.div className="book-bg" style={{ y: bgY }}>
        <Img src={P.double2} alt="" />
      </motion.div>
      <div className="book-veil" />
      <div className="wrap book-grid">
        <div className="book-copy">
          <span className="kicker light"><i>07</i>Prenota diretto</span>
          <h2 className="h2 big"><MaskText>Il tuo soggiorno</MaskText> <em><MaskText delay={0.12}>comincia qui</MaskText></em></h2>
          <Reveal as="p" className="lead">
            Scegli le date sul calendario: vedi subito disponibilità e prezzo. Poi mandaci la richiesta, ti rispondiamo in pochi minuti e senza commissioni.
          </Reveal>
          {s.notice && <Reveal className="notice">{s.notice}</Reveal>}
          <Reveal className="book-contacts" delay={0.1}>
            <a href={`tel:${String(s.phone).replace(/\s/g, "")}`}>{s.phone}</a>
            <a href={`mailto:${s.email}`}>{s.email}</a>
          </Reveal>
        </div>

        <Reveal className="glass" y={80}>
          <div className="glass-head">
            <div><span className="from">da</span><b>{euro(s.pricePerNight)}</b><span>/ notte</span></div>
            <em className={loading ? "live loading" : "live"}><i /> {loading ? "aggiorno…" : "prezzi aggiornati"}</em>
          </div>

          {!s.bookingOpen ? (
            <div className="closed-box">
              <b>Prenotazioni momentaneamente chiuse</b>
              <span>Scrivici comunque: ti avvisiamo appena riapriamo.</span>
            </div>
          ) : (
            <Calendar
              settings={s}
              mode="range"
              from={from}
              to={to}
              onRange={(a, b) => { setFrom(a); setTo(b); }}
              months={1}
            />
          )}

          <div className="sel-row">
            <div className={`sel ${from ? "on" : ""}`}><span>Arrivo</span><b>{from ? fmtDate(from, { day: "numeric", month: "short" }) : "—"}</b></div>
            <div className={`sel ${to ? "on" : ""}`}><span>Partenza</span><b>{to ? fmtDate(to, { day: "numeric", month: "short" }) : "—"}</b></div>
            <div className="sel guests">
              <span>Ospiti</span>
              <div className="stepper">
                <button onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="Meno"><Minus size={14} /></button>
                <AnimatePresence mode="popLayout">
                  <motion.b key={guests} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}>{guests}</motion.b>
                </AnimatePresence>
                <button onClick={() => setGuests((g) => Math.min(maxG, g + 1))} aria-label="Più"><Plus size={14} /></button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {st && (
              <motion.div key={st.text} className={`avail ${st.cls}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <i />{st.text}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {valid && (
              <motion.div className="sum" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                {q.groups.map((g, i) => (
                  <div key={i}>
                    <span>{euro(g.price)} × {g.count} {g.count === 1 ? "notte" : "notti"}{g.kind === "season" ? ` · ${g.label || "stagione"}` : g.kind === "weekend" ? " · weekend" : ""}</span>
                    <span>{euro(g.price * g.count)}</span>
                  </div>
                ))}
                {Number(s.cleaningFee) > 0 && <div><span>Pulizia finale</span><span>{euro(s.cleaningFee)}</span></div>}
                <div className="tot">
                  <span>Totale stimato</span>
                  <motion.b key={q.total} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{euro(q.total)}</motion.b>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {valid && (
            <div className="gfields one">
              <label>
                <span>Nome</span>
                <input type="text" placeholder="Come ti chiami?" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="gcheck">
                <input type="checkbox" checked={pet} onChange={(e) => setPet(e.target.checked)} />
                <i />
                <span>Viaggio con un animale</span>
              </label>
            </div>
          )}

          <a className={`cta ${valid ? "" : "off"}`} href={valid ? wa : undefined} target="_blank" rel="noreferrer" data-cursor="Invia">
            <MessageCircle size={18} /> Richiedi su WhatsApp
          </a>
          <a className={`cta ghost ${valid ? "" : "off"}`} href={valid ? mail : undefined}>
            <Mail size={16} /> oppure via email
          </a>
          <p className="fine">Nessun pagamento ora · cauzione {euro(s.deposit)} in contanti, restituita al check-out</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- INFO: REGOLE + FAQ ---------------- */
export function Info() {
  const [open, setOpen] = useState(0);
  const { settings: st } = useSettings();
  const RULES = [
    ["Check-in", st.checkIn],
    ["Check-out", st.checkOut],
    ["Soggiorno minimo", `${st.minNights} ${Number(st.minNights) === 1 ? "notte" : "notti"}`],
    ["Cauzione", `${euro(st.deposit)} in contanti, restituiti al check-out`],
    ["Fumo", "Non si fuma in casa"],
    ["Feste", "Non sono ammesse feste o addii al celibato"],
    ["Animali", "Ammessi, avvisaci prima"],
  ];
  return (
    <section className="info">
      <div className="wrap info-grid">
        <div>
          <span className="kicker"><i>08</i>Da sapere</span>
          <h2 className="h2"><MaskText>Le regole</MaskText> <em><MaskText delay={0.1}>della casa</MaskText></em></h2>
          <div className="rules">
            {RULES.map(([k, v], i) => (
              <Reveal key={k} delay={i * 0.05} className="rule">
                <span>{k}</span>
                <b>{v}</b>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="faq">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05} className={`faq-i ${open === i ? "open" : ""}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{f.q}</span>
                <motion.i animate={{ rotate: open === i ? 135 : 0 }} transition={{ duration: 0.5, ease: EASE }}>
                  <Plus size={20} strokeWidth={1.4} />
                </motion.i>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div className="faq-a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
export function Footer() {
  const { settings: st } = useSettings();
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(p, [0, 1], ["-40%", "0%"]);
  const sc = useTransform(p, [0, 1], [0.85, 1]);
  return (
    <footer className="foot" ref={ref}>
      <div className="wrap foot-top">
        <h3 className="foot-cta"><MaskText>Ti aspettiamo</MaskText> <em><MaskText delay={0.1}>a Bergamo.</MaskText></em></h3>
        <Magnetic href="#prenota" className="round-cta solid" data-cursor="Prenota">
          <ArrowRight size={28} strokeWidth={1.3} />
        </Magnetic>
      </div>
      <div className="wrap foot-mid">
        <div>
          <span className="lbl">Indirizzo</span>
          <p>{SITE.address}</p>
        </div>
        <div>
          <span className="lbl">Contatti</span>
          <p><a href={`mailto:${st.email}`}>{st.email}</a><br />{st.phone}</p>
        </div>
        <div>
          <span className="lbl">Esplora</span>
          <p className="foot-links">{LINKS.map(([l, h]) => <a key={h} href={h}>{l}</a>)}</p>
        </div>
      </div>
      <motion.div className="foot-giant" style={{ y, scale: sc }}>
        Flori's <em>Home</em>
      </motion.div>
      <div className="wrap foot-bottom">
        <span>© {new Date().getFullYear()} Flori's Home</span>
        <span>Foto città: Unsplash</span>
      </div>
    </footer>
  );
}
