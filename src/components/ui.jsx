import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  Wifi, Car, Snowflake, PawPrint, Tv, CookingPot, WashingMachine, Bath, Coffee, Laptop, Trees,
  BedDouble, LogIn, LogOut, CigaretteOff, PartyPopper, ShieldCheck, Circle, ImageIcon,
} from "lucide-react";

const Icons = {
  Wifi, Car, Snowflake, PawPrint, Tv, CookingPot, WashingMachine, Bath, Coffee, Laptop, Trees,
  BedDouble, LogIn, LogOut, CigaretteOff, PartyPopper, ShieldCheck, Circle, ImageIcon,
};

/* Icona per nome (stringa) */
export function Icon({ name, size = 22, ...rest }) {
  const C = Icons[name] || Icons.Circle;
  return <C size={size} strokeWidth={1.6} {...rest} />;
}

/* Foto con fallback a gradiente se il file non esiste */
export function Photo({ photo, className = "", children, eager }) {
  const [ok, setOk] = useState(true);
  const [a, b] = photo.tone;
  return (
    <div
      className={`photo ${className}`}
      style={{ background: `radial-gradient(120% 120% at 20% 10%, ${a}, ${b})` }}
    >
      {ok && (
        <img
          src={photo.src}
          alt={photo.label}
          loading={eager ? "eager" : "lazy"}
          onError={() => setOk(false)}
        />
      )}
      {!ok && (
        <div className="photo-ph">
          <Icons.ImageIcon size={28} strokeWidth={1.3} />
          <span>{photo.label}</span>
        </div>
      )}
      {children}
    </div>
  );
}

/* Titoli di sezione */
export function SectionHead({ kicker, title, sub, light }) {
  return (
    <Reveal className={`section-head ${light ? "light" : ""}`}>
      <span className="kicker">{kicker}</span>
      <h2 dangerouslySetInnerHTML={{ __html: title }} />
      {sub && <p>{sub}</p>}
    </Reveal>
  );
}

/* Animazione all'ingresso nel viewport */
export function Reveal({ children, delay = 0, y = 40, className = "", as = "div" }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

/* Contatore animato */
export function Counter({ value, decimals = 0, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (x) => setV(x),
    });
    return () => c.stop();
  }, [inView, value]);
  return (
    <span ref={ref}>
      {v.toFixed(decimals).replace(".", ",")}
      {suffix}
    </span>
  );
}

/* Testo che appare parola per parola */
export function SplitWords({ text, delay = 0, className = "" }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span className="word-wrap" key={i}>
          <motion.span
            className="word"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
          {" "}
        </span>
      ))}
    </span>
  );
}

/* Bottone magnetico */
export function Magnetic({ children, className = "", ...rest }) {
  const ref = useRef(null);
  const [p, setP] = useState({ x: 0, y: 0 });
  return (
    <motion.a
      ref={ref}
      className={className}
      animate={{ x: p.x, y: p.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        setP({ x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4 });
      }}
      onMouseLeave={() => setP({ x: 0, y: 0 })}
      {...rest}
    >
      {children}
    </motion.a>
  );
}
