import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, CalendarDays, Users, Search, Minus, Plus, MapPin, Sparkles } from "lucide-react";
import { P, ROTATE, TRUST } from "../data";
import { useSettings, quote, euro, fmtDate } from "../lib/settings";
import { useBooking, scrollToId } from "../lib/booking";
import Calendar from "./Calendar";
import { Img, EASE } from "./ui";
import { Sticker, Leaves } from "./Wow";

/* parola che cambia nel titolo */
function Rotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % ROTATE.length), 2300);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="rotator">
      <AnimatePresence mode="wait">
        <motion.em
          key={i}
          initial={{ y: "100%", opacity: 0, rotate: 3 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          {ROTATE[i]}
        </motion.em>
      </AnimatePresence>
    </span>
  );
}

/* ---------------- BARRA DATE ---------------- */
function SearchBar() {
  const { settings: s } = useSettings();
  const { from, to, guests, transfer, setFrom, setTo, setGuests } = useBooking();
  const [open, setOpen] = useState(null); // "dates" | "guests" | null
  const ref = useRef(null);
  const q = quote(from, to, s, { transfer });
  const ok = q.status === "ok";

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(null);
    addEventListener("pointerdown", close);
    return () => removeEventListener("pointerdown", close);
  }, []);

  const months = typeof window !== "undefined" && innerWidth > 820 ? 2 : 1;
  const max = Number(s.maxGuests) || 5;

  return (
    <div className="search" ref={ref}>
      <button className={`sf ${open === "dates" ? "on" : ""}`} onClick={() => setOpen(open === "dates" ? null : "dates")}>
        <CalendarDays size={18} />
        <div>
          <span>Arrivo</span>
          <b>{from ? fmtDate(from, { day: "numeric", month: "short" }) : "Aggiungi data"}</b>
        </div>
      </button>
      <i className="sdiv" />
      <button className={`sf ${open === "dates" ? "on" : ""}`} onClick={() => setOpen(open === "dates" ? null : "dates")}>
        <div>
          <span>Partenza</span>
          <b>{to ? fmtDate(to, { day: "numeric", month: "short" }) : "Aggiungi data"}</b>
        </div>
      </button>
      <i className="sdiv" />
      <button className={`sf ${open === "guests" ? "on" : ""}`} onClick={() => setOpen(open === "guests" ? null : "guests")}>
        <Users size={18} />
        <div>
          <span>Ospiti</span>
          <b>{guests} {guests === 1 ? "ospite" : "ospiti"}</b>
        </div>
      </button>
      <button className="sgo" onClick={() => { setOpen(null); scrollToId("prenota"); }}>
        {ok ? <span>{euro(q.total)} · Prenota</span> : <><Search size={18} /><span>Verifica</span></>}
      </button>

      <AnimatePresence>
        {open === "dates" && (
          <motion.div className="pop pop-dates" initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.25 }}>
            <div className="pop-head">
              <b>{from && to ? `${q.nights.length} notti · ${fmtDate(from, { day: "numeric", month: "short" })} – ${fmtDate(to, { day: "numeric", month: "short" })}` : from ? "Scegli la partenza" : "Scegli l'arrivo"}</b>
              {(from || to) && <button onClick={() => { setFrom(null); setTo(null); }}>Cancella</button>}
            </div>
            <Calendar settings={s} mode="range" from={from} to={to} months={months}
              onRange={(a, b) => { setFrom(a); setTo(b); if (b) setTimeout(() => setOpen(null), 350); }} />
          </motion.div>
        )}
        {open === "guests" && (
          <motion.div className="pop pop-guests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.25 }}>
            <div className="g-row">
              <div><b>Ospiti</b><span>Massimo {max}</span></div>
              <div className="stepper">
                <button onClick={() => setGuests(Math.max(1, guests - 1))} aria-label="Meno"><Minus size={15} /></button>
                <b>{guests}</b>
                <button onClick={() => setGuests(Math.min(max, guests + 1))} aria-label="Più"><Plus size={15} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- VENTAGLIO DI FOTO ---------------- */
const FAN = [
  { src: P.double, r: -16, x: -330, y: 40 },
  { src: P.kitchen, r: -8, x: -170, y: 6 },
  { src: P.living, r: 0, x: 0, y: -10 },
  { src: P.bath, r: 8, x: 170, y: 6 },
  { src: P.balcony, r: 16, x: 330, y: 40 },
];

function Fan() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [8, -8]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-10, 10]), { stiffness: 120, damping: 18 });
  const ref = useRef(null);
  const small = typeof window !== "undefined" && innerWidth < 720;
  const k = small ? 0.42 : 1;

  return (
    <div
      className="fan"
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
    >
      <motion.div className="fan-inner" style={{ rotateX: rx, rotateY: ry }}>
        {FAN.map((c, i) => (
          <motion.div
            key={i}
            className={`fan-card ${i === 2 ? "main" : ""}`}
            style={{ zIndex: 10 - Math.abs(i - 2) }}
            initial={{ x: 0, y: 160, rotate: 0, opacity: 0, scale: 0.8 }}
            animate={{ x: c.x * k, y: c.y * k, rotate: c.r, opacity: 1, scale: 1 }}
            whileHover={{ y: c.y * k - 24, scale: 1.04, rotate: c.r * 0.6, zIndex: 20 }}
            transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.5 + Math.abs(i - 2) * 0.12 }}
          >
            <Img src={c.src} alt="" eager={i === 2} />
          </motion.div>
        ))}
        <motion.div className="fan-tag t1" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4, type: "spring" }}>
          <Star size={14} fill="currentColor" /> <b>9,1</b> Superbo
        </motion.div>
        <motion.div className="fan-tag t2" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.6, type: "spring" }}>
          <MapPin size={14} /> 4 km da Orio al Serio
        </motion.div>
        <motion.div className="fan-tag t3" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8, type: "spring" }}>
          <Sparkles size={14} /> Appena ristrutturato
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ---------------- HERO ---------------- */
export function Hero() {
  const { settings: s } = useSettings();
  return (
    <section className="hero" id="top">
      <div className="hero-bg" />
      <Leaves count={8} />
      <motion.div className="hero-sticker" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 0.9 }}>
        <Sticker>€0</Sticker>
      </motion.div>
      <div className="hero-top">
        <motion.div className="hero-chip" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
          <span className="dot" /> {s.bookingOpen ? "Prenotazioni aperte" : "Prenotazioni chiuse"} · da <b>{euro(s.pricePerNight)}</b> a notte
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1, ease: EASE }}>
          La tua casa a Bergamo,<br />perfetta per <Rotator />
        </motion.h1>
        <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.25, ease: EASE }}>
          80 m² appena ristrutturati, due camere, balcone sul verde e parcheggio gratuito.
        </motion.p>
        <motion.div className="search-wrap" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: EASE }}>
          <SearchBar />
        </motion.div>
      </div>
      <Fan />
    </section>
  );
}

/* ---------------- STRISCIA FIDUCIA ---------------- */
export function Trust() {
  const row = [...TRUST, ...TRUST];
  return (
    <div className="trust">
      <div className="trust-row">
        {row.map((t, i) => <span key={i}><i>✦</i>{t}</span>)}
      </div>
    </div>
  );
}
