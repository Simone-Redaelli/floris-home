import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { BellRing, ChevronDown } from "lucide-react";
import { P } from "../data";
import { Img, EASE } from "./ui";

/* Pianta in vaso disegnata in SVG */
function Plant({ className, flip }) {
  return (
    <svg className={className} viewBox="0 0 120 220" style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden="true">
      <g className="leaves">
        <path d="M60 140 C 40 110, 10 100, 6 70 C 30 76, 52 96, 60 130 Z" fill="#7f927c" />
        <path d="M60 140 C 78 104, 104 96, 114 62 C 88 70, 68 92, 60 132 Z" fill="#93a68f" />
        <path d="M60 140 C 50 96, 54 52, 72 18 C 82 52, 72 100, 62 138 Z" fill="#6c8068" />
        <path d="M60 140 C 30 120, 18 140, 2 120 C 24 108, 46 114, 60 134 Z" fill="#5f735c" />
        <path d="M60 140 C 88 124, 102 144, 118 124 C 96 110, 74 118, 60 134 Z" fill="#7f927c" />
      </g>
      <path d="M30 140 H90 L82 210 Q60 218 38 210 Z" fill="#d8b08b" />
      <path d="M26 136 H94 V150 H26 Z" fill="#c48f62" rx="3" />
    </svg>
  );
}

function Leaf({ side }) {
  return (
    <div className={`leaf ${side}`}>
      <div className="leaf-wood">
        <span className="panel top" />
        <span className="panel mid" />
        <span className="panel bot" />
        <span className="handle" />
      </div>
      <div className="leaf-back" />
    </div>
  );
}

export default function Door() {
  const ref = useRef(null);
  const [rang, setRang] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.4 });

  const lRot = useTransform(p, [0.06, 0.42], [0, -108]);
  const rRot = useTransform(p, [0.06, 0.42], [0, 108]);
  const sceneScale = useTransform(p, [0.36, 0.9], [1, 3.4]);
  const sceneY = useTransform(p, [0.36, 0.9], ["0%", "6%"]);
  const insideScale = useTransform(p, [0.05, 0.55], [1.35, 1]);
  const light = useTransform(p, [0.05, 0.35], [0, 1]);
  const textO = useTransform(p, [0, 0.12], [1, 0]);
  const textY = useTransform(p, [0, 0.12], [0, -40]);
  const decoO = useTransform(p, [0.35, 0.6], [1, 0]);
  const fade = useTransform(p, [0.6, 0.86], [1, 0]);

  const ring = () => {
    setRang(true);
    setTimeout(() => setRang(false), 700);
    const el = ref.current;
    const target = el.offsetTop + (el.offsetHeight - innerHeight) * 0.5;
    setTimeout(() => {
      window.__lenis ? window.__lenis.scrollTo(target, { duration: 2.4 }) : scrollTo({ top: target, behavior: "smooth" });
    }, 350);
  };

  return (
    <section className="door-sec" ref={ref} id="porta">
      <motion.div className="door-sticky" style={{ opacity: fade }}>
        <div className="wall" />
        <motion.div className="door-text" style={{ opacity: textO, y: textY }}>
          <motion.span className="door-eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }}>
            Via San Pio X, 16 · Bergamo
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.35, ease: EASE }}>
            Benvenuti a <em>casa</em>
          </motion.h1>
        </motion.div>

        <motion.div className="door-scene" style={{ scale: sceneScale, y: sceneY }}>
          <motion.div className="lamp" style={{ opacity: decoO }}>
            <span className="lamp-arm" /><span className="lamp-glass" /><span className="lamp-glow" />
          </motion.div>

          <div className="door-frame">
            <div className="door-inside">
              <motion.div className="door-photo" style={{ scale: insideScale }}>
                <Img src={P.living} alt="Il soggiorno di Flori's Home" eager />
              </motion.div>
              <motion.div className="door-light" style={{ opacity: light }} />
            </div>
            <motion.div className="leaf-wrap l" style={{ rotateY: lRot }}><Leaf side="l" /></motion.div>
            <motion.div className="leaf-wrap r" style={{ rotateY: rRot }}><Leaf side="r" /></motion.div>
            <motion.div className="plaque" style={{ opacity: decoO }}><small>Flori's Home</small>16</motion.div>
          </div>

          <motion.div className="step" style={{ opacity: decoO }} />
          <motion.div className="mat" style={{ opacity: decoO }}>Benvenuti</motion.div>
          <motion.div style={{ opacity: decoO }}>
            <Plant className="plant pl" />
            <Plant className="plant pr" flip />
          </motion.div>

          <motion.button
            className={`bell ${rang ? "ring" : ""}`}
            style={{ opacity: decoO }}
            onClick={ring}
            aria-label="Suona il campanello e apri la porta"
            data-cursor="Suona"
          >
            <BellRing size={16} />
          </motion.button>
        </motion.div>

        <motion.div className="door-hint" style={{ opacity: textO }}>
          <button onClick={ring}>Suona il campanello</button>
          <span>oppure scorri per entrare <ChevronDown size={16} /></span>
        </motion.div>
      </motion.div>
    </section>
  );
}
