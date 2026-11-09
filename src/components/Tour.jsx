import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { TOUR } from "../data";
import { Img } from "./ui";

/*
  TOUR IMMERSIVO
  La sezione resta ferma a schermo: scorrendo la "telecamera" avanza nella stanza,
  in fondo appare una porta ad arco che si avvicina e si apre sulla stanza successiva.
*/
const DOOR_FAR = "inset(36% 42% 18% 42% round 400px 400px 8px 8px)";
const DOOR_CLOSED = "inset(18% 32% 6% 32% round 400px 400px 8px 8px)";
const DOOR_OPEN = "inset(0% 0% 0% 0% round 26px 26px 26px 26px)";

function Room({ room, i, n, p }) {
  const seg = 1 / n;
  const s = i * seg;
  const e = s + seg;
  const enterA = s - seg * 0.42;
  const farA = enterA - seg * 0.22;
  const first = i === 0;
  const dir = i % 2 ? -1 : 1;

  const clip = useTransform(p, [farA, enterA, s], first ? [DOOR_OPEN, DOOR_OPEN, DOOR_OPEN] : [DOOR_FAR, DOOR_CLOSED, DOOR_OPEN]);
  const visible = useTransform(p, [farA - seg * 0.02, farA + seg * 0.06], first ? [1, 1] : [0, 1]);
  const scale = useTransform(p, [farA, s, e + seg * 0.4], [0.96, 1.02, 1.14]);
  const x = useTransform(p, [s, e + seg * 0.4], ["0%", `${dir * 1.5}%`]);
  const rot = useTransform(p, [s, e + seg * 0.4], [0, dir * 0.4]);
  const shade = useTransform(p, [e - seg * 0.55, e], [0, 0.35]);
  const last = i === n - 1;
  // le stanze lontane o già superate non vengono proprio disegnate
  const vis = useTransform(p, (v) =>
    (!first && v < farA - seg * 0.03) || (!last && v > e + seg * 0.15) ? "hidden" : "visible"
  );
  const glow = useTransform(p, [farA, enterA, s - seg * 0.06, s], [0, 1, 1, 0]);

  const tIn = s + seg * 0.02;
  const tOut = i === n - 1 ? 2 : e - seg * 0.32;
  const o = useTransform(p, [tIn, tIn + seg * 0.16, tOut, tOut + seg * 0.1], [0, 1, 1, 0]);
  const y = useTransform(p, [tIn, tIn + seg * 0.16, tOut, tOut + seg * 0.1], [80, 0, 0, -60]);
  const titleX = useTransform(p, [s, e], ["0%", "-2%"]);

  return (
    <motion.div className="room" style={{ zIndex: i + 1, opacity: visible, visibility: vis }}>
      <motion.div className="room-door" style={{ clipPath: clip, WebkitClipPath: clip }}>
        <motion.div className="room-cam" style={{ scale, x, rotate: rot }}>
          <Img src={room.photo} alt={room.title} />
        </motion.div>
        <motion.div className="room-shade" style={{ opacity: shade }} />
        <div className="room-veil" />
      </motion.div>
      {!first && <motion.div className="door-glow" style={{ opacity: glow, clipPath: clip, WebkitClipPath: clip }} />}

      <motion.div className="room-text" style={{ opacity: o, y }}>
        <span className="room-kicker"><i>0{i + 1}</i>{room.kicker}</span>
        <motion.h3 style={{ x: titleX }}>{room.title}</motion.h3>
        <p>{room.text}</p>
        <div className="chips">
          {room.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Tour() {
  const ref = useRef(null);
  const n = TOUR.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 100, damping: 26, mass: 0.35 });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n + 0.12))));
  });

  const bar = useTransform(p, [0, 1], ["0%", "100%"]);
  const hint = useTransform(p, [0, 0.05], [1, 0]);

  const jump = (i) => {
    const el = ref.current;
    const top = el.offsetTop + (el.offsetHeight - innerHeight) * ((i + 0.1) / n);
    window.__lenis ? window.__lenis.scrollTo(top, { duration: 1.6 }) : scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section ref={ref} className="tour" id="tour" style={{ height: `${n * 140}vh` }}>
      <div className="tour-sticky">
        {TOUR.map((r, i) => <Room key={r.id} room={r} i={i} n={n} p={p} />)}

        <div className="tour-top">
          <span className="kicker light"><i>02</i>Il tour</span>
          <div className="tour-count">
            <AnimatePresence mode="popLayout">
              <motion.b
                key={active}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                0{active + 1}
              </motion.b>
            </AnimatePresence>
            <span>/ 0{n}</span>
          </div>
        </div>

        <div className="tour-nav">
          {TOUR.map((r, i) => (
            <button
              key={r.id}
              className={i === active ? "on" : i < active ? "done" : ""}
              onClick={() => jump(i)}
              data-cursor="Vai"
            >
              <span>{r.title}</span>
            </button>
          ))}
          <div className="tour-bar"><motion.i style={{ width: bar }} /></div>
        </div>

        <motion.div className="tour-hint" style={{ opacity: hint }}>
          Scorri per entrare in casa <i />
        </motion.div>
      </div>
    </section>
  );
}
