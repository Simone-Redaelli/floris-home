import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, ArrowUpRight, Heart } from "lucide-react";
import { useLang } from "../i18n";
import { useSettings } from "../lib/settings";
import { submitReview } from "../lib/reviews";
import { LangSwitch } from "./Chrome";
import { Handwrite } from "./Fx";
import { EASE } from "./ui";

const clean = (c) => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
const pretty = (c) => (c.length > 4 ? `${c.slice(0, 4)}-${c.slice(4)}` : c);

export default function ReviewPage() {
  const { t, lang } = useLang();
  const r = t.rw;
  const { settings: s } = useSettings();
  const [code, setCode] = useState(() => pretty(clean((window.location.hash.match(/^#recensione\/(.+)$/) || [])[1])));
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [text, setText] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [err, setErr] = useState("");

  useEffect(() => { document.title = `${r.title} — Flori's Home`; }, [r.title]);
  useEffect(() => {
    const m = document.createElement("meta");
    m.name = "robots"; m.content = "noindex";
    document.head.appendChild(m);
    return () => m.remove();
  }, []);

  const ok = clean(code).length === 8 && rating > 0 && name.trim().length >= 2 && text.trim().length >= 10;
  const send = async (e) => {
    e.preventDefault();
    if (!ok || state === "sending") return;
    setState("sending");
    try {
      await submitReview(clean(code), { name, country, rating, text, lang });
      setState("done");
    } catch (x) {
      setErr(x.message === "exists" ? r.errExists : x.message === "denied" ? r.errCode : r.errGeneric);
      setState("error");
    }
  };
  const shown = hover || rating;

  return (
    <div className="gd rwp">
      <header className="gd-nav">
        <a href="./" className="brand"><span className="brand-mark">F</span><span className="brand-name">Flori's <em>Home</em></span></a>
        <LangSwitch />
      </header>
      <section className="gd-hero rw-hero">
        <span className="kicker">{r.kicker}</span>
        <h1>{r.title1} <em><Handwrite text={r.title2} delay={0.3} /></em></h1>
        <p>{r.sub}</p>
      </section>

      <main className="rw-wrap">
        <AnimatePresence mode="wait">
          {state !== "done" ? (
            <motion.form key="f" className="rw-card" onSubmit={send} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.6, ease: EASE }}>
              <div className="rw-stars" role="radiogroup" aria-label={r.rating} onPointerLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <motion.button
                    type="button"
                    key={n}
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n}/5`}
                    className={n <= shown ? "on" : ""}
                    onPointerEnter={() => setHover(n)}
                    onClick={() => setRating(n)}
                    whileTap={{ scale: 0.8 }}
                    animate={rating === n ? { scale: [1, 1.35, 1], rotate: [0, -12, 0] } : {}}
                  >
                    <Star size={38} fill="currentColor" strokeWidth={1.2} />
                  </motion.button>
                ))}
                <span className="rw-word">{shown ? r.words[shown - 1] : r.tap}</span>
              </div>
              <div className="rw-grid">
                <label><span>{r.name}</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder={r.namePh} maxLength={60} autoComplete="given-name" /></label>
                <label><span>{r.country}</span><input value={country} onChange={(e) => setCountry(e.target.value)} placeholder={r.countryPh} maxLength={60} /></label>
              </div>
              <label className="rw-text">
                <span>{r.text}</span>
                <textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder={r.textPh} maxLength={1200} />
                <small>{text.trim().length}/1200</small>
              </label>
              <label className="rw-code">
                <span>{r.code}</span>
                <input value={code} onChange={(e) => setCode(pretty(clean(e.target.value)))} placeholder="XXXX-XXXX" autoCapitalize="characters" spellCheck={false} />
                <small>{r.codeHint}</small>
              </label>
              {state === "error" && <div className="status bad"><i /> {err}</div>}
              <button className={`btn ${ok ? "" : "off"}`} disabled={state === "sending"}>
                {state === "sending" ? r.sending : <><Send size={17} /> {r.send}</>}
              </button>
              <p className="rw-note">{r.note}</p>
            </motion.form>
          ) : (
            <motion.div key="d" className="rw-card rw-done" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
              <motion.span className="rw-heart" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.7, delay: 0.15 }}><Heart size={34} fill="currentColor" /></motion.span>
              <h2>{r.thanks(name.trim().split(" ")[0])}</h2>
              <p>{r.thanksSub}</p>
              {rating >= 4 && s.reviewUrl && (
                <a className="btn" href={s.reviewUrl} target="_blank" rel="noreferrer">{r.google} <ArrowUpRight size={17} /></a>
              )}
              <a className="rw-back" href="./">{r.back}</a>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
