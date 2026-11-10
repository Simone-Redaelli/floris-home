import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi, KeyRound, Clock, SquareParking, ScrollText, Recycle, DoorOpen, Phone, Siren, Stethoscope, CarTaxiFront,
  MessageCircle, MapPin, Navigation, Lock, Copy, Check, ArrowUpRight, Sparkles, Info, LogOut, Compass,
} from "lucide-react";
import { useLang } from "../i18n";
import { useSettings, fmtDate, euro } from "../lib/settings";
import { fetchGuide } from "../lib/guide";
import { SITE } from "../data";
import { LangSwitch } from "./Chrome";
import { EASE } from "./ui";
import { Handwrite, Countdown } from "./Fx";

const KEY = "floris-guide";
const clean = (c) => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
const pretty = (c) => (c.length > 4 ? `${c.slice(0, 4)}-${c.slice(4)}` : c);
const fromHash = () => clean((window.location.hash.match(/^#guida\/(.+)$/) || [])[1]);

function Card({ icon: I, title, children, locked, lockText, tone = "", delay = 0 }) {
  return (
    <motion.section
      className={`gd-card ${tone} ${locked ? "locked" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      <header><span className="gd-ico"><I size={20} /></span><h2>{title}</h2></header>
      {locked ? <div className="gd-lock"><Lock size={16} /> {lockText}</div> : children}
    </motion.section>
  );
}

function CopyBtn({ text, g }) {
  const [ok, setOk] = useState(false);
  return (
    <button className="gd-copy" onClick={() => navigator.clipboard?.writeText(text).then(() => { setOk(true); setTimeout(() => setOk(false), 1600); })}>
      {ok ? <><Check size={14} /> {g.copied}</> : <><Copy size={14} /> {g.copy}</>}
    </button>
  );
}

export default function Guide() {
  const { t, lang } = useLang();
  const g = t.guide;
  const { settings: s } = useSettings();
  const [code, setCode] = useState(() => {
    const h = fromHash();
    if (h) return h;
    try { return clean(localStorage.getItem(KEY)); } catch { return ""; }
  });
  const [input, setInput] = useState(pretty(code));
  const [data, setData] = useState(null);
  const [state, setState] = useState(code ? "loading" : "idle"); // idle | loading | ok | bad

  useEffect(() => { document.title = `${g.title} — Flori's Home`; }, [g.title]);
  useEffect(() => {
    // la guida non deve finire su Google
    const m = document.createElement("meta");
    m.name = "robots"; m.content = "noindex";
    document.head.appendChild(m);
    return () => m.remove();
  }, []);

  useEffect(() => {
    if (!code || code.length < 8) return;
    let alive = true;
    setState("loading");
    fetchGuide(code)
      .then((d) => {
        if (!alive) return;
        if (!d) { setState("bad"); setData(null); return; }
        setData(d);
        setState("ok");
        try { localStorage.setItem(KEY, code); } catch { /* niente */ }
        history.replaceState(null, "", `#guida/${code}`);
      })
      .catch(() => alive && setState("bad"));
    return () => { alive = false; };
  }, [code]);

  const submit = (e) => {
    e.preventDefault();
    const c = clean(input);
    if (c.length < 8) return setState("bad");
    setCode(c);
  };
  const logout = () => {
    try { localStorage.removeItem(KEY); } catch { /* niente */ }
    setCode(""); setInput(""); setData(null); setState("idle");
    history.replaceState(null, "", "#guida");
  };

  const unlocked = state === "ok" && data;
  const { lat, lng } = SITE.coords;
  const wa = `https://wa.me/${s.whatsapp}`;
  const L = (n) => fmtDate(n, { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="gd">
      <header className="gd-nav">
        <a href="./" className="brand"><span className="brand-mark">F</span><span className="brand-name">Flori's <em>Home</em></span></a>
        <div className="gd-nav-r">
          <LangSwitch />
          {unlocked && <button className="gd-out" onClick={logout} aria-label={g.logout}><LogOut size={16} /></button>}
        </div>
      </header>

      <section className="gd-hero">
        <motion.span className="kicker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{g.title}</motion.span>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
          {unlocked ? <>{g.hello(data.name)} <em><Handwrite key="h" text={g.helloEm} delay={0.4} /></em></> : <>{g.welcome1} <em><Handwrite key="w" text={g.welcome2} delay={0.4} /></em></>}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {unlocked ? g.stay(L(data.from), L(data.to)) : g.sub}
        </motion.p>
        {unlocked && <Countdown from={data.from} to={data.to} checkIn={s.checkIn} />}
        <div className="gd-chips">
          <span><Clock size={15} /> {g.checkIn} <b>{s.checkIn}</b></span>
          <span><DoorOpen size={15} /> {g.checkOut} <b>{s.checkOut}</b></span>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`} target="_blank" rel="noreferrer"><Navigation size={15} /> {SITE.address}</a>
        </div>

        <AnimatePresence mode="wait">
          {!unlocked && (
            <motion.form key="code" className="gd-code" onSubmit={submit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="gd-code-txt"><b><KeyRound size={17} /> {g.codeTitle}</b><span>{g.codeSub}</span></div>
              <div className="gd-code-row">
                <input
                  value={input}
                  onChange={(e) => { setInput(pretty(clean(e.target.value))); if (state === "bad") setState("idle"); }}
                  placeholder="XXXX-XXXX"
                  aria-label={g.codeTitle}
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button className="btn" disabled={state === "loading"}>{state === "loading" ? g.checking : g.open}</button>
              </div>
              {state === "bad" && <div className="status bad"><i /> {g.bad}</div>}
            </motion.form>
          )}
        </AnimatePresence>
      </section>

      <main className="gd-grid">
        <Card icon={Wifi} title={g.wifi} locked={!unlocked} lockText={g.locked} tone="t-gold">
          {data?.wifiName || data?.wifiPass ? (
            <div className="gd-wifi">
              <div><span>{g.network}</span><b>{data.wifiName || "—"}</b></div>
              <div><span>{g.password}</span><b className="mono">{data.wifiPass || "—"}</b>{data.wifiPass && <CopyBtn text={data.wifiPass} g={g} />}</div>
            </div>
          ) : <p>{g.askHost}</p>}
        </Card>

        <Card icon={KeyRound} title={g.entry} locked={!unlocked} lockText={g.locked} tone="t-sage" delay={0.05}>
          <p className="pre">{data?.entry || g.entryEmpty}</p>
        </Card>

        <Card icon={Clock} title={g.times} delay={0.1}>
          <p>{g.timesTxt(s.checkIn, s.checkOut)}</p>
          <p className="muted">{g.timesLate}</p>
        </Card>

        <Card icon={SquareParking} title={g.parking}>
          <p className="pre">{s.parkingInfo || g.parkingDefault}</p>
        </Card>

        <Card icon={ScrollText} title={g.rules} delay={0.05}>
          <ul className="gd-list">{g.rulesList(s.checkIn, s.checkOut, euro(s.deposit)).map((r, i) => <li key={i}>{r}</li>)}</ul>
        </Card>

        <Card icon={DoorOpen} title={g.checkout}>
          <ul className="gd-checks">{g.checkoutList.map((r, i) => <li key={i}><Check size={14} /> {r}</li>)}</ul>
        </Card>

        <Card icon={Recycle} title={g.waste} tone="wide" delay={0.1}>
          <p className="muted">{g.wasteSub}</p>
          <div className="gd-waste">
            {g.wasteItems.map(([n, d], i) => (
              <div key={i} className={`w w${i}`}><i /><b>{n}</b><span>{d}</span></div>
            ))}
          </div>
          {s.wasteDays && <p className="gd-days"><b>{g.wasteDays}:</b> <span className="pre">{s.wasteDays}</span></p>}
        </Card>

        <Card icon={Phone} title={g.numbers} tone="t-ink" delay={0.05}>
          <ul className="gd-nums">
            <li><a href={wa} target="_blank" rel="noreferrer"><MessageCircle size={16} /><span>{g.host}</span><b>{s.phone}</b></a></li>
            <li><a href="tel:112"><Siren size={16} /><span>{g.n112}</span><b>112</b></a></li>
            <li><a href="tel:116117"><Stethoscope size={16} /><span>{g.n116}</span><b>116 117</b></a></li>
            <li><a href="tel:+390354519090"><CarTaxiFront size={16} /><span>{g.taxi}</span><b>035 451 9090</b></a></li>
          </ul>
        </Card>

        {s.guideNotes && (
          <Card icon={Info} title={g.notes} tone="full">
            <p className="pre">{s.guideNotes}</p>
          </Card>
        )}

        <motion.a className="gd-card gd-around" href="./#attivita" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Compass size={34} strokeWidth={1.4} />
          <div><h2>{g.around}</h2><p>{g.aroundSub}</p></div>
          <span className="act-cta">{g.aroundCta} <ArrowUpRight size={16} /></span>
        </motion.a>
      </main>

      <footer className="gd-foot">
        <span><Sparkles size={14} /> {g.enjoy}</span>
        <a href="./">{g.back}</a>
        <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noreferrer"><MapPin size={14} /> Maps</a>
      </footer>
      <span hidden>{lang}</span>
    </div>
  );
}
