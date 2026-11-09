import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight, X, ChevronLeft, ChevronRight, Plus, Minus, MessageCircle, Mail, Navigation, Star,
  Maximize2, BedDouble, Users, Ruler, Check, Plane, Landmark, Theater, Trophy, Castle, Building2, Phone,
} from "lucide-react";
import { P, CITY, SITE, GALLERY, AMENITIES, PLACES, SCORES, FAQ, AUDIENCE, TOUR } from "../data";
import { useSettings, quote, euro, fmtDate } from "../lib/settings";
import { useBooking } from "../lib/booking";
import Calendar from "./Calendar";
import { Img, Reveal, Counter, Icon, EASE } from "./ui";
import { LINKS } from "./Chrome";
import { Polaroids, Skyline, Trail, Sticker } from "./Wow";

function Head({ kicker, title, sub, center }) {
  return (
    <Reveal className={`head ${center ? "center" : ""}`}>
      <span className="kicker">{kicker}</span>
      <h2 dangerouslySetInnerHTML={{ __html: title }} />
      {sub && <p>{sub}</p>}
    </Reveal>
  );
}

/* ---------------- LIGHTBOX ---------------- */
export const ALL = [...TOUR.map((t) => ({ src: t.photo, label: t.title })), ...GALLERY];

export function Lightbox({ idx, setIdx }) {
  const go = (d) => setIdx((i) => (i + d + ALL.length) % ALL.length);
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
    <AnimatePresence>
      {idx !== null && (
        <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIdx(null)}>
          <button className="lb-close" aria-label="Chiudi"><X size={24} /></button>
          <button className="lb-nav l" onClick={(e) => (e.stopPropagation(), go(-1))} aria-label="Precedente"><ChevronLeft /></button>
          <AnimatePresence mode="wait">
            <motion.figure key={idx} className="lb-fig" onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}>
              <Img src={ALL[idx].src} alt={ALL[idx].label} eager />
              <figcaption><b>{ALL[idx].label}</b><span>{idx + 1} / {ALL.length}</span></figcaption>
            </motion.figure>
          </AnimatePresence>
          <button className="lb-nav r" onClick={(e) => (e.stopPropagation(), go(1))} aria-label="Successiva"><ChevronRight /></button>
          <div className="lb-thumbs" onClick={(e) => e.stopPropagation()}>
            {ALL.map((a, i) => (
              <button key={i} className={i === idx ? "on" : ""} onClick={() => setIdx(i)}><Img src={a.src} alt="" /></button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- LA CASA: POLAROID ---------------- */
export function Bento() {
  const [idx, setIdx] = useState(null);
  const open = (src) => setIdx(Math.max(0, ALL.findIndex((a) => a.src === src)));
  return (
    <>
      <Polaroids onOpen={open} />
      <Lightbox idx={idx} setIdx={setIdx} />
    </>
  );
}

/* ---------------- PERFETTO PER ---------------- */
export function Audience() {
  return (
    <section className="sec soft">
      <div className="wrap">
        <Head kicker="Perfetto per" title="Pensato per <em>il tuo viaggio</em>" center />
        <div className="aud">
          {AUDIENCE.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08} className="aud-card">
              <div className="aud-img"><Img src={a.photo} alt={a.title} /><span>{a.tag}</span></div>
              <div className="aud-body">
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SERVIZI ---------------- */
export function Amenities() {
  return (
    <section className="sec" id="servizi">
      <div className="wrap amen">
        <div className="amen-left">
          <Head kicker="Servizi" title="Tutto incluso, <em>niente pensieri</em>" sub="Arrivi, posi le valigie e sei a casa. Biancheria, asciugamani e pulizie sono già pensati." />
          <Reveal className="amen-photo">
            <Img src={P.sofa} alt="Soggiorno" />
          </Reveal>
        </div>
        <div className="amen-grid">
          {AMENITIES.map((a, i) => (
            <Reveal key={a.label} delay={i * 0.05} className="amen-card">
              <div className="amen-ico"><Icon name={a.icon} size={24} /></div>
              <b>{a.label}</b>
              <span>{a.text}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- RECENSIONI ---------------- */
export function Reviews() {
  return (
    <section className="sec soft" id="recensioni">
      <div className="wrap rev">
        <Reveal className="rev-card">
          <Sticker className="rev-sticker" text="OSPITI FELICI • RECENSIONI VERE • ">★</Sticker>
          <span className="kicker light">Recensioni</span>
          <div className="rev-num"><Counter value={SITE.rating} decimals={1} duration={2.4} /></div>
          <div className="rev-stars">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 300, damping: 14 }}>
                <Star size={22} fill="currentColor" strokeWidth={0} />
              </motion.span>
            ))}
          </div>
          <b className="rev-label">Superbo</b>
          <p>Media di {SITE.reviewsCount} recensioni verificate di ospiti reali su Booking.com</p>
          <a href={SITE.bookingUrl} target="_blank" rel="noreferrer" className="rev-link">Leggi le recensioni <ArrowUpRight size={16} /></a>
        </Reveal>
        <div className="rev-right">
          <Head kicker="Cosa dicono gli ospiti" title="Pulizia e comfort <em>da 9,7</em>" />
          <div className="bars">
            {SCORES.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06} className="bar">
                <div className="bar-row"><span>{s.label}</span><b>{String(s.value).replace(".", ",")}</b></div>
                <div className="bar-track">
                  <motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: s.value / 10 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.2 + i * 0.07, ease: EASE }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- BERGAMO ---------------- */
const PLACE_ICON = [Plane, Building2, Landmark, Theater, Trophy, Castle];

export function Bergamo() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(p, [0, 1], [60, -60]);
  const y2 = useTransform(p, [0, 1], [120, -100]);
  const { lat, lng } = SITE.coords;
  const d = 0.014;
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d * 1.6}%2C${lat - d}%2C${lng + d * 1.6}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <section className="sec" id="bergamo" ref={ref}>
      <Skyline />
      <div className="wrap berg">
        <div className="berg-text">
          <Head kicker="Posizione" title="Bergamo <em>a portata di mano</em>" sub="Zona residenziale e tranquilla. In pochi minuti sei in aeroporto, in Fiera o in centro; in un quarto d'ora sulle mura di Città Alta." />
          <div className="places">
            {PLACES.map((pl, i) => {
              const I = PLACE_ICON[i] || Landmark;
              return (
                <Reveal key={pl.name} delay={i * 0.05} className="place">
                  <span className="place-ico"><I size={18} /></span>
                  <span className="place-name">{pl.name}</span>
                  <span className="place-min">{pl.min}</span>
                  <b>{String(pl.km).replace(".", ",")} km</b>
                </Reveal>
              );
            })}
          </div>
        </div>
        <div className="berg-pics">
          <motion.div className="bp bp1" style={{ y: y1 }}><Img src={CITY.alta} alt="Città Alta" /><span>Città Alta</span></motion.div>
          <motion.div className="bp bp2" style={{ y: y2 }}><Img src={CITY.porta} alt="Porta San Giacomo" /><span>Porta San Giacomo</span></motion.div>
        </div>
      </div>
      <Reveal className="wrap map">
        <iframe title="Mappa Flori's Home" src={map} loading="lazy" />
        <div className="map-card">
          <span className="brand-mark">F</span>
          <div><b>Flori's Home</b><span>{SITE.address}</span></div>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`} target="_blank" rel="noreferrer"><Navigation size={15} /> Indicazioni</a>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- PRENOTA ---------------- */
export function Booking() {
  const { settings: s, loading } = useSettings();
  const { from, to, guests, setFrom, setTo, setGuests } = useBooking();
  const [name, setName] = useState("");
  const [pet, setPet] = useState(false);
  const q = quote(from, to, s);
  const valid = q.status === "ok";
  const maxG = Number(s.maxGuests) || 5;
  const months = typeof window !== "undefined" && innerWidth > 980 ? 2 : 1;

  const status = {
    ok: ["ok", "Disponibile! Mandaci la richiesta"],
    unavailable: ["bad", "Alcune notti sono già occupate"],
    closed: ["bad", "Al momento non accettiamo prenotazioni"],
    past: ["bad", "Le date sono nel passato"],
    min: ["bad", `Soggiorno minimo ${s.minNights} notti`],
    empty: ["idle", from ? "Ora scegli il giorno di partenza" : "Scegli il giorno di arrivo sul calendario"],
  }[q.status];

  const msg = from && to
    ? `Ciao! Sono ${name || "interessato/a"} e vorrei soggiornare a Flori's Home dal ${fmtDate(from)} al ${fmtDate(to)} (${q.nights.length} notti), ${guests} ospiti${pet ? " + un animale" : ""}. Totale stimato ${euro(q.total)}. È disponibile?`
    : "";

  return (
    <section className="sec book" id="prenota">
      <div className="wrap">
        <Head kicker="Prenota diretto" title="Scegli le date, <em>il resto è facile</em>" sub="Prezzi e disponibilità aggiornati in tempo reale. Nessuna commissione, nessun pagamento online." center />
        {s.notice && <Reveal className="notice">{s.notice}</Reveal>}
        <div className="book-grid">
          <Reveal className="book-cal">
            {s.bookingOpen ? (
              <Calendar settings={s} mode="range" from={from} to={to} months={months} onRange={(a, b) => { setFrom(a); setTo(b); }} />
            ) : (
              <div className="closed-box"><b>Prenotazioni momentaneamente chiuse</b><span>Scrivici comunque: ti avvisiamo appena riapriamo.</span></div>
            )}
            <div className="cal-legend">
              <span><i className="lg-sel" /> Selezionate</span>
              <span><i className="lg-off" /> Occupate</span>
              <span><i className="lg-sp" /> Prezzo speciale</span>
            </div>
          </Reveal>

          <Reveal className="book-sum" delay={0.1}>
            <div className="bs-price">
              <div><b>{euro(s.pricePerNight)}</b><span> / notte</span></div>
              <small className={loading ? "live wait" : "live"}><i /> {loading ? "aggiorno" : "aggiornato"}</small>
            </div>
            <div className="bs-fields">
              <div className={from ? "on" : ""}><span>Arrivo</span><b>{from ? fmtDate(from, { day: "numeric", month: "short" }) : "—"}</b></div>
              <div className={to ? "on" : ""}><span>Partenza</span><b>{to ? fmtDate(to, { day: "numeric", month: "short" }) : "—"}</b></div>
              <div className="full">
                <span>Ospiti</span>
                <div className="stepper">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} aria-label="Meno"><Minus size={14} /></button>
                  <b>{guests}</b>
                  <button onClick={() => setGuests(Math.min(maxG, guests + 1))} aria-label="Più"><Plus size={14} /></button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={status[1]} className={`status ${status[0]}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                {status[0] === "ok" ? <Check size={16} /> : <i />} {status[1]}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {valid && (
                <motion.div className="bs-lines" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  {q.groups.map((g, i) => (
                    <div key={i}>
                      <span>{euro(g.price)} × {g.count} {g.count === 1 ? "notte" : "notti"}{g.kind === "season" ? ` · ${g.label || "stagione"}` : g.kind === "weekend" ? " · weekend" : ""}</span>
                      <span>{euro(g.price * g.count)}</span>
                    </div>
                  ))}
                  {Number(s.cleaningFee) > 0 && <div><span>Pulizia finale</span><span>{euro(s.cleaningFee)}</span></div>}
                  <div className="tot"><span>Totale</span><motion.b key={q.total} initial={{ scale: 1.15 }} animate={{ scale: 1 }}>{euro(q.total)}</motion.b></div>
                  <input className="bs-name" placeholder="Il tuo nome" value={name} onChange={(e) => setName(e.target.value)} />
                  <label className="bs-pet"><input type="checkbox" checked={pet} onChange={(e) => setPet(e.target.checked)} /><i /> Viaggio con un animale</label>
                </motion.div>
              )}
            </AnimatePresence>

            <a className={`btn ${valid ? "" : "off"}`} href={valid ? `https://wa.me/${s.whatsapp}?text=${encodeURIComponent(msg)}` : undefined} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> Richiedi su WhatsApp
            </a>
            <a className={`btn ghost ${valid ? "" : "off"}`} href={valid ? `mailto:${s.email}?subject=${encodeURIComponent("Richiesta Flori's Home")}&body=${encodeURIComponent(msg)}` : undefined}>
              <Mail size={16} /> Invia per email
            </a>
            <p className="fine">Nessun pagamento ora · cauzione {euro(s.deposit)} in contanti, restituita al check-out</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
export function Faq() {
  const [open, setOpen] = useState(0);
  const { settings: st } = useSettings();
  const facts = [
    ["Check-in", st.checkIn],
    ["Check-out", st.checkOut],
    ["Minimo", `${st.minNights} ${Number(st.minNights) === 1 ? "notte" : "notti"}`],
    ["Cauzione", euro(st.deposit)],
  ];
  return (
    <section className="sec soft">
      <div className="wrap faq-wrap">
        <div>
          <Head kicker="Da sapere" title="Domande <em>frequenti</em>" />
          <div className="facts">
            {facts.map(([k, v], i) => (
              <Reveal key={k} delay={i * 0.05} className="fact"><span>{k}</span><b>{v}</b></Reveal>
            ))}
          </div>
          <Reveal className="rules-note">Non si fuma in casa · niente feste · animali ammessi, avvisaci prima</Reveal>
        </div>
        <div className="faq">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05} className={`faq-i ${open === i ? "open" : ""}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{f.q}</span>
                <motion.i animate={{ rotate: open === i ? 45 : 0 }}><Plus size={18} /></motion.i>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div className="faq-a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }}>
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
  return (
    <footer className="foot">
      <div className="wrap">
        <Reveal>
          <Trail className="foot-cta">
            <span className="trail-hint">muovi il mouse qui ✨</span>
            <h2>Ti aspettiamo <em>a Bergamo</em></h2>
            <p>Scegli le date: in pochi minuti ti confermiamo la disponibilità.</p>
            <a href="#prenota" className="btn light">Verifica disponibilità <ArrowUpRight size={18} /></a>
          </Trail>
        </Reveal>
        <div className="foot-grid">
          <div>
            <a href="#top" className="brand"><span className="brand-mark">F</span><span className="brand-name">Flori's <em>Home</em></span></a>
            <p>{SITE.address}</p>
          </div>
          <div>
            <span className="lbl">Contatti</span>
            <p><a href={`mailto:${st.email}`}>{st.email}</a><br /><a href={`tel:${String(st.phone).replace(/\s/g, "")}`}>{st.phone}</a></p>
          </div>
          <div>
            <span className="lbl">Esplora</span>
            <p className="foot-links">{LINKS.map(([l, h]) => <a key={h} href={h}>{l}</a>)}</p>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Flori's Home · Appartamento ad uso turistico</span>
          <span>Foto città: Unsplash</span>
        </div>
      </div>
    </footer>
  );
}
