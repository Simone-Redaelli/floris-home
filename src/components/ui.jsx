import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  Wifi, Car, Snowflake, PawPrint, Tv, CookingPot, WashingMachine, Laptop, Circle,
} from "lucide-react";

const ICONS = { Wifi, Car, Snowflake, PawPrint, Tv, CookingPot, WashingMachine, Laptop, Circle };
export function Icon({ name, size = 22, ...rest }) {
  const C = ICONS[name] || Circle;
  return <C size={size} strokeWidth={1.4} {...rest} />;
}

export const EASE = [0.22, 1, 0.36, 1];
export const EASE_IO = [0.76, 0, 0.24, 1];

/* Immagine con fade-in al caricamento */
export function Img({ src, alt = "", className = "", eager, ...rest }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      className={`img ${loaded ? "is-loaded" : ""} ${className}`}
      {...rest}
    />
  );
}

/* Parole che salgono da una maschera (si osserva il contenitore, non le parole) */
export function MaskText({ children, delay = 0, as = "span", className = "", inView = true }) {
  const words = String(children).split(" ");
  const M = motion[as];
  const show = { transition: { staggerChildren: 0.045, delayChildren: delay } };
  const item = {
    hidden: { y: "115%", rotate: 4 },
    show: { y: 0, rotate: 0, transition: { duration: 1.1, ease: EASE } },
  };
  return (
    <M
      className={`mask-text ${className}`}
      initial="hidden"
      {...(inView ? { whileInView: "show", viewport: { once: true, amount: 0.2 } } : { animate: "show" })}
      variants={{ hidden: {}, show }}
    >
      {words.map((w, i) => (
        <span className="mt-word" key={i}>
          <motion.span variants={item}>{w}</motion.span>
        </span>
      ))}
    </M>
  );
}

export function Reveal({ children, delay = 0, y = 50, className = "", as = "div", ...rest }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </M>
  );
}

export function Counter({ value, decimals = 0, suffix = "", duration = 2.2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration, ease: EASE, onUpdate: setV });
    return () => c.stop();
  }, [inView, value, duration]);
  return (
    <span ref={ref} className="counter">
      {v.toFixed(decimals).replace(".", ",")}
      {suffix && <small>{suffix}</small>}
    </span>
  );
}

/* Elemento magnetico (segue leggermente il mouse) */
export function Magnetic({ children, className = "", strength = 0.35, as = "a", ...rest }) {
  const ref = useRef(null);
  const [p, setP] = useState({ x: 0, y: 0 });
  const M = motion[as];
  return (
    <M
      ref={ref}
      className={className}
      animate={{ x: p.x, y: p.y }}
      transition={{ type: "spring", stiffness: 180, damping: 14, mass: 0.4 }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        setP({ x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength });
      }}
      onMouseLeave={() => setP({ x: 0, y: 0 })}
      {...rest}
    >
      {children}
    </M>
  );
}

/* Card con riflesso che segue il mouse */
export function Spotlight({ children, className = "", ...rest }) {
  return (
    <div
      className={`spotlight ${className}`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Kicker({ children, n }) {
  return (
    <span className="kicker">
      {n && <i>{n}</i>}
      {children}
    </span>
  );
}
