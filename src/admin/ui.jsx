import { motion } from "framer-motion";

/* ---------------- piccoli componenti ---------------- */
export function Head({ title, sub }) {
  return (
    <header className="adm-head">
      <h1>{title}</h1>
      <p>{sub}</p>
    </header>
  );
}

export function Field({ label, value, onChange, type = "text", prefix, suffix, hint, min, rows, placeholder, step }) {
  return (
    <label className="adm-field">
      <span>{label}</span>
      <div className={`adm-input ${prefix ? "has-prefix" : ""} ${rows ? "area" : ""}`}>
        {prefix && <em>{prefix}</em>}
        {rows ? (
          <textarea rows={rows} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input type={type} value={value ?? ""} step={step} placeholder={placeholder} min={type === "number" ? 0 : min} onChange={(e) => onChange(e.target.value)} />
        )}
        {suffix && <em className="suf">{suffix}</em>}
      </div>
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Toggle({ on, onChange }) {
  return (
    <button className={`adm-toggle ${on ? "on" : ""}`} onClick={() => onChange(!on)} aria-pressed={on}>
      <motion.i layout transition={{ type: "spring", stiffness: 500, damping: 30 }} />
    </button>
  );
}

export function Kpi({ label, value, sub, onClick }) {
  return (
    <button className="adm-kpi" onClick={onClick}>
      <span>{label}</span>
      <b>{value}</b>
      <small>{sub}</small>
    </button>
  );
}
