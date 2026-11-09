import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { iso, parse, today, nightPrice } from "../lib/settings";
import { useLang } from "../i18n";


function monthDays(y, m) {
  const first = new Date(y, m, 1);
  const lead = (first.getDay() + 6) % 7; // lunedì = 0
  const count = new Date(y, m + 1, 0).getDate();
  const cells = Array(lead).fill(null);
  for (let d = 1; d <= count; d++) cells.push(iso(new Date(y, m, d)));
  return cells;
}

/*
  mode="range": l'ospite sceglie arrivo/partenza (le notti occupate non sono selezionabili)
  mode="admin": l'admin trascina sui giorni per bloccarli/sbloccarli
*/
export default function Calendar({ settings, mode = "range", from, to, onRange, onToggle, months = 2 }) {
  const { t, locale } = useLang();
  const WD = t.cal.wd;
  const t0 = today();
  const now = parse(t0);
  const [base, setBase] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [dir, setDir] = useState(1);
  const [hover, setHover] = useState(null);
  const blocked = useMemo(() => new Set(settings.blocked || []), [settings.blocked]);

  // drag admin
  const drag = useRef(null);
  const [dragSet, setDragSet] = useState(null);

  const shift = (n) => {
    setDir(n);
    setBase(({ y, m }) => {
      const d = new Date(y, m + n, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };
  const canPrev = base.y > now.getFullYear() || base.m > now.getMonth();

  // limite di selezione: prima notte occupata dopo l'arrivo (giorno usabile solo come partenza)
  const limit = useMemo(() => {
    if (mode !== "range" || !from || to) return null;
    const sorted = [...blocked].filter((d) => d >= from).sort();
    return sorted[0] || null;
  }, [mode, from, to, blocked]);

  const isDisabled = (d) => {
    if (d < t0) return true;
    if (mode === "admin") return false;
    if (from && !to) {
      if (d <= from) return blocked.has(d);
      return limit ? d > limit : false;
    }
    return blocked.has(d);
  };

  const click = (d) => {
    if (mode !== "range" || isDisabled(d)) return;
    if (!from || to || d <= from) onRange(d, null);
    else onRange(from, d);
  };

  // ---- admin: trascinamento ----
  const daysBetween = (a, b) => {
    const [s, e] = a < b ? [a, b] : [b, a];
    const out = [];
    for (let x = s; x <= e; ) {
      if (x >= t0) out.push(x);
      const dt = parse(x);
      dt.setDate(dt.getDate() + 1);
      x = iso(dt);
    }
    return out;
  };
  const down = (d) => {
    if (mode !== "admin" || d < t0) return;
    drag.current = { start: d, block: !blocked.has(d) };
    setDragSet(new Set([d]));
  };
  const enter = (d) => {
    setHover(d);
    if (mode === "admin" && drag.current) setDragSet(new Set(daysBetween(drag.current.start, d)));
  };
  useEffect(() => {
    if (mode !== "admin") return;
    const up = () => {
      if (drag.current && dragSet) onToggle([...dragSet], drag.current.block);
      drag.current = null;
      setDragSet(null);
    };
    addEventListener("pointerup", up);
    return () => removeEventListener("pointerup", up);
  }, [mode, dragSet, onToggle]);

  const rangeEnd = to || (from && hover && hover > from && !isDisabled(hover) ? hover : null);

  return (
    <div
      className={`cal cal-${mode}`}
      onPointerLeave={() => setHover(null)}
      onPointerMove={(e) => {
        if (mode !== "admin" || !drag.current) return;
        const el = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-day]");
        if (el) enter(el.dataset.day);
      }}
    >
      <div className="cal-nav">
        <button onClick={() => shift(-1)} disabled={!canPrev} aria-label={t.cal.prev}><ChevronLeft size={18} /></button>
        <button onClick={() => shift(1)} aria-label={t.cal.next}><ChevronRight size={18} /></button>
      </div>
      <AnimatePresence mode="popLayout" initial={false} custom={dir}>
        <motion.div
          key={`${base.y}-${base.m}`}
          className="cal-months"
          custom={dir}
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -40 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {Array.from({ length: months }).map((_, k) => {
            const dt = new Date(base.y, base.m + k, 1);
            const cells = monthDays(dt.getFullYear(), dt.getMonth());
            return (
              <div className="cal-month" key={k}>
                <div className="cal-title">{((x) => x.charAt(0).toUpperCase() + x.slice(1))(dt.toLocaleDateString(locale, { month: "long", year: "numeric" }))}</div>
                <div className="cal-grid">
                  {WD.map((w, i) => <span key={i} className="cal-wd">{w}</span>)}
                  {cells.map((d, i) => {
                    if (!d) return <span key={i} />;
                    const dis = isDisabled(d);
                    const isB = blocked.has(d);
                    const inDrag = dragSet?.has(d);
                    const sel = from && (d === from || d === rangeEnd);
                    const inR = from && rangeEnd && d > from && d < rangeEnd;
                    const np = nightPrice(d, settings);
                    const cls = [
                      "cal-day",
                      dis && "dis",
                      isB && "blk",
                      d === t0 && "today",
                      sel && "sel",
                      inR && "inr",
                      d === from && "start",
                      d === rangeEnd && "end",
                      inDrag && (drag.current?.block ? "drag-b" : "drag-u"),
                      np.kind !== "base" && "special",
                    ].filter(Boolean).join(" ");
                    return (
                      <button
                        key={d}
                        data-day={d}
                        className={cls}
                        onClick={() => click(d)}
                        onPointerDown={() => down(d)}
                        onPointerEnter={() => enter(d)}
                        disabled={mode === "range" && dis}
                        title={isB ? t.cal.unavailable : `€${np.price} ${t.cal.perNight}`}
                      >
                        <b>{parse(d).getDate()}</b>
                        {d >= t0 && <small>{isB ? "—" : np.price}</small>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
