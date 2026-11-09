import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, collection, onSnapshot } from "firebase/firestore";
import {
  LayoutDashboard, CalendarDays, Euro, Info, LogOut, Save, Plus, Trash2, Lock, ExternalLink,
  Check, AlertTriangle, Eye, EyeOff, RotateCcw, Inbox, Plane, PawPrint, Phone, Mail, X,
} from "lucide-react";
import { firebaseConfig, ADMIN_EMAIL, isConfigured } from "../lib/firebase-config";
import { DEFAULTS, DOC_PATH, today, addDays, nightsBetween, euro, fmtDate, quote } from "../lib/settings";
import Calendar from "../components/Calendar";
import { api, hasApi } from "../lib/api";

let fb = null;
function getFb() {
  if (!fb && isConfigured) {
    const app = initializeApp(firebaseConfig);
    fb = { auth: getAuth(app), db: getFirestore(app) };
  }
  return fb;
}

const TABS = [
  { id: "home", label: "Panoramica", icon: LayoutDashboard },
  { id: "req", label: "Richieste", icon: Inbox },
  { id: "cal", label: "Disponibilità", icon: CalendarDays },
  { id: "price", label: "Prezzi", icon: Euro },
  { id: "info", label: "Info e contatti", icon: Info },
];

/* ======================================================== */
export default function Admin() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    document.title = "Admin — Flori's Home";
    if (!isConfigured) return setUser(null);
    return onAuthStateChanged(getFb().auth, (u) => setUser(u));
  }, []);

  if (!isConfigured) return <Setup />;
  if (user === undefined) return <div className="adm-loading"><span /></div>;
  if (!user) return <Login />;
  if (ADMIN_EMAIL && user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return <Denied user={user} />;
  return <Dashboard user={user} />;
}

/* ---------------- non configurato ---------------- */
function Setup() {
  return (
    <div className="adm-center">
      <div className="adm-card wide">
        <div className="adm-logo">F</div>
        <h1>Pannello admin non ancora collegato</h1>
        <p>Per attivarlo serve un progetto Firebase gratuito. Segui il README del progetto (sezione "Pannello admin") e inserisci i dati in <code>src/lib/firebase-config.js</code>.</p>
        <a className="adm-btn ghost" href="./">← Torna al sito</a>
      </div>
    </div>
  );
}

/* ---------------- login ---------------- */
function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg(""); setBusy(true);
    try {
      await signInWithEmailAndPassword(getFb().auth, email.trim(), pw);
    } catch (ex) {
      setErr(ex.code === "auth/too-many-requests" ? "Troppi tentativi, riprova tra qualche minuto." : "Email o password non corretti.");
    }
    setBusy(false);
  };
  const reset = async () => {
    setErr(""); setMsg("");
    if (!email) return setErr("Scrivi prima la tua email.");
    try {
      await sendPasswordResetEmail(getFb().auth, email.trim());
      setMsg("Se l'email è corretta, riceverai il link per reimpostare la password.");
    } catch {
      setErr("Impossibile inviare l'email di recupero.");
    }
  };

  return (
    <div className="adm-center">
      <motion.form className="adm-card" onSubmit={submit} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <div className="adm-logo"><Lock size={20} strokeWidth={1.5} /></div>
        <h1>Area riservata</h1>
        <p>Accesso riservato all'amministratore di Flori's Home.</p>
        <label className="adm-field">
          <span>Email</span>
          <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="adm-field">
          <span>Password</span>
          <div className="pw">
            <input type={show ? "text" : "password"} autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} required />
            <button type="button" onClick={() => setShow(!show)} aria-label="Mostra password">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
        </label>
        {err && <div className="adm-err"><AlertTriangle size={15} /> {err}</div>}
        {msg && <div className="adm-ok"><Check size={15} /> {msg}</div>}
        <button className="adm-btn" disabled={busy}>{busy ? "Accesso…" : "Entra"}</button>
        <button type="button" className="adm-link" onClick={reset}>Password dimenticata?</button>
        <a className="adm-link" href="./">← Torna al sito</a>
      </motion.form>
    </div>
  );
}

function Denied({ user }) {
  return (
    <div className="adm-center">
      <div className="adm-card">
        <div className="adm-logo"><Lock size={20} /></div>
        <h1>Accesso negato</h1>
        <p>L'account {user.email} non è autorizzato a gestire il sito.</p>
        <button className="adm-btn ghost" onClick={() => signOut(getFb().auth)}>Esci</button>
      </div>
    </div>
  );
}

/* ---------------- dashboard ---------------- */
function Dashboard({ user }) {
  const [tab, setTab] = useState("home");
  const [saved, setSaved] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getDoc(doc(getFb().db, ...DOC_PATH))
      .then((snap) => {
        const data = { ...DEFAULTS, ...(snap.exists() ? snap.data() : {}) };
        delete data.updatedAt;
        setSaved(data);
        setDraft(data);
      })
      .catch(() => {
        setSaved({ ...DEFAULTS });
        setDraft({ ...DEFAULTS });
        flash("Impossibile leggere le impostazioni: controlla le regole di Firestore.", "err");
      });
  }, []);

  const flash = (text, kind = "ok") => {
    setToast({ text, kind, id: Date.now() });
    setTimeout(() => setToast(null), 3200);
  };

  const dirty = useMemo(() => saved && draft && JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft]);
  const set = useCallback((patch) => setDraft((d) => ({ ...d, ...patch })), []);

  const save = async () => {
    setSaving(true);
    try {
      const clean = {
        ...draft,
        pricePerNight: Number(draft.pricePerNight) || 0,
        weekendPrice: Number(draft.weekendPrice) || 0,
        cleaningFee: Number(draft.cleaningFee) || 0,
        deposit: Number(draft.deposit) || 0,
        minNights: Math.max(1, Number(draft.minNights) || 1),
        transferPrice: Number(draft.transferPrice) || 0,
        transferEnabled: draft.transferEnabled !== false,
        maxGuests: Math.max(1, Number(draft.maxGuests) || 1),
        seasons: (draft.seasons || []).map((x) => ({ ...x, price: Number(x.price) || 0 })),
        blocked: [...new Set(draft.blocked || [])].filter((d) => d >= addDays(today(), -1)).sort(),
      };
      await setDoc(doc(getFb().db, ...DOC_PATH), { ...clean, updatedAt: serverTimestamp() });
      setSaved(clean);
      setDraft(clean);
      flash("Modifiche salvate e già online");
    } catch (e) {
      flash(e.code === "permission-denied" ? "Permesso negato: controlla le regole di Firestore." : "Salvataggio non riuscito, riprova.", "err");
    }
    setSaving(false);
  };

  useEffect(() => {
    const warn = (e) => dirty && (e.preventDefault(), (e.returnValue = ""));
    addEventListener("beforeunload", warn);
    return () => removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (!draft) return <div className="adm-loading"><span /></div>;

  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-brand"><span className="brand-mark">F</span><div><b>Flori's Home</b><small>Pannello admin</small></div></div>
        <nav>
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>
              {tab === t.id && <motion.span layoutId="adm-tab" className="adm-tab-bg" />}
              <t.icon size={18} strokeWidth={1.6} /><span>{t.label}</span>
            </button>
          ))}
        </nav>
        <div className="adm-side-foot">
          <a href="./" target="_blank" rel="noreferrer"><ExternalLink size={16} /> Vedi il sito</a>
          <button onClick={() => signOut(getFb().auth)}><LogOut size={16} /> Esci</button>
          <small>{user.email}</small>
        </div>
      </aside>

      <main className="adm-main">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {tab === "home" && <Overview d={draft} set={set} go={setTab} />}
            {tab === "req" && <Requests user={user} flash={flash} onBlocked={(nights) => {
              const add = (x) => ({ ...x, blocked: [...new Set([...(x.blocked || []), ...nights])].sort() });
              setSaved((x) => x && add(x)); setDraft((x) => x && add(x));
            }} />}
            {tab === "cal" && <Availability d={draft} set={set} />}
            {tab === "price" && <Prices d={draft} set={set} />}
            {tab === "info" && <InfoTab d={draft} set={set} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {dirty && (
          <motion.div className="adm-savebar" initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <span><i /> Modifiche non salvate</span>
            <button className="adm-btn ghost sm" onClick={() => setDraft(saved)}><RotateCcw size={15} /> Annulla</button>
            <button className="adm-btn sm" onClick={save} disabled={saving}><Save size={15} /> {saving ? "Salvo…" : "Salva e pubblica"}</button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} className={`adm-toast ${toast.kind}`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {toast.kind === "ok" ? <Check size={16} /> : <AlertTriangle size={16} />} {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- tab: richieste ---------------- */
const ST = {
  pending: ["In attesa", "wait"],
  processing: ["In corso…", "wait"],
  confirmed: ["Confermata", "ok"],
  rejected: ["Rifiutata", "no"],
  expired: ["Scaduta", "no"],
};

function Requests({ user, flash, onBlocked }) {
  const [list, setList] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    return onSnapshot(
      collection(getFb().db, "bookings"),
      (snap) => setList(snap.docs.map((x) => x.data()).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))),
      () => setList([]),
    );
  }, []);

  const decide = async (b, action) => {
    if (!hasApi()) return flash("Il server delle richieste non è ancora online: rispondi dal messaggio WhatsApp.", "err");
    setBusy(b.id + action);
    try {
      const token = await user.getIdToken();
      const r = await api(`/api/admin/bookings/${b.id}/${action}`, { method: "POST", token });
      if (action === "accept") onBlocked(b.nightList || []);
      flash(action === "accept" ? "Confermata: ospite avvisato e notti bloccate" : "Rifiutata: ospite avvisato");
      if (r.message?.includes("⚠️")) flash(r.message, "err");
    } catch (e) {
      flash(e.message, "err");
    }
    setBusy(null);
  };

  const shown = (list || []).filter((b) => filter === "all" || b.status === filter);
  const count = (k) => (list || []).filter((b) => b.status === k).length;

  return (
    <>
      <Head title="Richieste" sub="Le richieste di soggiorno arrivate dal sito. Puoi rispondere da qui o dai bottoni su WhatsApp." />
      <div className="adm-filters">
        {[["pending", "In attesa"], ["confirmed", "Confermate"], ["rejected", "Rifiutate"], ["all", "Tutte"]].map(([k, l]) => (
          <button key={k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>
            {l}{k !== "all" && <b>{count(k)}</b>}
          </button>
        ))}
      </div>
      {!hasApi() && (
        <div className="adm-note"><AlertTriangle size={16} /> Il server delle richieste automatiche non è ancora collegato al sito: per ora le richieste arrivano come messaggio WhatsApp.</div>
      )}
      {list === null && <div className="adm-loading small"><span /></div>}
      {list && shown.length === 0 && <div className="adm-empty"><Inbox size={30} /><b>Nessuna richiesta qui</b><span>Quando un ospite invia una richiesta dal sito la vedi comparire subito.</span></div>}
      <div className="req-list">
        <AnimatePresence initial={false}>
          {shown.map((b) => (
            <motion.article key={b.id} className="req" layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}>
              <div className="req-top">
                <div>
                  <b className="req-name">{b.name}</b>
                  <span className="req-code">#{b.id}</span>
                </div>
                <span className={`req-st ${ST[b.status]?.[1] || ""}`}>{ST[b.status]?.[0] || b.status}</span>
              </div>
              <div className="req-dates">
                <div><span>Arrivo</span><b>{fmtDate(b.from, { weekday: "short", day: "numeric", month: "short" })}</b></div>
                <i>→</i>
                <div><span>Partenza</span><b>{fmtDate(b.to, { weekday: "short", day: "numeric", month: "short" })}</b></div>
                <div className="req-tot"><span>{b.nights} notti · {b.guests} ospiti</span><b>{euro(b.total)}</b></div>
              </div>
              <div className="req-tags">
                {b.transfer && <span className="tf"><Plane size={13} /> Transfer{b.arrivalTime ? ` ${b.arrivalTime}` : ""}{b.flight ? ` · ${b.flight}` : ""}</span>}
                {b.pet && <span><PawPrint size={13} /> Animale</span>}
                <a href={`https://wa.me/${b.phone}`} target="_blank" rel="noreferrer"><Phone size={13} /> +{b.phone}</a>
                <a href={`mailto:${b.email}`}><Mail size={13} /> {b.email}</a>
              </div>
              {b.notes && <p className="req-notes">“{b.notes}”</p>}
              {b.status === "pending" && (
                <div className="req-actions">
                  <button className="adm-btn sm ok" disabled={!!busy} onClick={() => decide(b, "accept")}><Check size={15} /> {busy === b.id + "accept" ? "Confermo…" : "Accetta"}</button>
                  <button className="adm-btn ghost sm" disabled={!!busy} onClick={() => decide(b, "reject")}><X size={15} /> {busy === b.id + "reject" ? "Rifiuto…" : "Rifiuta"}</button>
                </div>
              )}
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

/* ---------------- tab: panoramica ---------------- */
function Overview({ d, set, go }) {
  const t = today();
  const next30 = nightsBetween(t, addDays(t, 30));
  const blockedSet = new Set(d.blocked || []);
  const busy = next30.filter((x) => blockedSet.has(x)).length;
  const nextFree = next30.find((x) => !blockedSet.has(x));
  const weekend = quote(nextFriday(t), addDays(nextFriday(t), 2), d);
  return (
    <>
      <Head title="Panoramica" sub="Lo stato del sito a colpo d'occhio." />
      <div className={`adm-switch-card ${d.bookingOpen ? "open" : "closed"}`}>
        <div>
          <b>{d.bookingOpen ? "Prenotazioni aperte" : "Prenotazioni chiuse"}</b>
          <span>{d.bookingOpen ? "Gli ospiti possono scegliere le date e inviarti richieste." : "Il sito mostra che al momento non accetti prenotazioni."}</span>
        </div>
        <Toggle on={d.bookingOpen} onChange={(v) => set({ bookingOpen: v })} />
      </div>
      <div className="adm-kpis">
        <Kpi label="Prezzo base" value={euro(d.pricePerNight)} sub="a notte" onClick={() => go("price")} />
        <Kpi label="Prossimi 30 giorni" value={`${busy}/30`} sub="notti occupate" onClick={() => go("cal")} />
        <Kpi label="Prima notte libera" value={nextFree ? fmtDate(nextFree, { day: "numeric", month: "short" }) : "—"} sub={nextFree ? "disponibile" : "nessuna nei prossimi 30 giorni"} onClick={() => go("cal")} />
        <Kpi label="Prossimo weekend" value={weekend.status === "ok" || weekend.status === "min" ? euro(weekend.total) : "Occupato"} sub="2 notti, pulizia inclusa" onClick={() => go("price")} />
      </div>
      <div className="adm-box">
        <h3>Avviso sul sito</h3>
        <p className="adm-hint">Un messaggio facoltativo mostrato nella sezione prenotazione (es. "Offerta -10% a gennaio").</p>
        <textarea rows={2} value={d.notice || ""} onChange={(e) => set({ notice: e.target.value })} placeholder="Lascia vuoto per non mostrare nulla" />
      </div>
    </>
  );
}

function nextFriday(t) {
  let x = t;
  for (let i = 0; i < 7; i++) {
    const [y, m, dd] = x.split("-").map(Number);
    if (new Date(y, m - 1, dd).getDay() === 5) return x;
    x = addDays(x, 1);
  }
  return t;
}

/* ---------------- tab: disponibilità ---------------- */
function Availability({ d, set }) {
  const [fromQ, setFromQ] = useState("");
  const [toQ, setToQ] = useState("");
  const toggle = useCallback((days, block) => {
    const s = new Set(d.blocked || []);
    days.forEach((x) => (block ? s.add(x) : s.delete(x)));
    set({ blocked: [...s].sort() });
  }, [d.blocked, set]);

  const ranges = useMemo(() => toRanges((d.blocked || []).filter((x) => x >= today())), [d.blocked]);

  const applyQuick = (block) => {
    if (!fromQ || !toQ || toQ < fromQ) return;
    toggle([...nightsBetween(fromQ, addDays(toQ, 1))], block);
  };

  return (
    <>
      <Head title="Disponibilità" sub="Clicca o trascina sui giorni per segnarli come occupati. Ripeti sugli stessi giorni per liberarli." />
      <div className="adm-box">
        <div className="adm-legend">
          <span><i className="lg free" /> Libero</span>
          <span><i className="lg blk" /> Occupato</span>
          <span><i className="lg special" /> Prezzo speciale</span>
        </div>
        <Calendar settings={d} mode="admin" onToggle={toggle} months={2} />
      </div>
      <div className="adm-cols">
        <div className="adm-box">
          <h3>Blocca o libera un periodo</h3>
          <div className="adm-row">
            <Field label="Dal" type="date" value={fromQ} onChange={setFromQ} min={today()} />
            <Field label="Al (compreso)" type="date" value={toQ} onChange={setToQ} min={fromQ || today()} />
          </div>
          <div className="adm-row">
            <button className="adm-btn sm" onClick={() => applyQuick(true)}>Segna occupato</button>
            <button className="adm-btn ghost sm" onClick={() => applyQuick(false)}>Segna libero</button>
          </div>
        </div>
        <div className="adm-box">
          <h3>Periodi occupati</h3>
          {ranges.length === 0 && <p className="adm-hint">Nessun periodo occupato: è tutto disponibile.</p>}
          <ul className="adm-list">
            {ranges.map(([a, b]) => (
              <li key={a}>
                <span>{a === b ? fmtDate(a) : `${fmtDate(a, { day: "numeric", month: "short" })} → ${fmtDate(b, { day: "numeric", month: "short" })}`}</span>
                <small>{nightsBetween(a, addDays(b, 1)).length} notti</small>
                <button onClick={() => toggle(nightsBetween(a, addDays(b, 1)), false)} aria-label="Libera"><Trash2 size={15} /></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function toRanges(days) {
  const s = [...days].sort();
  const out = [];
  for (const x of s) {
    const last = out[out.length - 1];
    if (last && addDays(last[1], 1) === x) last[1] = x;
    else out.push([x, x]);
  }
  return out;
}

/* ---------------- tab: prezzi ---------------- */
function Prices({ d, set }) {
  const seasons = d.seasons || [];
  const upd = (id, patch) => set({ seasons: seasons.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const add = () => set({ seasons: [...seasons, { id: String(Date.now()), name: "Alta stagione", from: today(), to: addDays(today(), 7), price: Number(d.pricePerNight) + 30 }] });
  const del = (id) => set({ seasons: seasons.filter((x) => x.id !== id) });

  return (
    <>
      <Head title="Prezzi" sub="Il preventivo sul sito si aggiorna in automatico con questi valori." />
      <div className="adm-box">
        <h3>Tariffe</h3>
        <div className="adm-grid4">
          <Field label="Prezzo a notte" prefix="€" type="number" value={d.pricePerNight} onChange={(v) => set({ pricePerNight: v })} />
          <Field label="Venerdì e sabato" prefix="€" type="number" value={d.weekendPrice} onChange={(v) => set({ weekendPrice: v })} hint="0 = come il prezzo base" />
          <Field label="Pulizia finale" prefix="€" type="number" value={d.cleaningFee} onChange={(v) => set({ cleaningFee: v })} />
          <Field label="Cauzione" prefix="€" type="number" value={d.deposit} onChange={(v) => set({ deposit: v })} />
          <Field label="Notti minime" type="number" value={d.minNights} onChange={(v) => set({ minNights: v })} />
          <Field label="Ospiti massimi" type="number" value={d.maxGuests} onChange={(v) => set({ maxGuests: v })} />
        </div>
      </div>
      <div className="adm-box">
        <div className="adm-box-head">
          <div>
            <h3>Transfer dall'aeroporto</h3>
            <p className="adm-hint">Opzione che l'ospite può aggiungere: lo andate a prendere a Orio al Serio.</p>
          </div>
          <Toggle on={d.transferEnabled !== false} onChange={(v) => set({ transferEnabled: v })} />
        </div>
        <div className="adm-grid4">
          <Field label="Prezzo transfer" prefix="€" type="number" value={d.transferPrice} onChange={(v) => set({ transferPrice: v })} />
        </div>
      </div>
      <div className="adm-box">
        <div className="adm-box-head">
          <div>
            <h3>Prezzi stagionali</h3>
            <p className="adm-hint">Hanno la precedenza su prezzo base e weekend nelle date indicate (es. Natale, fiere, estate).</p>
          </div>
          <button className="adm-btn sm" onClick={add}><Plus size={15} /> Aggiungi</button>
        </div>
        <AnimatePresence initial={false}>
          {seasons.map((x) => (
            <motion.div key={x.id} className="adm-season" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <Field label="Nome" value={x.name} onChange={(v) => upd(x.id, { name: v })} />
              <Field label="Dal" type="date" value={x.from} onChange={(v) => upd(x.id, { from: v })} />
              <Field label="Al" type="date" value={x.to} onChange={(v) => upd(x.id, { to: v })} min={x.from} />
              <Field label="A notte" prefix="€" type="number" value={x.price} onChange={(v) => upd(x.id, { price: v })} />
              <button className="adm-icon-btn" onClick={() => del(x.id)} aria-label="Elimina"><Trash2 size={16} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
        {seasons.length === 0 && <p className="adm-hint">Nessun prezzo stagionale.</p>}
      </div>
    </>
  );
}

/* ---------------- tab: info ---------------- */
function InfoTab({ d, set }) {
  return (
    <>
      <Head title="Info e contatti" sub="Dove arrivano le richieste e cosa vedono gli ospiti." />
      <div className="adm-box">
        <h3>Contatti</h3>
        <div className="adm-grid3">
          <Field label="WhatsApp" value={d.whatsapp} onChange={(v) => set({ whatsapp: v.replace(/[^\d]/g, "") })} hint="Solo numeri con prefisso, es. 393401234567" />
          <Field label="Email" type="email" value={d.email} onChange={(v) => set({ email: v })} />
          <Field label="Telefono" value={d.phone} onChange={(v) => set({ phone: v })} />
        </div>
      </div>
      <div className="adm-box">
        <h3>Orari</h3>
        <div className="adm-grid3">
          <Field label="Check-in" value={d.checkIn} onChange={(v) => set({ checkIn: v })} />
          <Field label="Check-out" value={d.checkOut} onChange={(v) => set({ checkOut: v })} />
        </div>
      </div>
    </>
  );
}

/* ---------------- piccoli componenti ---------------- */
function Head({ title, sub }) {
  return (
    <header className="adm-head">
      <h1>{title}</h1>
      <p>{sub}</p>
    </header>
  );
}

function Field({ label, value, onChange, type = "text", prefix, hint, min }) {
  return (
    <label className="adm-field">
      <span>{label}</span>
      <div className={`adm-input ${prefix ? "has-prefix" : ""}`}>
        {prefix && <em>{prefix}</em>}
        <input type={type} value={value ?? ""} min={type === "number" ? 0 : min} onChange={(e) => onChange(e.target.value)} />
      </div>
      {hint && <small>{hint}</small>}
    </label>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button className={`adm-toggle ${on ? "on" : ""}`} onClick={() => onChange(!on)} aria-pressed={on}>
      <motion.i layout transition={{ type: "spring", stiffness: 500, damping: 30 }} />
    </button>
  );
}

function Kpi({ label, value, sub, onClick }) {
  return (
    <button className="adm-kpi" onClick={onClick}>
      <span>{label}</span>
      <b>{value}</b>
      <small>{sub}</small>
    </button>
  );
}
