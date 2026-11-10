import { createContext, useContext, useEffect, useState } from "react";
import { SITE } from "../data";

/*
  Luce e meteo di Bergamo, in tempo reale.
  phase: "morning" | "day" | "sunset" | "night"  (in base all'alba e al tramonto di oggi a Bergamo)
  weather: { temp, kind: clear | cloudy | fog | rain | snow | storm, isDay }
  Per provarli: aggiungi all'indirizzo ?ora=night (morning, day, sunset) e/o ?meteo=snow (rain, cloudy, fog, storm, clear)
*/
const TZ = "Europe/Rome";

// ore e minuti di adesso a Bergamo
function romeNow() {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const get = (t) => Number(p.find((x) => x.type === t)?.value || 0);
  return get("hour") * 60 + get("minute");
}
const mins = (iso) => { const m = /T(\d\d):(\d\d)/.exec(iso || ""); return m ? Number(m[1]) * 60 + Number(m[2]) : null; };

// alba/tramonto approssimati se il meteo non risponde (Bergamo: ~7:45/16:50 d'inverno, ~5:40/21:10 d'estate)
function fallbackSun() {
  const day = Math.floor((Date.now() - Date.UTC(new Date().getUTCFullYear(), 0, 0)) / 864e5);
  const k = (1 - Math.cos(((day - 10) / 365) * 2 * Math.PI)) / 2; // 0 a gennaio, 1 a luglio
  return { rise: Math.round(465 - k * 125), set: Math.round(1010 + k * 260) };
}

export function phaseAt(now, sun) {
  const { rise, set } = sun;
  if (now >= rise - 30 && now < rise + 150) return "morning";
  if (now >= set - 80 && now < set + 40) return "sunset";
  if (now >= rise + 150 && now < set - 80) return "day";
  return "night";
}

function kindOf(code) {
  if (code == null) return "clear";
  if (code <= 1) return "clear";
  if (code <= 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 95) return "storm";
  return "rain"; // pioviggine, pioggia, rovesci
}

const Ctx = createContext({ phase: "day", weather: null });

export function AmbientProvider({ children }) {
  const q = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const forcePhase = q.get("ora");
  const forceKind = q.get("meteo");
  const [sun, setSun] = useState(fallbackSun);
  const [weather, setWeather] = useState(forceKind ? { temp: 12, kind: forceKind, isDay: true } : null);
  const [now, setNow] = useState(romeNow);

  useEffect(() => {
    const id = setInterval(() => setNow(romeNow()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let alive = true;
    const load = () => {
      const { lat, lng } = SITE.coords;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,is_day&daily=sunrise,sunset&timezone=${encodeURIComponent(TZ)}&forecast_days=1`;
      fetch(url)
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((j) => {
          if (!alive) return;
          const rise = mins(j.daily?.sunrise?.[0]);
          const set = mins(j.daily?.sunset?.[0]);
          if (rise != null && set != null) setSun({ rise, set });
          if (!forceKind && j.current) {
            setWeather({ temp: Math.round(j.current.temperature_2m), kind: kindOf(j.current.weather_code), isDay: !!j.current.is_day });
          }
        })
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 20 * 60_000);
    return () => { alive = false; clearInterval(id); };
  }, [forceKind]);

  const phase = ["morning", "day", "sunset", "night"].includes(forcePhase) ? forcePhase : phaseAt(now, sun);

  useEffect(() => {
    document.documentElement.dataset.phase = phase;
    if (weather?.kind) document.documentElement.dataset.weather = weather.kind;
  }, [phase, weather?.kind]);

  return <Ctx.Provider value={{ phase, weather }}>{children}</Ctx.Provider>;
}

export const useAmbient = () => useContext(Ctx);
