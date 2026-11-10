import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Sun, Moon, Cloud, CloudFog, CloudRain, CloudSnow, CloudLightning, CloudSun, Check } from "lucide-react";
import { useAmbient } from "../lib/ambient";
import { useLang } from "../i18n";

// numeri "casuali" ma sempre uguali (niente salti tra un render e l'altro)
const rnd = (i, s = 1) => { const x = Math.sin(i * 12.9898 * s + s * 78.233) * 43758.5453; return x - Math.floor(x); };

/* =================== METEO: chip + animazione =================== */
const ICON = { clear: Sun, cloudy: Cloud, fog: CloudFog, rain: CloudRain, snow: CloudSnow, storm: CloudLightning };

export function WeatherChip() {
  const { weather, phase } = useAmbient();
  const { t } = useLang();
  if (!weather) return null;
  const night = phase === "night";
  const I = weather.kind === "clear" ? (night ? Moon : phase === "sunset" ? CloudSun : Sun) : ICON[weather.kind] || Cloud;
  return (
    <motion.span className={`wx-chip wx-${weather.kind}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}>
      <I size={16} className="wx-ico" /> {t.wx.today} <b>{weather.temp}°</b> <span className="wx-sep">·</span> {t.wx.kinds[weather.kind]}
    </motion.span>
  );
}

export function WeatherFx() {
  const { weather, phase } = useAmbient();
  const reduce = useReducedMotion();
  const kind = weather?.kind || "clear";
  const drops = useMemo(() => Array.from({ length: 46 }, (_, i) => ({ l: rnd(i) * 100, d: 0.7 + rnd(i, 2) * 0.6, del: -rnd(i, 3) * 2, h: 40 + rnd(i, 4) * 50 })), []);
  const flakes = useMemo(() => Array.from({ length: 40 }, (_, i) => ({ l: rnd(i, 5) * 100, d: 9 + rnd(i, 6) * 7, del: -rnd(i, 7) * 14, s: 4 + rnd(i, 8) * 6, sw: 3 + rnd(i, 9) * 4 })), []);
  const stars = useMemo(() => Array.from({ length: 34 }, (_, i) => ({ l: rnd(i, 10) * 100, t: rnd(i, 11) * 45, s: 1.5 + rnd(i, 12) * 2.2, del: -rnd(i, 13) * 4 })), []);
  if (reduce) return null;
  const sky = kind === "clear" || kind === "cloudy";
  return (
    <div className={`wx-fx k-${kind}`} aria-hidden="true">
      {sky && phase === "night" && stars.map((s, i) => <i key={i} className="wx-star" style={{ left: `${s.l}%`, top: `${s.t}%`, width: s.s, height: s.s, animationDelay: `${s.del}s` }} />)}
      {kind === "clear" && phase !== "night" && <span className={`wx-sun p-${phase}`}><i /></span>}
      {(kind === "cloudy" || kind === "rain" || kind === "storm" || kind === "fog") && (
        <>
          <span className="wx-cloud c1" /><span className="wx-cloud c2" /><span className="wx-cloud c3" />
        </>
      )}
      {kind === "fog" && <><span className="wx-fog f1" /><span className="wx-fog f2" /></>}
      {(kind === "rain" || kind === "storm") && drops.map((d, i) => <i key={i} className="wx-drop" style={{ left: `${d.l}%`, height: d.h, animationDuration: `${d.d}s`, animationDelay: `${d.del}s` }} />)}
      {kind === "storm" && <span className="wx-flash" />}
      {kind === "snow" && flakes.map((f, i) => (
        <i key={i} className="wx-flake" style={{ left: `${f.l}%`, width: f.s, height: f.s, animationDuration: `${f.d}s, ${f.sw}s`, animationDelay: `${f.del}s, ${f.del}s` }} />
      ))}
    </div>
  );
}

/* =================== TITOLI SCRITTI A MANO =================== */
export function Handwrite({ text, delay = 0, speed = 0.055 }) {
  const reduce = useReducedMotion();
  const str = String(text ?? "");
  if (reduce) return <>{str}</>;
  const words = str.split(" ");
  let n = 0;
  const total = [...str.replace(/ /g, "")].length;
  return (
    <motion.span className="hw" initial="hide" whileInView="show" viewport={{ once: true, margin: "-8% 0px" }} aria-label={str}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden="true">
          <span className="hw-word">
            {[...w].map((ch) => {
              const i = n++;
              return (
                <motion.span
                  key={i}
                  className="hw-ch"
                  variants={{
                    hide: { clipPath: "inset(-25% 100% -35% -20%)" },
                    show: { clipPath: "inset(-25% -20% -35% -20%)", transition: { duration: 0.2, delay: delay + i * speed, ease: "easeOut" } },
                  }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
      <svg className="hw-line" viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true">
        <motion.path
          d="M3 11 C 48 3, 112 16, 197 6"
          variants={{ hide: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: { duration: 0.55, delay: delay + total * speed + 0.05, ease: "easeInOut" } } }}
        />
      </svg>
    </motion.span>
  );
}

/* "Titolo <em>corsivo</em>" → titolo + corsivo scritto a mano */
export function HandTitle({ html, delay = 0 }) {
  const m = /^([\s\S]*?)<em>([\s\S]*?)<\/em>([\s\S]*)$/.exec(String(html || ""));
  if (!m) return <span dangerouslySetInnerHTML={{ __html: html }} />;
  return <>{m[1]}<em><Handwrite text={m[2]} delay={delay} /></em>{m[3]}</>;
}

/* =================== PULSANTI MAGNETICI =================== */
export function useMagnetic(strength = 0.32) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 16, mass: 0.4 });
  const fine = typeof window !== "undefined" && window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
  if (reduce || !fine) return {};
  return {
    style: { x: sx, y: sy },
    onPointerMove: (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      x.set((e.clientX - (r.left + r.width / 2)) * strength);
      y.set((e.clientY - (r.top + r.height / 2)) * strength);
    },
    onPointerLeave: () => { x.set(0); y.set(0); },
  };
}

/* il magnete si sente già avvicinandosi: area invisibile intorno al pulsante */
export function Magnetic({ children, strength = 0.3, className = "" }) {
  const m = useMagnetic(strength);
  const reach = useRef(null);
  if (!m.style) return children;
  return (
    <span className={`mag ${className}`} ref={reach} onPointerMove={m.onPointerMove} onPointerLeave={m.onPointerLeave}>
      <motion.span className="mag-in" style={m.style}>{children}</motion.span>
    </span>
  );
}

/* =================== CHIAVE CHE GIRA + CORIANDOLI =================== */
const CONF_COLORS = ["#b5794a", "#e0a96d", "#7f927c", "#d48a6a", "#221d18", "#f2c94c"];

function Confetti({ delay = 1.1, count = 42 }) {
  const bits = useMemo(() => Array.from({ length: count }, (_, i) => {
    const a = rnd(i, 21) * Math.PI * 2;
    const d = 90 + rnd(i, 22) * 150;
    return { x: Math.cos(a) * d, y: Math.sin(a) * d * 0.7 - 50, r: rnd(i, 23) * 720 - 360, c: CONF_COLORS[i % CONF_COLORS.length], w: 6 + rnd(i, 24) * 6, round: i % 3 === 0 };
  }), [count]);
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <motion.i
          key={i}
          style={{ background: b.c, width: b.w, height: b.round ? b.w : b.w * 0.45, borderRadius: b.round ? "50%" : 2 }}
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.4 }}
          animate={{ x: [0, b.x], y: [0, b.y, b.y + 160], opacity: [0, 1, 1, 0], rotate: b.r, scale: 1 }}
          transition={{ duration: 1.8, delay: delay + rnd(i, 25) * 0.12, ease: [0.2, 0.7, 0.4, 1], times: [0, 0.45, 1], opacity: { times: [0, 0.05, 0.75, 1], duration: 1.8, delay } }}
        />
      ))}
    </div>
  );
}

export function KeyDone() {
  const reduce = useReducedMotion();
  if (reduce) return <div className="done-ico"><Check size={34} /></div>;
  return (
    <div className="key-done" aria-hidden="true">
      <Confetti />
      <motion.div
        className="kd-plate"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.6, 1, 1, 1.08, 1], opacity: 1, backgroundColor: ["#f6ead9", "#f6ead9", "#f6ead9", "#7f927c", "#7f927c"] }}
        transition={{ duration: 1.7, times: [0, 0.2, 0.62, 0.78, 1] }}
      >
        <motion.svg className="kd-hole" viewBox="0 0 40 40" animate={{ opacity: [1, 1, 0] }} transition={{ duration: 1.4, times: [0, 0.85, 1] }}>
          <circle cx="20" cy="15" r="6" /><path d="M16.5 18 L14 31 H26 L23.5 18 Z" />
        </motion.svg>
        <motion.svg
          className="kd-key"
          viewBox="0 0 120 40"
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: [-120, -34, -34, -34], opacity: [0, 1, 1, 0], scaleY: [1, 1, 0.18, 1] }}
          transition={{ duration: 1.35, times: [0, 0.4, 0.62, 1], ease: "easeInOut" }}
        >
          <circle cx="18" cy="20" r="14" fill="none" strokeWidth="6" />
          <path d="M32 20 H104 M84 20 V31 M96 20 V29" fill="none" strokeWidth="6" strokeLinecap="round" />
        </motion.svg>
        <motion.span className="kd-check" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 1.3, stiffness: 260, damping: 14 }}>
          <Check size={36} strokeWidth={2.6} />
        </motion.span>
      </motion.div>
    </div>
  );
}

/* =================== CONTO ALLA ROVESCIA (guida ospiti) =================== */
const romeToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());
const diffDays = (a, b) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 864e5);

function Suitcase() {
  return (
    <svg className="suitcase" viewBox="0 0 120 120" aria-hidden="true">
      <motion.g className="sc-bounce">
        <rect x="16" y="44" width="88" height="62" rx="12" className="sc-body" />
        <rect x="16" y="44" width="88" height="62" rx="12" className="sc-stripe" />
        <motion.g style={{ originX: "16px", originY: "44px" }} initial={{ rotate: -38 }} animate={{ rotate: 0 }} transition={{ type: "spring", stiffness: 140, damping: 11, delay: 0.5 }}>
          <path d="M28 44 V34 a8 8 0 0 1 8 -8 H84 a8 8 0 0 1 8 8 V44" className="sc-handle" />
          <rect x="12" y="40" width="96" height="12" rx="6" className="sc-lid" />
        </motion.g>
        <motion.rect x="40" y="48" width="10" height="9" rx="2" className="sc-clasp" initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1, type: "spring" }} />
        <motion.rect x="70" y="48" width="10" height="9" rx="2" className="sc-clasp" initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1, type: "spring" }} />
        <circle cx="38" cy="78" r="9" className="sc-sticker a" />
        <rect x="64" y="70" width="24" height="14" rx="3" className="sc-sticker b" />
        <circle cx="34" cy="108" r="5" className="sc-wheel" /><circle cx="86" cy="108" r="5" className="sc-wheel" />
      </motion.g>
    </svg>
  );
}

export function Countdown({ from, to, checkIn }) {
  const { t } = useLang();
  const g = t.guide;
  const [today, setToday] = useState(romeToday);
  useEffect(() => { const id = setInterval(() => setToday(romeToday()), 60_000); return () => clearInterval(id); }, []);
  if (!from || !to) return null;
  const until = diffDays(today, from);
  const nights = Math.max(1, diffDays(from, to));
  let text;
  if (until > 1) text = g.cdDays(until);
  else if (until === 1) text = g.cdTomorrow;
  else if (until === 0) text = g.cdToday(checkIn);
  else if (today < to) text = g.cdStay(-until + 1, nights);
  else text = g.cdAfter;
  return (
    <motion.div className="cd" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Suitcase />
      <div>
        {until > 1 && <b className="cd-num">{until}</b>}
        <span>{text}</span>
      </div>
    </motion.div>
  );
}

/* =================== SKYLINE: sole, luna, stelle e finestre =================== */
export function SkyDecor({ pathRef }) {
  const { phase } = useAmbient();
  const [wins, setWins] = useState([]);
  useEffect(() => {
    const p = pathRef.current;
    if (!p?.getTotalLength) return;
    // cerco il punto più alto del profilo per ogni x, poi accendo le finestre dentro gli edifici
    const len = p.getTotalLength();
    const top = new Map();
    for (let i = 0; i <= 900; i++) {
      const pt = p.getPointAtLength((i / 900) * len);
      const x = Math.round(pt.x / 6) * 6;
      top.set(x, Math.min(top.get(x) ?? 999, pt.y));
    }
    const out = [];
    let k = 0;
    for (const [x, y] of [...top.entries()].sort((a, b) => a[0] - b[0])) {
      if (y > 176 || x < 10 || x > 1290) continue;
      for (let wy = y + 8; wy < 194; wy += 10) {
        k++;
        if (rnd(k, 31) < 0.3) out.push({ x: x - 1.5, y: wy, on: rnd(k, 32), d: rnd(k, 33) * 3 });
      }
    }
    setWins(out.slice(0, 260));
  }, [pathRef]);
  const stars = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ x: 30 + rnd(i, 41) * 1240, y: 8 + rnd(i, 42) * 90, r: 0.8 + rnd(i, 43) * 1.4, d: rnd(i, 44) * 4 })), []);
  return (
    <g className={`skydecor p-${phase}`}>
      <defs>
        <clipPath id="sky-horizon"><rect x="-50" y="-60" width="1400" height="258" /></clipPath>
        <radialGradient id="sun-g"><stop offset="0%" stopColor="#ffe1a8" /><stop offset="60%" stopColor="#f6b26b" /><stop offset="100%" stopColor="#f6b26b" stopOpacity="0" /></radialGradient>
      </defs>
      <g clipPath="url(#sky-horizon)">
        <circle className="sd-sun" r="34" fill="url(#sun-g)" />
      </g>
      <g className="sd-moon" transform="translate(1110 46)">
        <circle r="17" className="moon-disc" />
        <circle r="15" cx="8" cy="-5" className="moon-cut" />
      </g>
      {stars.map((s, i) => <circle key={i} className="sd-star" cx={s.x} cy={s.y} r={s.r} style={{ animationDelay: `${-s.d}s` }} />)}
      {wins.map((w, i) => (
        <rect key={i} className={`sd-win ${w.on < 0.45 ? "early" : ""}`} x={w.x} y={w.y} width="3.5" height="4.5" rx="0.6" style={{ transitionDelay: `${w.d}s` }} />
      ))}
    </g>
  );
}
