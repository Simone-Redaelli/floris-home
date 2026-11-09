import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, animate } from "framer-motion";
import Lenis from "lenis";
import { P } from "../data";
import { EASE, EASE_IO } from "./ui";

/* ---------------- SMOOTH SCROLL ---------------- */
export function useSmoothScroll(enabled) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.085, anchors: { offset: -20 }, wheelMultiplier: 1 });
    window.__lenis = lenis;
    let id;
    const raf = (t) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);
  useEffect(() => {
    const l = window.__lenis;
    if (!l) return;
    enabled ? l.start() : l.stop();
  }, [enabled]);
}

/* ---------------- PRELOADER ---------------- */
export function Preloader({ onDone }) {
  const [n, setN] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const img = new Image();
    let imgReady = false;
    img.onload = img.onerror = () => (imgReady = true);
    img.src = P.living;

    const c = animate(0, 100, {
      duration: 2.4,
      ease: [0.6, 0, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => {
        const finish = () => {
          setOut(true);
          setTimeout(onDone, 700);
        };
        if (imgReady) finish();
        else {
          const t = setInterval(() => imgReady && (clearInterval(t), finish()), 100);
          setTimeout(() => (clearInterval(t), finish()), 2500);
        }
      },
    });
    return () => c.stop();
  }, [onDone]);

  return (
    <AnimatePresence>
      {!out && (
        <motion.div
          className="preloader"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1.1, ease: EASE_IO }}
        >
          <div className="pre-top">
            <span>Flori's Home</span>
            <span>Bergamo — IT</span>
          </div>
          <div className="pre-word">
            {"Benvenuti".split("").map((c, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.15 + i * 0.05, ease: EASE }}
              >
                {c}
              </motion.span>
            ))}
          </div>
          <div className="pre-bottom">
            <div className="pre-bar"><i style={{ transform: `scaleX(${n / 100})` }} /></div>
            <span className="pre-num">{String(n).padStart(3, "0")}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- CURSORE ---------------- */
export function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [label, setLabel] = useState("");
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, id;
    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px,${my}px,0)`;
    };
    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      id = requestAnimationFrame(loop);
    };
    const over = (e) => {
      const t = e.target.closest("[data-cursor], a, button, input, label");
      setHover(!!t);
      setLabel(t?.dataset?.cursor || "");
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);
    addEventListener("pointermove", move);
    addEventListener("mouseover", over);
    addEventListener("pointerdown", dn);
    addEventListener("pointerup", up);
    loop();
    return () => {
      cancelAnimationFrame(id);
      removeEventListener("pointermove", move);
      removeEventListener("mouseover", over);
      removeEventListener("pointerdown", dn);
      removeEventListener("pointerup", up);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} className={`cur-ring ${hover ? "hover" : ""} ${label ? "label" : ""} ${down ? "down" : ""}`}>
        <span>{label}</span>
      </div>
      <div ref={dot} className={`cur-dot ${label ? "hide" : ""}`} />
    </>
  );
}

/* ---------------- NAV ---------------- */
export const LINKS = [
  ["La casa", "#tour"],
  ["Galleria", "#galleria"],
  ["Servizi", "#servizi"],
  ["Bergamo", "#bergamo"],
  ["Recensioni", "#recensioni"],
];

export function Nav({ ready }) {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const prog = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    let last = 0;
    const f = () => {
      const y = scrollY;
      setSolid(y > 60);
      setHidden(y > 400 && y > last);
      last = y;
    };
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    const l = window.__lenis;
    if (l) open ? l.stop() : l.start();
  }, [open]);

  return (
    <>
      <motion.div className="progress" style={{ scaleX: prog }} />
      <motion.header
        className={`nav ${solid ? "solid" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: ready && !hidden ? 0 : -100 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <a href="#top" className="brand">
          <span className="brand-mark">F</span>
          <span className="brand-name">Flori's <em>Home</em></span>
        </a>
        <nav className="nav-links">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h}><span data-text={l}>{l}</span></a>
          ))}
        </nav>
        <a href="#prenota" className="pill-btn">
          <span className="dot" /> Prenota
        </a>
        <button className={`burger ${open ? "x" : ""}`} onClick={() => setOpen(!open)} aria-label="Menu">
          <i /><i />
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE_IO }}
          >
            <div className="menu-links">
              {[...LINKS, ["Prenota", "#prenota"]].map(([l, h], i) => (
                <div className="mt-word" key={h}>
                  <motion.a
                    href={h}
                    onClick={() => setOpen(false)}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.8, delay: 0.25 + i * 0.05, ease: EASE }}
                  >
                    <small>0{i + 1}</small>{l}
                  </motion.a>
                </div>
              ))}
            </div>
            <div className="menu-foot">
              <span>Via San Pio X, 16 — Bergamo</span>
              <span>9,1 · Superbo</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
