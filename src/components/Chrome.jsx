import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Lenis from "lenis";
import { Star, X, Menu, CalendarDays } from "lucide-react";
import { useSettings, euro } from "../lib/settings";
import { scrollToId } from "../lib/booking";
import { EASE } from "./ui";

/* ---------------- SCROLL FLUIDO ---------------- */
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -20 } });
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
}

export const LINKS = [
  ["La casa", "#casa"],
  ["Tour", "#tour"],
  ["Servizi", "#servizi"],
  ["Recensioni", "#recensioni"],
  ["Bergamo", "#bergamo"],
];

/* ---------------- NAV FLOTTANTE ---------------- */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const prog = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    const f = () => setScrolled(scrollY > 30);
    f();
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
        className={`nav ${scrolled ? "scrolled" : ""}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
      >
        <a href="#top" className="brand">
          <span className="brand-mark">F</span>
          <span className="brand-name">Flori's <em>Home</em></span>
        </a>
        <nav className="nav-links">
          {LINKS.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
        </nav>
        <a href="#prenota" className="nav-cta">Prenota</a>
        <button className="burger" onClick={() => setOpen(true)} aria-label="Menu"><Menu size={22} /></button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div className="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="menu-close" onClick={() => setOpen(false)} aria-label="Chiudi"><X size={26} /></button>
            {[...LINKS, ["Prenota", "#prenota"]].map(([l, h], i) => (
              <motion.a
                key={h}
                href={h}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05, ease: EASE, duration: 0.6 }}
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

/* ---------------- BARRA PRENOTA (mobile) ---------------- */
export function MobileBar() {
  const { settings: s } = useSettings();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => {
      const book = document.getElementById("prenota");
      const r = book?.getBoundingClientRect();
      const inBook = r && r.top < innerHeight * 0.8 && r.bottom > 0;
      setShow(scrollY > innerHeight * 0.7 && !inBook);
    };
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="mbar" initial={{ y: 120 }} animate={{ y: 0 }} exit={{ y: 120 }} transition={{ type: "spring", stiffness: 260, damping: 28 }}>
          <div>
            <b>{euro(s.pricePerNight)}</b> <span>/ notte</span>
            <small><Star size={11} fill="currentColor" /> 9,1 · Superbo</small>
          </div>
          <button onClick={() => scrollToId("prenota")}><CalendarDays size={17} /> Scegli le date</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
