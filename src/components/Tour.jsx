import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { PHOTOS, TOUR } from "../data";
import { Photo } from "./ui";

/*
  TOUR A SCORRIMENTO
  La sezione è alta N schermi; il contenuto resta "sticky".
  Lo scroll fa avanzare la telecamera dentro ogni stanza (zoom + pan)
  e la stanza successiva si apre attraverso una porta ad arco.
*/

const DOOR_FAR = "inset(40% 45% 26% 45% round 260px 260px 4px 4px)";
const DOOR_CLOSED = "inset(30% 37% 16% 37% round 260px 260px 4px 4px)";
const DOOR_OPEN = "inset(0% 0% 0% 0% round 0px 0px 0px 0px)";

function Room({ room, i, n, p }) {
  const seg = 1 / n;
  const s = i * seg;
  const e = s + seg;
  const enterA = s - seg * 0.45;
  const dir = i % 2 ? -1 : 1;

  // apertura porta (non per la prima stanza)
  const farA = enterA - seg * 0.2;
  const clip = useTransform(
    p,
    [farA, enterA, s],
    i === 0 ? [DOOR_OPEN, DOOR_OPEN, DOOR_OPEN] : [DOOR_FAR, DOOR_CLOSED, DOOR_OPEN]
  );
  // la porta compare solo quando ti avvicini
  const visible = useTransform(p, [farA - seg * 0.02, farA + seg * 0.06], i === 0 ? [1, 1] : [0, 1]);
  // la telecamera avanza sempre: scala crescente
  const scale = useTransform(p, [farA, s, e + seg * 0.45], [0.95, 1.1, 1.55]);
  const x = useTransform(p, [s, e + seg * 0.45], ["0%", `${dir * 4}%`]);
  // mentre si avvicina alla porta successiva la stanza si scurisce
  const shade = useTransform(p, [e - seg * 0.5, e], [0, 0.65]);
  // bagliore della cornice della porta
  const frame = useTransform(p, [enterA, enterA + seg * 0.1, s - seg * 0.08, s], [0, 1, 1, 0]);

  // testi
  const tIn = s + seg * 0.04;
  const tOut = i === n - 1 ? 2 : e - seg * 0.3;
  const tOpacity = useTransform(p, [tIn, tIn + seg * 0.18, tOut, tOut + seg * 0.12], [0, 1, 1, 0]);
  const tY = useTransform(p, [tIn, tIn + seg * 0.18, tOut, tOut + seg * 0.12], [60, 0, 0, -50]);
  const numX = useTransform(p, [s, e], ["0%", "-30%"]);

  return (
    <motion.div className="room" style={{ zIndex: i + 1, opacity: visible }}>
      <motion.div className="room-door" style={{ clipPath: clip, WebkitClipPath: clip }}>
        <motion.div className="room-cam" style={{ scale, x }}>
          <Photo photo={PHOTOS[room.photo]} />
        </motion.div>
        <motion.div className="room-shade" style={{ opacity: shade }} />
        <div className="room-veil" />
      </motion.div>

      {i > 0 && <motion.div className="door-frame" style={{ opacity: frame, clipPath: clip }} />}

      <motion.span className="room-num" style={{ opacity: tOpacity, x: numX }}>
        0{i + 1}
      </motion.span>

      <motion.div className="room-text" style={{ opacity: tOpacity, y: tY }}>
        <span className="kicker">{room.kicker}</span>
        <h3>{room.title}</h3>
        <p>{room.text}</p>
        {room.tags && (
          <div className="tags">
            {room.tags.map((t) => <span key={t}>{t}</span>)}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Tour() {
  const ref = useRef(null);
  const n = TOUR.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.35 });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n + 0.15))));
  });

  const bar = useTransform(p, [0, 1], ["0%", "100%"]);
  const hint = useTransform(p, [0, 0.06], [1, 0]);

  const jump = (i) => {
    const el = ref.current;
    const top = el.offsetTop + (el.offsetHeight - window.innerHeight) * ((i + 0.12) / n);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section ref={ref} className="tour" id="tour" style={{ height: `${n * 130}vh` }}>
      <div className="tour-sticky">
        {TOUR.map((r, i) => (
          <Room key={r.id} room={r} i={i} n={n} p={p} />
        ))}

        {/* HUD */}
        <div className="tour-hud">
          <div className="tour-rail">
            <motion.i style={{ height: bar }} />
          </div>
          <ul>
            {TOUR.map((r, i) => (
              <li key={r.id} className={i === active ? "on" : i < active ? "done" : ""}>
                <button onClick={() => jump(i)}>
                  <b>0{i + 1}</b>
                  <span>{r.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="tour-count">
          <motion.b key={active} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            0{active + 1}
          </motion.b>
          <span>/ 0{n}</span>
        </div>

        <motion.div className="tour-hint" style={{ opacity: hint }}>
          <span className="mouse"><i /></span>
          Scorri per entrare in casa
        </motion.div>
      </div>
    </section>
  );
}
