import { createContext, useContext, useEffect, useState } from "react";
import { useLang } from "../i18n";

/*
  Prezzo indicativo nella valuta dell'ospite (si paga sempre in euro).
  Valuta scelta da lingua + paese del browser: polacco → zł, Regno Unito → £, Svizzera → CHF, USA → $.
  Cambi BCE aggiornati ogni giorno (frankfurter, gratis e senza chiavi); se non risponde usa valori di scorta.
*/
const FALLBACK = { PLN: 4.25, GBP: 0.86, CHF: 0.94, USD: 1.1 };
const LOCALE = { PLN: "pl-PL", GBP: "en-GB", CHF: "de-CH", USD: "en-US" };
const KEY = "floris-fx";

const region = () => {
  try {
    const l = (navigator.languages?.[0] || navigator.language || "").split("-")[1];
    return (l || "").toUpperCase();
  } catch { return ""; }
};

export function currencyFor(lang, reg = region()) {
  if (lang === "it") return null; // chi legge in italiano paga e ragiona in euro
  if (lang === "pl" || reg === "PL") return "PLN";
  if (reg === "CH" || reg === "LI") return "CHF";
  if (reg === "GB") return "GBP";
  if (reg === "US") return "USD";
  if (lang === "en") return "GBP";
  return null;
}

const Ctx = createContext({ cur: null, rate: null });

export function FxProvider({ children }) {
  const { lang } = useLang();
  const q = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("valuta") : null; // prova: ?valuta=PLN
  const cur = q && FALLBACK[q.toUpperCase()] ? q.toUpperCase() : currencyFor(lang);
  const [rates, setRates] = useState(() => {
    try {
      const c = JSON.parse(localStorage.getItem(KEY) || "null");
      if (c && Date.now() - c.at < 12 * 3600e3) return c.rates;
    } catch { /* niente */ }
    return null;
  });

  useEffect(() => {
    if (!cur || rates) return;
    let alive = true;
    const get = (u) => fetch(u).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));
    get("https://api.frankfurter.app/latest?from=EUR&to=PLN,GBP,CHF,USD")
      .catch(() => get("https://open.er-api.com/v6/latest/EUR")) // riserva
      .then((j) => {
        if (!alive || !j.rates) return;
        setRates(j.rates);
        try { localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), rates: j.rates })); } catch { /* niente */ }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [cur, rates]);

  const rate = cur ? (rates?.[cur] || FALLBACK[cur]) : null;
  return <Ctx.Provider value={{ cur, rate }}>{children}</Ctx.Provider>;
}

export const useFx = () => useContext(Ctx);

/* "≈ 560 zł" accanto a un prezzo in euro (niente se l'ospite usa l'euro) */
export function Approx({ eur, className = "" }) {
  const { cur, rate } = useFx();
  const { t } = useLang();
  const v = Number(eur);
  if (!cur || !rate || !v) return null;
  const txt = new Intl.NumberFormat(LOCALE[cur], { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(v * rate);
  return <span className={`fx ${className}`} title={t.fxNote}>≈ {txt}</span>;
}
