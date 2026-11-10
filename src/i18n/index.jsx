import { createContext, useContext, useEffect, useMemo, useState } from "react";
import it from "./it";
import en from "./en";
import fr from "./fr";
import es from "./es";
import de from "./de";
import pl from "./pl";

export const LANGS = [
  { code: "it", label: "Italiano", flag: "🇮🇹", locale: "it-IT" },
  { code: "en", label: "English", flag: "🇬🇧", locale: "en-GB" },
  { code: "fr", label: "Français", flag: "🇫🇷", locale: "fr-FR" },
  { code: "es", label: "Español", flag: "🇪🇸", locale: "es-ES" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", locale: "de-DE" },
  { code: "pl", label: "Polski", flag: "🇵🇱", locale: "pl-PL" },
];
const DICTS = { it, en, fr, es, de, pl };

// lingua corrente anche fuori da React (per le date)
let current = "it";
export const currentLocale = () => LANGS.find((l) => l.code === current)?.locale || "it-IT";

function detect() {
  try {
    const saved = localStorage.getItem("floris-lang");
    if (saved && DICTS[saved]) return saved;
  } catch { /* storage non disponibile */ }
  const nav = (navigator.languages || [navigator.language || "it"]).map((x) => x.slice(0, 2).toLowerCase());
  return nav.find((x) => DICTS[x]) || "it";
}

const Ctx = createContext({ lang: "it", t: it, setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    current = detect();
    return current;
  });
  const setLang = (l) => {
    current = l;
    setLangState(l);
    try { localStorage.setItem("floris-lang", l); } catch { /* ignora */ }
  };
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const value = useMemo(() => ({ lang, t: DICTS[lang], setLang, locale: currentLocale() }), [lang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
