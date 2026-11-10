import { lazy, Suspense, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Landmark, TramFront, Palette, Drama, Factory, FerrisWheel, Waves, Ship, Sailboat, ChefHat, Trophy, ShoppingBag,
  Compass, Mountain, Car, ArrowUpRight, MessageCircle, LayoutGrid, Map as MapIcon,
} from "lucide-react";

const ActMap = lazy(() => import("./ActMap"));

// solo le icone usate (niente import di tutta la libreria)
const L = { Landmark, TramFront, Palette, Drama, Factory, FerrisWheel, Waves, Ship, Sailboat, ChefHat, Trophy, ShoppingBag, Compass, Mountain, Car, ArrowUpRight, MessageCircle };
import { ACTIVITIES, ACT_CATS, CITY, SITE } from "../data";
import { useLang } from "../i18n";
import { Img, Reveal, EASE } from "./ui";
import { Head } from "./Sections";

const CAT_ICON = { all: "Compass", culture: "Landmark", nature: "Mountain", family: "FerrisWheel", relax: "Waves", food: "ChefHat", sport: "Trophy", shop: "ShoppingBag" };

function Card({ a, txt, k }) {
  const I = L[a.icon] || L.Compass;
  return (
    <motion.article
      layout
      className={`act act-${a.cat} ${a.featured ? "feat" : ""}`}
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <a className="act-link" href={a.url} target="_blank" rel="noopener noreferrer" aria-label={`${txt.title} – ${k.cta[a.cta]}`} />
      <div className="act-vis">
        {a.img ? <Img src={CITY[a.img]} alt="" /> : <><i className="act-blob" /><I className="act-big" strokeWidth={1.2} /></>}
        <span className="act-cat">{k.cats[a.cat]}</span>
        <span className="act-dist"><L.Car size={13} /> {a.min} min · {String(a.km).replace(".", ",")} km</span>
      </div>
      <div className="act-body">
        <span className="act-ico"><I size={18} /></span>
        <h3>{txt.title}</h3>
        <p>{txt.desc}</p>
        <div className="act-foot">
          {a.from ? <span className="act-price">{k.from} <b>€{a.from}</b></span> : <span className="act-price">{txt.where}</span>}
          <span className="act-cta">{k.cta[a.cta]} <L.ArrowUpRight size={16} /></span>
        </div>
      </div>
    </motion.article>
  );
}

export default function Activities() {
  const { t } = useLang();
  const k = t.act;
  const [cat, setCat] = useState("all");
  const [view, setView] = useState("cards");
  const list = useMemo(() => (cat === "all" ? ACTIVITIES : ACTIVITIES.filter((a) => a.cat === cat)), [cat]);
  const cats = ACT_CATS.filter((c) => c === "all" || ACTIVITIES.some((a) => a.cat === c));
  const wa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(k.waText)}`;

  return (
    <section className="sec soft" id="attivita">
      <div className="wrap">
        <Head kicker={k.kicker} title={`${k.title1} <em>${k.title2}</em>`} sub={k.sub} />
        <Reveal className="act-bar">
        <div className="act-filters" role="tablist">
          {cats.map((c) => {
            const I = L[CAT_ICON[c]] || L.Compass;
            const n = c === "all" ? ACTIVITIES.length : ACTIVITIES.filter((a) => a.cat === c).length;
            return (
              <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? "on" : ""} onClick={() => setCat(c)}>
                {cat === c && <motion.i layoutId="act-pill" className="act-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <I size={15} /> {k.cats[c]} <small>{n}</small>
              </button>
            );
          })}
        </div>
        <div className="act-view" role="group" aria-label={k.view}>
          {[["cards", LayoutGrid, k.viewCards], ["map", MapIcon, k.viewMap]].map(([v, I, l]) => (
            <button key={v} className={view === v ? "on" : ""} onClick={() => setView(v)} aria-pressed={view === v}>
              {view === v && <motion.i layoutId="act-view-pill" className="act-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <I size={15} /> {l}
            </button>
          ))}
        </div>
        </Reveal>
        <AnimatePresence mode="wait" initial={false}>
        {view === "map" ? (
          <motion.div key="map" className="act-map-wrap" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
            <Suspense fallback={<div className="act-map loading" />}>
              <ActMap list={list} k={k} />
            </Suspense>
            <div className="act-legend">
              <span><i className="mk-dot home" /> {k.home}</span>
              {cats.filter((c) => c !== "all").map((c) => <span key={c}><i className={`mk-dot act-${c}`} /> {k.cats[c]}</span>)}
            </div>
          </motion.div>
        ) : (
        <motion.div key="cards" layout className="act-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <AnimatePresence mode="popLayout">
            {list.map((a) => <Card key={a.id} a={a} txt={k.items[a.id]} k={k} />)}
            <motion.a
              layout
              key="ask"
              className="act act-ask"
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <L.MessageCircle size={30} strokeWidth={1.5} />
              <h3>{k.askT}</h3>
              <p>{k.askS}</p>
              <span className="act-cta">{k.askCta} <L.ArrowUpRight size={16} /></span>
            </motion.a>
          </AnimatePresence>
        </motion.div>
        )}
        </AnimatePresence>
        <p className="act-note">{k.note}</p>
      </div>
    </section>
  );
}
