import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Hand, Plane, MapPin, ArrowUpRight } from "lucide-react";
import { P, AUDIENCE } from "../data";
import { Img, Counter, Reveal, EASE } from "./ui";

const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

/* ---------------- ADESIVO ROTANTE ---------------- */
export function Sticker({ text = "PRENOTA DIRETTO • NIENTE COMMISSIONI • ", className = "", children }) {
  const id = useRef("s" + Math.random().toString(36).slice(2, 8)).current;
  return (
    <div className={`sticker ${className}`}>
      <svg viewBox="0 0 120 120">
        <defs><path id={id} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
        <text><textPath href={`#${id}`}>{text}</textPath></text>
      </svg>
      <span className="sticker-in">{children}</span>
    </div>
  );
}

/* ---------------- FOGLIE CHE FLUTTUANO ---------------- */
export function Leaves({ count = 6 }) {
  const items = useRef(
    Array.from({ length: count }, (_, i) => ({
      left: 5 + ((i * 97) % 90),
      top: 8 + ((i * 53) % 80),
      size: 18 + ((i * 7) % 22),
      dur: 9 + (i % 5) * 2,
      delay: -i * 1.7,
      rot: (i * 47) % 360,
      c: ["#7f927c", "#93a68f", "#c99a6e", "#b5794a"][i % 4],
    }))
  ).current;
  return (
    <div className="leaves-bg" aria-hidden="true">
      {items.map((l, i) => (
        <svg key={i} viewBox="0 0 40 40" style={{ left: `${l.left}%`, top: `${l.top}%`, width: l.size, height: l.size, animationDuration: `${l.dur}s`, animationDelay: `${l.delay}s`, "--r": `${l.rot}deg` }}>
          <path d="M20 2 C 34 10, 36 28, 20 38 C 4 28, 6 10, 20 2 Z" fill={l.c} />
          <path d="M20 6 V 36" stroke="rgba(255,255,255,.5)" strokeWidth="1" />
        </svg>
      ))}
    </div>
  );
}

/* ---------------- ONDA SEPARATRICE ---------------- */
export function Wave({ from = "var(--bg)", to = "var(--bg-2)", flip }) {
  return (
    <div className="wave" style={{ background: from, transform: flip ? "scaleX(-1)" : undefined }} aria-hidden="true">
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path d="M0,40 C240,90 480,0 720,36 C960,72 1200,10 1440,44 L1440,90 L0,90 Z" style={{ fill: to }} />
      </svg>
    </div>
  );
}

/* ---------------- POLAROID SUL TAVOLO ---------------- */
const SHOTS = [
  { src: P.living, cap: "il soggiorno ☀️", x: 4, y: 8, r: -8, mx: 2, my: 2 },
  { src: P.double, cap: "camera matrimoniale", x: 25, y: 30, r: 5, mx: 50, my: 5 },
  { src: P.kitchen, cap: "cucina completa", x: 46, y: 4, r: -3, mx: 6, my: 26 },
  { src: P.bath, cap: "vasca da bagno 🛁", x: 66, y: 30, r: 7, mx: 52, my: 30 },
  { src: P.balcony, cap: "il balcone 🌿", x: 78, y: 2, r: -6, mx: 3, my: 51 },
  { src: P.twin, cap: "camera doppia", x: 12, y: 56, r: 4, mx: 50, my: 55 },
  { src: P.view, cap: "la vista", x: 56, y: 58, r: -5, mx: 26, my: 76 },
];

function Polaroid({ s, i, bounds, onOpen, top, bump }) {
  const dragged = useRef(false);
  const touch = isTouch();
  const small = typeof window !== "undefined" && window.innerWidth < 720;
  return (
    <motion.div
      className="polaroid"
      style={{ left: `${small ? s.mx : s.x}%`, top: `${small ? s.my : s.y}%`, zIndex: top }}
      initial={{ opacity: 0, y: -220, rotate: s.r * 4, scale: 1.3 }}
      whileInView={{ opacity: 1, y: 0, rotate: s.r, scale: 1 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ type: "spring", stiffness: 70, damping: 13, delay: i * 0.12 }}
      drag={!touch}
      dragConstraints={bounds}
      dragElastic={0.15}
      whileDrag={{ scale: 1.08, rotate: 0, boxShadow: "0 40px 70px -20px rgba(70,45,22,.55)" }}
      whileHover={touch ? {} : { scale: 1.04, rotate: s.r * 0.4 }}
      onDragStart={() => { dragged.current = true; bump(); }}
      onPointerDown={() => { dragged.current = false; bump(); }}
      onClick={() => !dragged.current && onOpen(s.src)}
    >
      <span className="tape" />
      <div className="pol-img"><Img src={s.src} alt={s.cap} draggable={false} /></div>
      <p>{s.cap}</p>
    </motion.div>
  );
}

export function Polaroids({ onOpen }) {
  const bounds = useRef(null);
  const [z, setZ] = useState(() => SHOTS.map((_, i) => i + 1));
  const topRef = useRef(SHOTS.length);
  const bump = useCallback((i) => {
    topRef.current += 1;
    const v = topRef.current;
    setZ((arr) => arr.map((x, k) => (k === i ? v : x)));
  }, []);

  return (
    <section className="sec" id="casa">
      <div className="wrap">
        <div className="pol-head">
          <Reveal className="head">
            <span className="kicker">La casa</span>
            <h2>Sfoglia la casa <em>come un album</em></h2>
            <p>L'intero appartamento è tuo: 80 m², due camere, cucina, bagno con vasca e un balcone sul verde.</p>
          </Reveal>
          <Reveal className="pol-hint" delay={0.2}><Hand size={18} /> {isTouch() ? "Tocca una foto per ingrandirla" : "Trascina le foto, cliccale per ingrandirle"}</Reveal>
        </div>
        <div className="table" ref={bounds}>
          {SHOTS.map((s, i) => (
            <Polaroid key={s.src} s={s} i={i} bounds={bounds} onOpen={onOpen} top={z[i]} bump={() => bump(i)} />
          ))}
          <motion.div className="tsticker t-a" initial={{ scale: 0, rotate: -40 }} whileInView={{ scale: 1, rotate: -12 }} viewport={{ once: true }} transition={{ type: "spring", delay: 0.9 }}>
            <b><Counter value={80} /></b><span>m²</span>
          </motion.div>
          <motion.div className="tsticker t-b" initial={{ scale: 0, rotate: 40 }} whileInView={{ scale: 1, rotate: 8 }} viewport={{ once: true }} transition={{ type: "spring", delay: 1.1 }}>
            <b>2</b><span>camere</span>
          </motion.div>
          <motion.div className="tsticker t-c" initial={{ scale: 0 }} whileInView={{ scale: 1, rotate: -6 }} viewport={{ once: true }} transition={{ type: "spring", delay: 1.3 }}>
            <b>5</b><span>ospiti</span>
          </motion.div>
          <span className="scribble">appena ristrutturato! ✨</span>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CARD CHE SI IMPILANO ---------------- */
const STACK_BG = ["caramel", "sage", "sand", "ink"];

function StackCard({ a, i, n, p }) {
  const scale = useTransform(p, [i / n, 1], [1, 1 - (n - i - 1) * 0.05]);
  return (
    <motion.article className={`stack-card ${STACK_BG[i % 4]}`} style={{ scale, top: `calc(110px + ${i * 26}px)` }}>
      <div className="sc-text">
        <span className="sc-num">0{i + 1}</span>
        <h3>{a.title}</h3>
        <p>{a.text}</p>
        <span className="sc-tag">{a.tag}</span>
      </div>
      <div className="sc-img"><Img src={a.photo} alt={a.title} /></div>
    </motion.article>
  );
}

export function Stack() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section className="sec soft stack-sec">
      <div className="wrap">
        <Reveal className="head center">
          <span className="kicker">Perfetto per</span>
          <h2>Una casa, <em>tanti viaggi</em></h2>
        </Reveal>
        <div className="stack" ref={ref}>
          {AUDIENCE.map((a, i) => <StackCard key={a.title} a={a} i={i} n={AUDIENCE.length} p={p} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SKYLINE DI CITTÀ ALTA + AEREO ---------------- */
const SKY = "M0 200 L60 196 C120 190 150 170 210 168 L260 168 L262 150 L284 150 L284 168 L330 166 L332 120 L340 112 L348 120 L350 166 L400 162 L404 140 L430 140 L432 160 L470 158 C480 120 520 100 540 100 L540 70 L548 56 L556 70 L556 100 C576 100 612 120 620 156 L660 154 L662 60 L668 40 L676 40 L682 60 L684 154 L720 152 L722 130 C730 112 760 112 768 130 L770 150 L820 150 L824 110 L832 100 L840 110 L842 150 L900 152 L904 132 L930 132 L932 156 L990 160 C1050 166 1090 186 1160 190 L1240 196 L1300 200";
const FLIGHT = "M40 60 C 300 10, 520 120, 760 70 S 1150 20, 1240 150";

export function Skyline() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 0.9", "end 0.3"] });
  const s = useSpring(p, { stiffness: 80, damping: 24 });
  const draw = useTransform(s, [0, 0.6], [0, 1]);
  const fly = useTransform(s, [0.1, 0.95], ["0%", "100%"]);
  const trail = useTransform(s, [0.1, 0.95], [0, 1]);
  const pinS = useTransform(s, [0.85, 1], [0, 1]);
  return (
    <div className="skyline" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 1300 220" preserveAspectRatio="xMidYMax meet">
        <motion.path d={FLIGHT} className="flight" style={{ pathLength: trail }} />
        <motion.path d={SKY} className="sky" style={{ pathLength: draw }} />
      </svg>
      <motion.div className="plane" style={{ offsetPath: `path('${FLIGHT}')`, offsetDistance: fly }}>
        <Plane size={22} />
      </motion.div>
      <motion.div className="sky-pin" style={{ scale: pinS }}><MapPin size={14} /> Orio al Serio · 4 km</motion.div>
      <span className="sky-label">Città Alta</span>
    </div>
  );
}

/* ---------------- SCIA DI FOTO ---------------- */
const TRAIL = [P.living2, P.double2, P.kitchen2, P.sofa, P.bath2, P.twin2, P.living4, P.tv, P.dining, P.view];

export function Trail({ children, className = "" }) {
  const [items, setItems] = useState([]);
  const last = useRef({ x: 0, y: 0, n: 0 });
  const ref = useRef(null);
  const move = (e) => {
    if (isTouch()) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const d = Math.hypot(x - last.current.x, y - last.current.y);
    if (d < 90) return;
    last.current = { x, y, n: last.current.n + 1 };
    const id = last.current.n;
    setItems((it) => [...it.slice(-7), { id, x, y, src: TRAIL[id % TRAIL.length], r: (id % 2 ? 1 : -1) * (4 + (id % 5) * 2) }]);
    setTimeout(() => setItems((it) => it.filter((v) => v.id !== id)), 1100);
  };
  return (
    <div className={`trail ${className}`} ref={ref} onPointerMove={move}>
      <AnimatePresence>
        {items.map((it) => (
          <motion.div
            key={it.id}
            className="trail-img"
            style={{ left: it.x, top: it.y }}
            initial={{ opacity: 0, scale: 0.4, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: it.r }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <Img src={it.src} alt="" eager />
          </motion.div>
        ))}
      </AnimatePresence>
      {children}
    </div>
  );
}
