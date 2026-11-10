import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  doc, getDoc, setDoc, deleteDoc, collection, onSnapshot, getDocs, updateDoc, Timestamp,
} from "firebase/firestore";
import {
  Plus, Trash2, Copy, RefreshCw, Link2, MessageCircle, ExternalLink, KeyRound, Check, AlertTriangle,
  ChevronLeft, ChevronRight, Star, TrendingUp, LogIn, LogOut as Out,
} from "lucide-react";
import { getFb } from "./fb";
import { Field, Toggle } from "./ui";
import { EXTRAS, today, addDays, nightsBetween, euro, fmtDate, quote, parse } from "../lib/settings";
import { api, hasApi } from "../lib/api";
import { SITE } from "../data";

const db = () => getFb().db;
const copy = (text, flash) => navigator.clipboard?.writeText(text).then(() => flash?.("Copiato"));
const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "calendario";

/* ======================= CALENDARI BOOKING / AIRBNB ======================= */
const SOURCES = [
  { id: "booking", name: "Booking.com", help: "Extranet → Tariffe e disponibilità → Sincronizza calendari → Esporta" },
  { id: "airbnb", name: "Airbnb", help: "Calendario → Disponibilità → Sincronizza calendari → Esporta calendario" },
  { id: "altro", name: "Altro", help: "Qualsiasi link .ics" },
];

export function IcalBox({ d, user, flash }) {
  const [priv, setPriv] = useState(null);
  const [feeds, setFeeds] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getDoc(doc(db(), "private", "ical"))
      .then((s) => { const p = s.data() || {}; setPriv(p); setFeeds(p.feeds || []); })
      .catch(() => { setPriv({}); setFeeds([]); });
  }, []);

  const dirty = priv && JSON.stringify(priv.feeds || []) !== JSON.stringify(feeds);
  const add = (src) => {
    const used = new Set(feeds.map((f) => f.id));
    let id = src.id;
    for (let i = 2; used.has(id); i++) id = `${src.id}-${i}`;
    setFeeds([...feeds, { id, name: src.id === "altro" ? "Altro calendario" : src.name, url: "" }]);
  };
  const upd = (id, patch) => setFeeds(feeds.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const save = async () => {
    const clean = feeds.map((f) => ({ id: slug(f.id), name: f.name.trim() || f.id, url: f.url.trim() }));
    if (clean.some((f) => f.url && !/^https:\/\//i.test(f.url))) return flash("I link devono iniziare con https://", "err");
    try {
      await setDoc(doc(db(), "private", "ical"), { feeds: clean }, { merge: true });
      setPriv((p) => ({ ...p, feeds: clean }));
      setFeeds(clean);
      flash("Calendari salvati: la prossima sincronizzazione li legge");
    } catch (e) {
      flash(e.code === "permission-denied" ? "Permesso negato: controlla le regole di Firestore." : "Salvataggio non riuscito.", "err");
    }
  };
  const syncNow = async () => {
    setBusy(true);
    try {
      const r = await api("/api/admin/ical/sync", { method: "POST", token: await user.getIdToken() });
      flash(`Sincronizzato: ${r.nights} notti occupate fuori dal sito`);
    } catch (e) {
      flash(e.message, "err");
    }
    setBusy(false);
  };

  const st = priv?.status || {};
  const ext = (d.extBlocked || []).filter((x) => x >= today()).length;

  return (
    <div className="adm-box">
      <div className="adm-box-head">
        <div>
          <h3>Calendari Booking.com e Airbnb</h3>
          <p className="adm-hint">Le notti prenotate sui portali si bloccano da sole sul sito, e le prenotazioni del sito si bloccano sui portali. Si aggiorna ogni 30 minuti.</p>
        </div>
        {hasApi() && <button className="adm-btn ghost sm" onClick={syncNow} disabled={busy}><RefreshCw size={15} className={busy ? "spin" : ""} /> Sincronizza ora</button>}
      </div>

      <div className="ical-state">
        <span><b>{ext}</b> notti future occupate sui portali</span>
        <span>Ultimo aggiornamento: <b>{d.extSyncedAt ? new Date(d.extSyncedAt).toLocaleString("it-IT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "mai"}</b></span>
      </div>

      <h4 className="ical-sub">1 · Dai al sito i calendari dei portali (importa)</h4>
      {priv === null && <div className="adm-loading small"><span /></div>}
      <AnimatePresence initial={false}>
        {feeds.map((f) => {
          const src = SOURCES.find((s) => f.id.startsWith(s.id)) || SOURCES[2];
          const s = st[f.id];
          return (
            <motion.div key={f.id} className="ical-row" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <Field label="Nome" value={f.name} onChange={(v) => upd(f.id, { name: v })} />
              <Field label={`Link di esportazione ${src.name === "Altro" ? "(.ics)" : `di ${src.name}`}`} value={f.url} onChange={(v) => upd(f.id, { url: v })} placeholder="https://…ics" hint={src.help} />
              <span className={`ical-st ${s ? (s.ok ? "ok" : "no") : ""}`} title={s?.error || ""}>
                {s ? (s.ok ? <><Check size={13} /> {s.nights} notti</> : <><AlertTriangle size={13} /> errore</>) : "in attesa"}
              </span>
              <button className="adm-icon-btn" onClick={() => setFeeds(feeds.filter((x) => x.id !== f.id))} aria-label="Elimina"><Trash2 size={16} /></button>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <div className="adm-row">
        {SOURCES.map((s) => <button key={s.id} className="adm-btn ghost sm" onClick={() => add(s)}><Plus size={15} /> {s.name}</button>)}
        {dirty && <button className="adm-btn sm" onClick={save}>Salva calendari</button>}
      </div>

      <h4 className="ical-sub">2 · Dai ai portali il calendario del sito (esporta)</h4>
      <p className="adm-hint">Incolla questo link nella sezione "Importa calendario" di ogni portale. Ognuno ha il suo, così non riceve indietro le sue stesse prenotazioni.</p>
      <ul className="ical-links">
        {(priv?.feeds || []).filter((f) => f.url).map((f) => {
          const url = `${SITE.url}/calendar-${f.id}.ics`;
          return (
            <li key={f.id}>
              <span>Per <b>{f.name}</b></span>
              <code>{url}</code>
              <button className="adm-icon-btn" onClick={() => copy(url, flash)} aria-label="Copia"><Copy size={15} /></button>
            </li>
          );
        })}
        <li>
          <span>Tutte le notti occupate</span>
          <code>{SITE.url}/calendar.ics</code>
          <button className="adm-icon-btn" onClick={() => copy(`${SITE.url}/calendar.ics`, flash)} aria-label="Copia"><Copy size={15} /></button>
        </li>
      </ul>
    </div>
  );
}

/* ======================= SERVIZI EXTRA ======================= */
const EXTRA_LABEL = {
  cot: ["Lettino", "a soggiorno"],
  highchair: ["Seggiolone", "a soggiorno"],
  earlyIn: ["Check-in anticipato", "a soggiorno"],
  lateOut: ["Check-out posticipato", "a soggiorno"],
  ac: ["Aria condizionata", "a notte"],
};

export function ExtrasBox({ d, set }) {
  const ex = d.extras || {};
  const upd = (id, patch) => set({ extras: { ...ex, [id]: { ...ex[id], ...patch } } });
  return (
    <div className="adm-box">
      <h3>Servizi extra</h3>
      <p className="adm-hint">L'ospite li aggiunge alla richiesta come il transfer. Prezzo 0 = gratis. Check-in anticipato e check-out posticipato li confermi tu insieme alla prenotazione.</p>
      <div className="ex-admin">
        {EXTRAS.map((e) => (
          <div key={e.id} className={`ex-arow ${ex[e.id]?.enabled ? "" : "off"}`}>
            <Toggle on={ex[e.id]?.enabled !== false} onChange={(v) => upd(e.id, { enabled: v })} />
            <b>{EXTRA_LABEL[e.id][0]}</b>
            {e.free ? <span className="ex-free">Gratis</span> : <Field label="Prezzo" prefix="€" type="number" value={ex[e.id]?.price} onChange={(v) => upd(e.id, { price: v })} />}
            <small>{EXTRA_LABEL[e.id][1]}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================= TASSA DI SOGGIORNO ======================= */
export function TaxBox({ d, set }) {
  const ex = quote(today(), addDays(today(), 3), { ...d, blocked: [], extBlocked: [], bookingOpen: true, minNights: 1 }, { guests: 2 });
  return (
    <div className="adm-box">
      <div className="adm-box-head">
        <div>
          <h3>Tassa di soggiorno</h3>
          <p className="adm-hint">Calcolata nel preventivo per ogni adulto: percentuale del prezzo a notte diviso per gli ospiti, con un tetto a persona a notte e solo per le prime notti. I minorenni sono esenti. Valori impostati: Comune di Bergamo (7%, max €5, prime 5 notti) — verifica sempre le tariffe aggiornate con il Comune.</p>
        </div>
        <Toggle on={d.taxEnabled !== false} onChange={(v) => set({ taxEnabled: v })} />
      </div>
      <div className="adm-grid4">
        <Field label="Percentuale" suffix="%" type="number" step="0.5" value={d.taxRate} onChange={(v) => set({ taxRate: v })} />
        <Field label="Massimo a persona a notte" prefix="€" type="number" step="0.5" value={d.taxCap} onChange={(v) => set({ taxCap: v })} />
        <Field label="Notti massime" type="number" value={d.taxMaxNights} onChange={(v) => set({ taxMaxNights: v })} hint="0 = tutte" />
      </div>
      {d.taxEnabled !== false && <p className="adm-hint">Esempio: 2 adulti, 3 notti da oggi → tassa {euro(ex.tax)}.</p>}
    </div>
  );
}

/* ======================= GUIDA OSPITI ======================= */
const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => ALPHA[b % ALPHA.length]).join("");
const pretty = (c) => `${c.slice(0, 4)}-${c.slice(4)}`;
const guideUrl = (c) => `${SITE.url}/#guida/${c}`;
const expiry = (to) => { const x = parse(addDays(to, 2)); x.setHours(23, 59, 59); return Timestamp.fromDate(x); };
const phoneDigits = (p) => { let x = String(p || "").replace(/\D/g, ""); if (x.startsWith("00")) x = x.slice(2); if (/^3\d{8,9}$/.test(x)) x = `39${x}`; return x; };

export function GuideTab({ d, set, flash }) {
  const [priv, setPriv] = useState(null);
  const [privSaved, setPrivSaved] = useState(null);
  const [list, setList] = useState(null);
  const [nw, setNw] = useState({ name: "", phone: "", from: today(), to: addDays(today(), 2), guests: 2 });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getDoc(doc(db(), "private", "guide"))
      .then((s) => { const p = { wifiName: "", wifiPass: "", entry: "", ...(s.data() || {}) }; setPriv(p); setPrivSaved(p); })
      .catch(() => { const p = { wifiName: "", wifiPass: "", entry: "" }; setPriv(p); setPrivSaved(p); });
    return onSnapshot(collection(db(), "guestAccess"), (snap) => setList(snap.docs.map((x) => x.data())), () => setList([]));
  }, []);

  const privDirty = priv && privSaved && JSON.stringify(priv) !== JSON.stringify(privSaved);
  const savePriv = async () => {
    setBusy(true);
    try {
      const data = { wifiName: priv.wifiName.trim(), wifiPass: priv.wifiPass.trim(), entry: priv.entry.trim() };
      await setDoc(doc(db(), "private", "guide"), data, { merge: true });
      // aggiorna anche le guide degli ospiti ancora attive
      const now = Date.now();
      const snap = await getDocs(collection(db(), "guestGuides"));
      await Promise.all(snap.docs.filter((x) => x.data().expiresAt?.toMillis?.() > now).map((x) => updateDoc(x.ref, data)));
      setPrivSaved({ ...priv, ...data });
      flash(`Salvato · guide attive aggiornate`);
    } catch (e) {
      flash(e.code === "permission-denied" ? "Permesso negato: controlla le regole di Firestore." : "Salvataggio non riuscito.", "err");
    }
    setBusy(false);
  };

  const create = async () => {
    if (!nw.name.trim() || !nw.from || !nw.to || nw.to <= nw.from) return flash("Inserisci nome e date corrette", "err");
    setBusy(true);
    try {
      const code = newCode();
      const p = privSaved || {};
      await setDoc(doc(db(), "guestGuides", code), {
        name: nw.name.trim().split(" ")[0], from: nw.from, to: nw.to, guests: Number(nw.guests) || 1,
        wifiName: p.wifiName || "", wifiPass: p.wifiPass || "", entry: p.entry || "",
        expiresAt: expiry(nw.to), createdAt: new Date().toISOString(),
      });
      await setDoc(doc(db(), "guestAccess", code), {
        code, name: nw.name.trim(), phone: phoneDigits(nw.phone), from: nw.from, to: nw.to, guests: Number(nw.guests) || 1,
        manual: true, createdAt: new Date().toISOString(),
      });
      setNw({ name: "", phone: "", from: today(), to: addDays(today(), 2), guests: 2 });
      flash(`Codice creato: ${pretty(code)}`);
    } catch (e) {
      flash(e.code === "permission-denied" ? "Permesso negato: controlla le regole di Firestore." : "Creazione non riuscita.", "err");
    }
    setBusy(false);
  };
  const remove = async (code) => {
    if (!confirm(`Eliminare l'accesso ${pretty(code)}? L'ospite non potrà più aprire la guida.`)) return;
    await Promise.allSettled([deleteDoc(doc(db(), "guestGuides", code)), deleteDoc(doc(db(), "guestAccess", code))]);
    flash("Accesso eliminato");
  };

  const active = (list || []).filter((a) => a.to >= addDays(today(), -2)).sort((a, b) => a.from.localeCompare(b.from));
  const waText = (a) => `Ciao ${a.name.split(" ")[0]}! Qui trovi la guida di Flori's Home (Wi-Fi, come entrare, parcheggio, numeri utili): ${guideUrl(a.code)}`;

  return (
    <>
      <header className="adm-head">
        <h1>Guida ospiti</h1>
        <p>La pagina con tutto quello che serve durante il soggiorno. Gli ospiti la aprono con il codice personale: Wi-Fi e istruzioni per entrare li vede solo chi ha il codice.</p>
      </header>

      <div className="adm-box">
        <div className="adm-box-head">
          <div>
            <h3><KeyRound size={17} /> Dati riservati</h3>
            <p className="adm-hint">Visibili solo con il codice, fino a 2 giorni dopo la partenza.</p>
          </div>
          <a className="adm-btn ghost sm" href={`${SITE.url}/#guida`} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Vedi la guida</a>
        </div>
        {priv && (
          <>
            <div className="adm-grid3">
              <Field label="Nome rete Wi-Fi" value={priv.wifiName} onChange={(v) => setPriv({ ...priv, wifiName: v })} />
              <Field label="Password Wi-Fi" value={priv.wifiPass} onChange={(v) => setPriv({ ...priv, wifiPass: v })} />
            </div>
            <Field label="Come entrare" rows={4} value={priv.entry} onChange={(v) => setPriv({ ...priv, entry: v })} placeholder={"Es. Cassetta delle chiavi accanto al portone, codice 1234.\nAppartamento al 2° piano, porta a destra."} />
            {privDirty && <div className="adm-row"><button className="adm-btn sm" onClick={savePriv} disabled={busy}>{busy ? "Salvo…" : "Salva dati riservati"}</button></div>}
          </>
        )}
      </div>

      <div className="adm-box">
        <h3>Info per tutti</h3>
        <p className="adm-hint">Si salvano con la barra "Salva e pubblica". Se lasci vuoto il parcheggio, la guida scrive "Il parcheggio è gratuito".</p>
        <div className="adm-grid2">
          <Field label="Parcheggio" rows={3} value={d.parkingInfo} onChange={(v) => set({ parkingInfo: v })} placeholder="Dove lasciare l'auto…" />
          <Field label="Giorni di raccolta rifiuti" rows={3} value={d.wasteDays} onChange={(v) => set({ wasteDays: v })} placeholder={"Es. Lunedì: carta · Martedì: plastica…"} />
        </div>
        <Field label="Altre note per gli ospiti" rows={3} value={d.guideNotes} onChange={(v) => set({ guideNotes: v })} placeholder="Supermercato più vicino, come funziona il riscaldamento…" />
      </div>

      <div className="adm-box">
        <h3>Codici degli ospiti</h3>
        <p className="adm-hint">Quando confermi una richiesta dal sito il codice si crea da solo e arriva all'ospite. Per chi prenota su Booking/Airbnb o al telefono crealo qui e mandaglielo su WhatsApp.</p>
        <div className="guide-new">
          <Field label="Nome ospite" value={nw.name} onChange={(v) => setNw({ ...nw, name: v })} />
          <Field label="WhatsApp" value={nw.phone} onChange={(v) => setNw({ ...nw, phone: v })} placeholder="+39 …" />
          <Field label="Arrivo" type="date" value={nw.from} onChange={(v) => setNw({ ...nw, from: v })} />
          <Field label="Partenza" type="date" value={nw.to} min={nw.from} onChange={(v) => setNw({ ...nw, to: v })} />
          <Field label="Ospiti" type="number" value={nw.guests} onChange={(v) => setNw({ ...nw, guests: v })} />
          <button className="adm-btn sm" onClick={create} disabled={busy}><Plus size={15} /> Crea codice</button>
        </div>
        {list === null && <div className="adm-loading small"><span /></div>}
        {list && active.length === 0 && <p className="adm-hint">Nessun codice attivo.</p>}
        <ul className="guide-list">
          {active.map((a) => (
            <li key={a.code}>
              <div className="gl-who"><b>{a.name}</b><span>{fmtDate(a.from, { day: "numeric", month: "short" })} → {fmtDate(a.to, { day: "numeric", month: "short" })} · {a.guests} ospiti</span></div>
              <code>{pretty(a.code)}</code>
              <div className="gl-act">
                <button className="adm-icon-btn" onClick={() => copy(guideUrl(a.code), flash)} title="Copia link"><Link2 size={15} /></button>
                {a.phone && <a className="adm-icon-btn wa" href={`https://wa.me/${a.phone}?text=${encodeURIComponent(waText(a))}`} target="_blank" rel="noreferrer" title="Manda su WhatsApp"><MessageCircle size={15} /></a>}
                <a className="adm-icon-btn" href={guideUrl(a.code)} target="_blank" rel="noreferrer" title="Apri"><ExternalLink size={15} /></a>
                <button className="adm-icon-btn" onClick={() => remove(a.code)} title="Elimina"><Trash2 size={15} /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/* ======================= DA FARE OGGI ======================= */
export function TodoToday({ d, bookings }) {
  const [acc, setAcc] = useState([]);
  useEffect(() => onSnapshot(collection(db(), "guestAccess"), (s) => setAcc(s.docs.map((x) => x.data())), () => setAcc([])), []);

  const t = today();
  const tomorrow = addDays(t, 1);
  const yesterday = addDays(t, -1);
  // ospiti: codici guida + prenotazioni confermate dal sito senza codice
  const people = useMemo(() => {
    const out = acc.map((a) => ({ ...a, first: a.name.split(" ")[0] }));
    const codes = new Set(out.map((a) => a.code));
    for (const b of bookings || []) {
      if (b.status !== "confirmed" || (b.guideCode && codes.has(b.guideCode))) continue;
      out.push({ code: b.guideCode, name: b.name, first: b.name.split(" ")[0], phone: b.phone, from: b.from, to: b.to, lang: b.lang, guests: b.guests });
    }
    return out;
  }, [acc, bookings]);

  const arrivals = people.filter((p) => p.from === tomorrow || p.from === t);
  const departures = people.filter((p) => p.to === t || p.to === yesterday);
  if (!arrivals.length && !departures.length) return null;

  const link = (p) => (p.code ? guideUrl(p.code) : `${SITE.url}/#guida`);
  const arriveMsg = (p) => p.lang && p.lang !== "it"
    ? `Hi ${p.first}! We're looking forward to welcoming you ${p.from === t ? "today" : "tomorrow"} (check-in ${d.checkIn}). Everything you need — how to get in, Wi-Fi, parking — is here: ${link(p)}${(p.guests || 1) > 1 ? "\n\nIf you haven't yet, please send us today the details of the other guests (name, date of birth, nationality, ID document)." : ""}`
    : `Ciao ${p.first}! Ti aspettiamo ${p.from === t ? "oggi" : "domani"} (check-in ${d.checkIn}). Qui trovi come entrare, il Wi-Fi, il parcheggio e i numeri utili: ${link(p)}${(p.guests || 1) > 1 ? "\n\nSe non l'hai già fatto, mandaci oggi i dati degli altri ospiti (nome, data di nascita, nazionalità, documento)." : ""}`;
  const reviewMsg = (p) => p.lang && p.lang !== "it"
    ? `Hi ${p.first}, thank you for staying at Flori's Home! If you enjoyed it, a Google review would mean a lot to us: ${d.reviewUrl}`
    : `Ciao ${p.first}, grazie di essere stato/a da noi a Flori's Home! Se ti sei trovato/a bene, ci lasci una recensione su Google? Ci aiuta tantissimo: ${d.reviewUrl}`;
  const wa = (p, text) => (p.phone ? `https://wa.me/${p.phone}?text=${encodeURIComponent(text)}` : null);

  return (
    <div className="adm-box todo">
      <h3>Da fare oggi</h3>
      <p className="adm-hint">{hasApi() ? "Con il server attivo questi messaggi partono da soli: qui puoi mandarli anche a mano." : "Un tocco e si apre WhatsApp con il messaggio già scritto."}</p>
      <ul>
        {arrivals.map((p) => (
          <li key={`a${p.code || p.name}${p.from}`}>
            <span className="todo-ico in"><LogIn size={16} /></span>
            <div><b>{p.name}</b><span>arriva {p.from === t ? "oggi" : "domani"} · manda le istruzioni</span></div>
            {wa(p, arriveMsg(p)) ? <a className="adm-btn sm ok" href={wa(p, arriveMsg(p))} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Invia</a> : <small>nessun numero</small>}
          </li>
        ))}
        {departures.map((p) => (
          <li key={`d${p.code || p.name}${p.to}`}>
            <span className="todo-ico out"><Out size={16} /></span>
            <div><b>{p.name}</b><span>è partito {p.to === t ? "oggi" : "ieri"} · chiedi una recensione</span></div>
            {!d.reviewUrl ? <small>imposta il link in "Info e contatti"</small>
              : wa(p, reviewMsg(p)) ? <a className="adm-btn sm" href={wa(p, reviewMsg(p))} target="_blank" rel="noreferrer"><Star size={15} /> Chiedi</a> : <small>nessun numero</small>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ======================= STATISTICHE ======================= */
const MONTHS = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
const MONTHS_LONG = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
const daysIn = (y, m) => new Date(y, m + 1, 0).getDate();

function niceMax(v) {
  if (v <= 0) return 4;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = [1, 2, 2.5, 5, 10].find((k) => k * p >= v);
  return n * p;
}

export function Stats({ d, bookings }) {
  const now = parse(today());
  const [year, setYear] = useState(now.getFullYear());
  const [metric, setMetric] = useState("nights");
  const [hover, setHover] = useState(null);
  const [hist, setHist] = useState([]);
  useEffect(() => { getDoc(doc(db(), "private", "ical")).then((s) => setHist(s.data()?.history || [])).catch(() => {}); }, []);

  const data = useMemo(() => {
    const confirmed = (bookings || []).filter((b) => b.status === "confirmed");
    // notti occupate: bloccate sul sito + portali (storico) + soggiorni confermati
    const occ = new Set([...(d.blocked || []), ...(d.extBlocked || []), ...hist, ...confirmed.flatMap((b) => b.nightList || [])]);
    const months = MONTHS.map((_, m) => ({ m, nights: 0, revenue: 0, days: daysIn(year, m) }));
    for (const x of occ) {
      const [y, mm] = x.split("-").map(Number);
      if (y === year) months[mm - 1].nights++;
    }
    // incasso: totale della prenotazione senza tassa, diviso sulle notti
    let nightsSite = 0;
    let stayRevenue = 0;
    let stays = 0;
    for (const b of confirmed) {
      const list = b.nightList || nightsBetween(b.from, b.to);
      if (!list.length) continue;
      const per = (Number(b.total) - Number(b.tax || 0)) / list.length;
      let inYear = false;
      for (const x of list) {
        const [y, mm] = x.split("-").map(Number);
        if (y === year) { months[mm - 1].revenue += per; inYear = true; }
      }
      if (inYear) { stays++; nightsSite += list.length; stayRevenue += Number(b.stay || 0); }
    }
    const yearRevenue = months.reduce((a, x) => a + x.revenue, 0);
    const yearNights = months.reduce((a, x) => a + x.nights, 0);
    return { months, yearRevenue, yearNights, avgStay: stays ? nightsSite / stays : 0, avgNight: nightsSite ? stayRevenue / nightsSite : 0 };
  }, [d.blocked, d.extBlocked, hist, bookings, year]);

  const cur = year === now.getFullYear() ? data.months[now.getMonth()] : null;
  const val = (x) => (metric === "nights" ? x.nights : x.revenue);
  const max = niceMax(Math.max(...data.months.map(val)));
  const ticks = [0, max / 2, max];
  const fmt = (v) => (metric === "nights" ? String(Math.round(v)) : euro(Math.round(v)));
  const best = [...data.months].filter((x) => val(x) > 0).sort((a, b) => val(b) - val(a)).slice(0, 3);
  const H = 180;

  return (
    <div className="adm-box stats">
      <div className="adm-box-head">
        <div>
          <h3>Statistiche</h3>
          <p className="adm-hint">Le notti includono anche Booking/Airbnb; l'incasso conta solo le prenotazioni confermate dal sito (tassa di soggiorno esclusa).</p>
        </div>
        <div className="st-year">
          <button className="adm-icon-btn" onClick={() => setYear(year - 1)} aria-label="Anno precedente"><ChevronLeft size={16} /></button>
          <b>{year}</b>
          <button className="adm-icon-btn" onClick={() => setYear(year + 1)} aria-label="Anno successivo"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="adm-kpis st-kpis">
        {cur && <div className="adm-kpi"><span>Notti occupate a {MONTHS_LONG[now.getMonth()].toLowerCase()}</span><b>{cur.nights}<small>/{cur.days}</small></b><small>{Math.round((cur.nights / cur.days) * 100)}% di occupazione</small></div>}
        {cur && <div className="adm-kpi"><span>Incasso del mese</span><b>{euro(Math.round(cur.revenue))}</b><small>prenotazioni dal sito</small></div>}
        <div className="adm-kpi"><span>Incasso {year}</span><b>{euro(Math.round(data.yearRevenue))}</b><small>{data.yearNights} notti occupate in totale</small></div>
        <div className="adm-kpi"><span>Soggiorno medio</span><b>{data.avgStay ? data.avgStay.toLocaleString("it-IT", { maximumFractionDigits: 1 }) : "—"}<small> notti</small></b><small>{data.avgNight ? `${euro(Math.round(data.avgNight))} a notte in media` : "nessun soggiorno dal sito"}</small></div>
      </div>

      <div className="st-tabs" role="tablist">
        {[["nights", "Notti occupate"], ["revenue", "Incasso"]].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={metric === k} className={metric === k ? "on" : ""} onClick={() => setMetric(k)}>{l}</button>
        ))}
      </div>

      <div className="st-chart" onPointerLeave={() => setHover(null)}>
        <div className="st-axis">{[...ticks].reverse().map((v) => <span key={v}>{fmt(v)}</span>)}</div>
        <div className="st-plot" style={{ height: H }}>
          {ticks.map((v) => <i key={v} className="st-grid" style={{ bottom: `${(v / max) * 100}%` }} />)}
          {data.months.map((x) => {
            const h = (val(x) / max) * H;
            const isCur = cur && x.m === now.getMonth();
            return (
              <div key={x.m} className={`st-col ${hover === x.m ? "hov" : ""}`} onPointerEnter={() => setHover(x.m)} onFocus={() => setHover(x.m)} tabIndex={0}
                aria-label={`${MONTHS_LONG[x.m]}: ${x.nights} notti, ${euro(Math.round(x.revenue))}`}>
                <motion.span className="st-bar" initial={false} animate={{ height: Math.max(val(x) > 0 ? 3 : 0, h) }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
                <em className={isCur ? "cur" : ""}>{MONTHS[x.m]}</em>
                {hover === x.m && (
                  <div className="st-tip" style={{ bottom: Math.min(H - 10, h + 10) }}>
                    <b>{MONTHS_LONG[x.m]} {year}</b>
                    <span>{x.nights} notti · {Math.round((x.nights / x.days) * 100)}%</span>
                    <span>{euro(Math.round(x.revenue))}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {best.length > 0 && (
        <p className="st-best"><TrendingIcon /> Mesi migliori: {best.map((x) => `${MONTHS_LONG[x.m]} (${fmt(val(x))}${metric === "nights" ? " notti" : ""})`).join(" · ")}</p>
      )}
      <details className="st-table">
        <summary>Vedi la tabella</summary>
        <table>
          <thead><tr><th>Mese</th><th>Notti</th><th>Occupazione</th><th>Incasso</th></tr></thead>
          <tbody>
            {data.months.map((x) => (
              <tr key={x.m}><td>{MONTHS_LONG[x.m]}</td><td>{x.nights}</td><td>{Math.round((x.nights / x.days) * 100)}%</td><td>{euro(Math.round(x.revenue))}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

const TrendingIcon = () => <TrendingUp size={14} />;
