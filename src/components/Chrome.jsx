import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Lenis from "lenis";
import { Star, X, Menu, CalendarDays } from "lucide-react";
import { useSettings, euro } from "../lib/settings";
import { scrollToId } from "../lib/booking";
import { EASE } from "./ui";
import { useLang, LANGS } from "../i18n";
import { Magnetic } from "./Fx";

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

const HREFS = ["#casa", "#tour", "#servizi", "#recensioni", "#bergamo", "#attivita"];
export const useLinks = () => {
  const { t } = useLang();
  return HREFS.map((h, i) => [t.nav.links[i], h]);
};

/* ---------------- SELETTORE LINGUA ---------------- */
export function LangSwitch({ big }) {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const cur = LANGS.find((l) => l.code === lang);
  useEffect(() => {
    if (!open) return;
    const close = (e) => !e.target.closest(".lang") && setOpen(false);
    addEventListener("pointerdown", close);
    return () => removeEventListener("pointerdown", close);
  }, [open]);
  if (big) {
    return (
      <div className="lang-row" aria-label={t.nav.lang}>
        {LANGS.map((l) => (
          <button key={l.code} className={l.code === lang ? "on" : ""} onClick={() => setLang(l.code)}>
            <span>{l.flag}</span>{l.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="lang">
      <button className="lang-btn" onClick={() => setOpen(!open)} aria-label={t.nav.lang} aria-expanded={open}>
        <span className="flag">{cur.flag}</span>{cur.code.toUpperCase()}
        <motion.i animate={{ rotate: open ? 180 : 0 }}>▾</motion.i>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="lang-menu" initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.2 }}>
            {LANGS.map((l) => (
              <button key={l.code} className={l.code === lang ? "on" : ""} onClick={() => { setLang(l.code); setOpen(false); }}>
                <span className="flag">{l.flag}</span>{l.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- NAV FLOTTANTE ---------------- */
export function Nav() {
  const { t } = useLang();
  const LINKS = useLinks();
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
        <LangSwitch />
        <Magnetic strength={0.35}><a href="#prenota" className="nav-cta">{t.nav.book}</a></Magnetic>
        <button className="burger" onClick={() => setOpen(true)} aria-label={t.nav.menu}><Menu size={22} /></button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div className="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="menu-close" onClick={() => setOpen(false)} aria-label={t.nav.close}><X size={26} /></button>
            {[...LINKS, [t.nav.book, "#prenota"]].map(([l, h], i) => (
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
            <LangSwitch big />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- BARRA PRENOTA (mobile) ---------------- */
export function MobileBar() {
  const { t } = useLang();
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
            <b>{euro(s.pricePerNight)}</b> <span>{t.mbar.perNight}</span>
            <small><Star size={11} fill="currentColor" /> 9,1 · {t.mbar.superb}</small>
          </div>
          <button onClick={() => scrollToId("prenota")}><CalendarDays size={17} /> {t.mbar.cta}</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
