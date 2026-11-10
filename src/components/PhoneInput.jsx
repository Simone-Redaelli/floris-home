import { useEffect, useMemo, useState } from "react";
import { DIAL, TOP, flag, dialOf, defaultIso, splitPasted } from "../lib/phone";

/* Campo telefono con prefisso già pronto: l'ospite sceglie il paese e scrive solo il numero.
   onChange riceve "+39 3331234567" */
export default function PhoneInput({ value, onChange, lang = "it", locale = "it-IT", placeholder = "333 123 4567", label }) {
  const [iso, setIso] = useState(() => splitPasted(value || "")?.iso || defaultIso(lang));
  const [local, setLocal] = useState(() => splitPasted(value || "")?.local || "");

  const names = useMemo(() => {
    let dn = null;
    try { dn = new Intl.DisplayNames([locale], { type: "region" }); } catch { /* niente */ }
    return Object.fromEntries(DIAL.map(([i]) => [i, dn?.of(i) || i]));
  }, [locale]);
  const rest = useMemo(() => DIAL.filter(([i]) => !TOP.includes(i)).sort((a, b) => names[a[0]].localeCompare(names[b[0]], locale)), [names, locale]);

  useEffect(() => {
    const digits = local.replace(/\D/g, "");
    onChange(digits ? `+${dialOf(iso)} ${digits}` : "");
  }, [iso, local]); // eslint-disable-line react-hooks/exhaustive-deps

  const typed = (v) => {
    const p = splitPasted(v);
    if (p) { setIso(p.iso); setLocal(p.local); return; }
    setLocal(v.replace(/[^\d\s]/g, "").slice(0, 18));
  };

  const opt = ([i, c]) => <option key={i} value={i}>{flag(i)} {names[i]} (+{c})</option>;
  return (
    <div className="phone-in">
      <label className="phone-cc" aria-label={label ? `${label}: prefisso` : "Prefisso"}>
        <span className="pc-show">{flag(iso)} +{dialOf(iso)}</span>
        <select value={iso} onChange={(e) => setIso(e.target.value)}>
          {DIAL.filter(([i]) => TOP.includes(i)).sort((a, b) => TOP.indexOf(a[0]) - TOP.indexOf(b[0])).map(opt)}
          <option disabled>──────────</option>
          {rest.map(opt)}
        </select>
        <i>▾</i>
      </label>
      <input type="tel" inputMode="tel" value={local} onChange={(e) => typed(e.target.value)} autoComplete="tel-national" placeholder={placeholder} aria-label={label} />
    </div>
  );
}
