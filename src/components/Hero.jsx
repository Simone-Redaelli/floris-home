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

  const scale = useTransform(s, [0, 1], [1.08, 1.45]);
  const imgY = useTransform(s, [0, 1], ["0%", "12%"]);
  const shade = useTransform(s, [0, 0.8], [0.25, 0.85]);
  const leftX = useTransform(s, [0, 1], ["0%", "-35%"]);
  const rightX = useTransform(s, [0, 1], ["0%", "35%"]);
  const titleO = useTransform(s, [0, 0.55], [1, 0]);
  const infoY = useTransform(s, [0, 0.6], [0, 120]);
  const infoO = useTransform(s, [0, 0.4], [1, 0]);

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero-stage">
        <motion.div
          className="hero-frame"
          initial={{ clipPath: "inset(26% 34% 26% 34% round 28px)" }}
          animate={ready ? { clipPath: "inset(0% 0% 0% 0% round 0px)" } : {}}
          transition={{ duration: 1.8, ease: EASE_IO }}
        >
          <motion.div className="hero-img" style={{ scale, y: imgY }}>
            <motion.div
              className="hero-img-in"
              initial={{ scale: 1.5 }}
              animate={ready ? { scale: 1 } : {}}
              transition={{ duration: 2.2, ease: EASE_IO }}
            >
              <Img src={P.living} alt="Soggiorno di Flori's Home" eager />
            </motion.div>
          </motion.div>
          <motion.div className="hero-shade" style={{ opacity: shade }} />
        </motion.div>

        <motion.h1 className="hero-title" style={{ opacity: titleO }}>
          <motion.span style={{ x: leftX }} className="ht-l">
            <Chars text="Flori's" delay={1.0} ready={ready} />
          </motion.span>
          <motion.span style={{ x: rightX }} className="ht-r">
            <Chars text="Home" delay={1.25} ready={ready} className="italic" />
          </motion.span>
        </motion.h1>

        <motion.div className="hero-info" style={{ y: infoY, opacity: infoO }}>
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 30 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.7, ease: EASE }}
          >
            <Star size={14} fill="currentColor" />
            <b>{String(SITE.rating).replace(".", ",")}</b> Superbo · {SITE.reviewsCount} recensioni
          </motion.div>

          <motion.p
            className="hero-lead"
            initial={{ opacity: 0, y: 30 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.85, ease: EASE }}
          >
            Un appartamento luminoso a Bergamo,<br />a quattro chilometri dal tuo volo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
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

        <motion.div
          className="hero-scroll"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 2.3 }}
          style={{ opacity: infoO }}
        >
          <span>Scorri</span>
          <i />
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
