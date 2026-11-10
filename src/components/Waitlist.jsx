import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, Check } from "lucide-react";
import { useLang } from "../i18n";
import { fmtDate } from "../lib/settings";
import { joinWaitlist } from "../lib/waitlist";
import PhoneInput from "./PhoneInput";

/* compare quando le date scelte sono occupate */
export default function Waitlist({ from, to, guests }) {
  const { t, lang, locale } = useLang();
  const w = t.wl;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const ok = name.trim().length >= 2 && phone.replace(/\D/g, "").length >= 8 && phone.split(" ")[1]?.length >= 5 && consent && (!email || /\S+@\S+\.\S+/.test(email));
  const send = async () => {
    if (!ok) return;
    setState("sending");
    try {
      await joinWaitlist({ name, phone, email, from, to, guests, lang });
      setState("done");
    } catch {
      setState("error");
    }
  };
  const range = `${fmtDate(from, { day: "numeric", month: "short" })} – ${fmtDate(to, { day: "numeric", month: "short" })}`;
  return (
    <motion.div className="wl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <AnimatePresence mode="wait">
        {state !== "done" ? (
          <motion.div key="f" exit={{ opacity: 0 }}>
            <div className="wl-head">
              <motion.span className="wl-bell" animate={{ rotate: [0, -16, 14, -10, 6, 0] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.4 }}><BellRing size={18} /></motion.span>
              <div><b>{w.title}</b><span>{w.sub(range)}</span></div>
            </div>
            <div className="wl-form">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={w.name} autoComplete="given-name" maxLength={60} />
              <PhoneInput value={phone} onChange={setPhone} lang={lang} locale={locale} label="WhatsApp" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={w.email} autoComplete="email" />
              <label className="wl-consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> <span>{w.consent}</span></label>
              {state === "error" && <div className="status bad"><i /> {w.err}</div>}
              <button className={`btn ${ok ? "" : "off"}`} onClick={send} disabled={state === "sending"}>
                <BellRing size={17} /> {state === "sending" ? w.sending : w.cta}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="d" className="wl-done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <span className="wl-ok"><Check size={20} /></span>
            <span>{w.done(name.trim().split(" ")[0], range)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
