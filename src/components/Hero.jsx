import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Star, ArrowDownRight } from "lucide-react";
import { P, SITE, STATS, MANIFESTO } from "../data";
import { Img, Counter, Magnetic, EASE, EASE_IO } from "./ui";

/* ---------------- HERO ---------------- */
function Chars({ text, delay, ready, className }) {
  return (
    <span className={`chars ${className || ""}`}>
      {text.split("").map((c, i) => (
        <span className="ch-wrap" key={i}>
          <motion.span
            initial={{ y: "105%" }}
            animate={ready ? { y: 0 } : {}}
            transition={{ duration: 1.2, delay: delay + i * 0.05, ease: EASE }}
          >
            {c === " " ? " " : c}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Hero({ ready }) {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const s = useSpring(p, { stiffness: 120, damping: 30, mass: 0.3 });
  const mobile = typeof window !== "undefined" && window.innerWidth < 720;

  // zoom leggero: le foto originali sono piccole, non vanno ingrandite troppo
  const scale = useTransform(s, [0, 1], [1, 1.08]);
  const imgY = useTransform(s, [0, 1], ["0%", "6%"]);
  const frameY = useTransform(s, [0, 1], ["0%", "-8%"]);
  const titleY = useTransform(s, [0, 1], ["0%", "-30%"]);
  const homeX = useTransform(s, [0, 1], ["0%", "18%"]);
  const titleO = useTransform(s, [0, 0.6], [1, 0]);
  const infoO = useTransform(s, [0, 0.4], [1, 0]);

  const from = mobile ? "inset(30% 30% 50% 30% round 24px)" : "inset(35% 20% 35% 62% round 28px)";
  const to = mobile ? "inset(0% 0% 0% 0% round 24px)" : "inset(0% 0% 0% 0% round 28px)";

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero-stage">
        <motion.div className="hero-frame" style={{ y: frameY }}
          initial={{ clipPath: from }}
          animate={ready ? { clipPath: to } : {}}
          transition={{ duration: 1.7, ease: EASE_IO }}
        >
          <motion.div className="hero-img" style={{ scale, y: imgY }}>
            <motion.div
              className="hero-img-in"
              initial={{ scale: 1.25 }}
              animate={ready ? { scale: 1 } : {}}
              transition={{ duration: 2.2, ease: EASE_IO }}
            >
              <Img src={P.living} alt="Soggiorno di Flori's Home" eager />
            </motion.div>
          </motion.div>
          <div className="hero-shade" />
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.7, ease: EASE }}
          >
            <Star size={14} fill="currentColor" />
            <b>{String(SITE.rating).replace(".", ",")}</b> Superbo · {SITE.reviewsCount} recensioni
          </motion.div>
        </motion.div>

        <motion.div className="hero-left" style={{ opacity: titleO, y: titleY }}>
          <motion.span
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.9, ease: EASE }}
          >
            Appartamento · Bergamo
          </motion.span>
          <h1 className="hero-title">
            <Chars text="Flori's" delay={1.0} ready={ready} />
            <motion.span style={{ x: homeX }} className="ht-r">
              <Chars text="Home" delay={1.25} ready={ready} className="italic" />
            </motion.span>
          </h1>
          <motion.div className="hero-info" style={{ opacity: infoO }}>
            <motion.p
              className="hero-lead"
              initial={{ opacity: 0, y: 30 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.8, ease: EASE }}
            >
              80 m² di luce, due camere e un balcone sul verde. A quattro chilometri dal tuo volo.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={ready ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 2, ease: EASE }}
            >
              <Magnetic href="#prenota" className="round-cta" data-cursor="Prenota">
                <ArrowDownRight size={26} strokeWidth={1.3} />
                <svg viewBox="0 0 100 100" className="round-text">
                  <defs>
                    <path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                  </defs>
                  <text>
                    <textPath href="#circ">VERIFICA DISPONIBILITÀ • PRENOTA •</textPath>
                  </text>
                </svg>
              </Magnetic>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- STATS ---------------- */
export function Stats() {
  return (
    <section className="stats-band">
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          className="stat"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: i * 0.1, ease: EASE }}
        >
          <Counter value={s.value} suffix={s.suffix} />
          <span>{s.label}</span>
        </motion.div>
      ))}
    </section>
  );
}

/* ---------------- MANIFESTO (parole che si accendono) ---------------- */
function Word({ w, i, n, p }) {
  const start = i / n;
  const o = useTransform(p, [start * 0.85, start * 0.85 + 0.12], [0.13, 1]);
  const accent = /luce|verde|te,|Bergamo\./.test(w);
  return (
    <motion.span style={{ opacity: o }} className={accent ? "acc" : ""}>
      {w}{" "}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });
  const words = MANIFESTO.split(" ");
  const imgY = useTransform(p, [0, 1], [120, -120]);
  const imgR = useTransform(p, [0, 1], [-6, 4]);
  const img2Y = useTransform(p, [0, 1], [200, -200]);
  return (
    <section className="manifesto" ref={ref}>
      <motion.div className="mf-float f1" style={{ y: imgY, rotate: imgR }}>
        <Img src={P.details} alt="" />
      </motion.div>
      <motion.div className="mf-float f2" style={{ y: img2Y }}>
        <Img src={P.view} alt="" />
      </motion.div>
      <span className="kicker"><i>01</i>La casa</span>
      <p className="mf-text">
        {words.map((w, i) => <Word key={i} w={w} i={i} n={words.length} p={p} />)}
      </p>
    </section>
  );
}
