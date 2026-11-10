import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight, X, ChevronLeft, ChevronRight, Plus, Minus, MessageCircle, Mail, Navigation, Star,
  Maximize2, BedDouble, Users, Ruler, Check, Plane, Landmark, Theater, Trophy, Castle, Building2, Phone,
  IdCard, BookOpen, Car, ShieldCheck, Baby, Utensils, Sunrise, Sunset, Snowflake, CalendarX2, PawPrint,
} from "lucide-react";
import { COUNTRIES, DOC_TYPES, ageOf } from "../lib/countries";
import { P, CITY, SITE, GALLERY, AMENITIES, PLACES, SCORES, FAQ, AUDIENCE, TOUR } from "../data";
import { useSettings, quote, euro, fmtDate, EXTRAS, cancelDeadline, today } from "../lib/settings";
import { useBooking } from "../lib/booking";
import { api, hasApi } from "../lib/api";
import Calendar from "./Calendar";
import { Img, Reveal, Counter, Icon, EASE } from "./ui";
import { useLinks } from "./Chrome";
import { useLang } from "../i18n";
import { Polaroids, Skyline, Trail, Sticker } from "./Wow";

export function Head({ kicker, title, sub, center }) {
  return (
    <Reveal className={`head ${center ? "center" : ""}`}>
      <span className="kicker">{kicker}</span>
      <h2 dangerouslySetInnerHTML={{ __html: title }} />
      {sub && <p>{sub}</p>}
    </Reveal>
  );
}

/* ---------------- LIGHTBOX ---------------- */
export const ALL = [...TOUR.map((t) => ({ src: t.photo, label: t.title })), ...GALLERY];

export function Lightbox({ idx, setIdx }) {
  const { t } = useLang();
  const label = (k) => (k < TOUR.length ? t.tour.rooms[k].title : t.gallery[k - TOUR.length]);
  const go = (d) => setIdx((i) => (i + d + ALL.length) % ALL.length);
  useEffect(() => {
    if (idx === null) return;
    window.__lenis?.stop();
    const k = (e) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    addEventListener("keydown", k);
    return () => (removeEventListener("keydown", k), window.__lenis?.start());
  }, [idx]);
  return (
    <AnimatePresence>
      {idx !== null && (
        <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIdx(null)}>
          <button className="lb-close" aria-label={t.lightbox.close}><X size={24} /></button>
          <button className="lb-nav l" onClick={(e) => (e.stopPropagation(), go(-1))} aria-label={t.lightbox.prev}><ChevronLeft /></button>
          <AnimatePresence mode="wait">
            <motion.figure key={idx} className="lb-fig" onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}>
              <Img src={ALL[idx].src} alt={label(idx)} eager />
              <figcaption><b>{label(idx)}</b><span>{idx + 1} / {ALL.length}</span></figcaption>
            </motion.figure>
          </AnimatePresence>
          <button className="lb-nav r" onClick={(e) => (e.stopPropagation(), go(1))} aria-label={t.lightbox.next}><ChevronRight /></button>
          <div className="lb-thumbs" onClick={(e) => e.stopPropagation()}>
            {ALL.map((a, i) => (
              <button key={i} className={i === idx ? "on" : ""} onClick={() => setIdx(i)}><Img src={a.src} alt="" /></button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- LA CASA: POLAROID ---------------- */
export function Bento() {
  const [idx, setIdx] = useState(null);
  const open = (src) => setIdx(Math.max(0, ALL.findIndex((a) => a.src === src)));
  return (
    <>
      <Polaroids onOpen={open} />
      <Lightbox idx={idx} setIdx={setIdx} />
    </>
  );
}

/* ---------------- PERFETTO PER ---------------- */
export function Audience() {
  return (
    <section className="sec soft">
      <div className="wrap">
        <Head kicker="Perfetto per" title="Pensato per <em>il tuo viaggio</em>" center />
        <div className="aud">
          {AUDIENCE.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08} className="aud-card">
              <div className="aud-img"><Img src={a.photo} alt={a.title} /><span>{a.tag}</span></div>
              <div className="aud-body">
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SERVIZI ---------------- */
export function Amenities() {
  const { t } = useLang();
  const a0 = t.amen;
  return (
    <section className="sec" id="servizi">
      <div className="wrap amen">
        <div className="amen-left">
          <Head kicker={a0.kicker} title={`${a0.title1} <em>${a0.title2}</em>`} sub={a0.sub} />
          <Reveal className="amen-photo">
            <Img src={P.sofa} alt={a0.photoAlt} />
          </Reveal>
        </div>
        <div className="amen-grid">
          {AMENITIES.map((a, i) => (
            <Reveal key={a.icon} delay={i * 0.05} className="amen-card">
              <div className="amen-ico"><Icon name={a.icon} size={24} /></div>
              <b>{a0.items[i].label}</b>
              <span>{a0.items[i].text}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- RECENSIONI ---------------- */
export function Reviews() {
  const { t } = useLang();
  const r = t.rev;
  return (
    <section className="sec soft" id="recensioni">
      <div className="wrap rev">
        <Reveal className="rev-card">
          <Sticker className="rev-sticker" text={r.sticker}>★</Sticker>
          <span className="kicker light">{r.kicker}</span>
          <div className="rev-num"><Counter value={SITE.rating} decimals={1} duration={2.4} /></div>
          <div className="rev-stars">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 300, damping: 14 }}>
                <Star size={22} fill="currentColor" strokeWidth={0} />
              </motion.span>
            ))}
          </div>
          <b className="rev-label">{r.superb}</b>
          <p>{r.avg(SITE.reviewsCount)}</p>
          <a href={SITE.bookingUrl} target="_blank" rel="noreferrer" className="rev-link">{r.read} <ArrowUpRight size={16} /></a>
        </Reveal>
        <div className="rev-right">
          <Head kicker={r.k2} title={`${r.t1} <em>${r.t2}</em>`} />
          <div className="bars">
            {SCORES.map((s, i) => (
              <Reveal key={i} delay={i * 0.06} className="bar">
                <div className="bar-row"><span>{r.scores[i]}</span><b>{String(s.value).replace(".", ",")}</b></div>
                <div className="bar-track">
                  <motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: s.value / 10 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.2 + i * 0.07, ease: EASE }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- BERGAMO ---------------- */
const PLACE_ICON = [Plane, Building2, Landmark, Theater, Trophy, Castle];

export function Bergamo() {
  const { t } = useLang();
  const bg = t.berg;
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(p, [0, 1], [60, -60]);
  const y2 = useTransform(p, [0, 1], [120, -100]);
  const { lat, lng } = SITE.coords;
  const d = 0.014;
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d * 1.6}%2C${lat - d}%2C${lng + d * 1.6}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <section className="sec" id="bergamo" ref={ref}>
      <Skyline />
      <div className="wrap berg">
        <div className="berg-text">
          <Head kicker={bg.kicker} title={`${bg.title1} <em>${bg.title2}</em>`} sub={bg.sub} />
          <div className="places">
            {PLACES.map((pl, i) => {
              const I = PLACE_ICON[i] || Landmark;
              return (
                <Reveal key={i} delay={i * 0.05} className="place">
                  <span className="place-ico"><I size={18} /></span>
                  <span className="place-name">{bg.places[i]}</span>
                  <span className="place-min">{pl.min}</span>
                  <b>{String(pl.km).replace(".", ",")} km</b>
                </Reveal>
              );
            })}
          </div>
        </div>
        <div className="berg-pics">
          <motion.div className="bp bp1" style={{ y: y1 }}><Img src={CITY.alta} alt={bg.alta} /><span>{bg.alta}</span></motion.div>
          <motion.div className="bp bp2" style={{ y: y2 }}><Img src={CITY.porta} alt={bg.porta} /><span>{bg.porta}</span></motion.div>
        </div>
      </div>
      <Reveal className="wrap map">
        <iframe title={bg.mapTitle} src={map} loading="lazy" />
        <div className="map-card">
          <span className="brand-mark">F</span>
          <div><b>Flori's Home</b><span>{SITE.address}</span></div>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`} target="_blank" rel="noreferrer"><Navigation size={15} /> {bg.directions}</a>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- PRENOTA ---------------- */

const addDaysLocal = (iso, n) => { const d = new Date(`${iso}T12:00:00`); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

// nomi in italiano per il messaggio WhatsApp che arriva a te
const EXTRA_IT = { cot: "lettino", highchair: "seggiolone", earlyIn: "check-in anticipato", lateOut: "check-out posticipato", ac: "aria condizionata" };
const EXTRA_ICON = { cot: Baby, highchair: Utensils, earlyIn: Sunrise, lateOut: Sunset, ac: Snowflake };
// nazionalità italiana (anche scritta in altre lingue): serve la città di residenza
const isItalian = (n) => /^(italia|italy|italie|italien|italiana?|italiano|italienisch|włochy|wlochy)$/i.test(String(n || "").trim());

export function Booking() {
  const { t, lang } = useLang();
  const k = t.book;
  const { settings: s, loading } = useSettings();
  const { from, to, guests, transfer, extras, setFrom, setTo, setGuests, setTransfer, setExtras, toggleExtra } = useBooking();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ email: "", phone: "", notes: "", pet: false, arrivalTime: "", flight: "", consent: false, website: "" });
  const [main, setMain] = useState({ firstName: "", lastName: "", sex: "", birthDate: "", birthPlace: "", birthCountry: "Italia", nationality: "Italia", residence: "", docType: "Carta d'identità", docNumber: "", docIssuedBy: "" });
  const [others, setOthers] = useState([]);
  const setM = (k) => (e) => setMain((m) => ({ ...m, [k]: e.target.value }));
  const setO = (i, k) => (e) => setOthers((arr) => arr.map((o, j) => (j === i ? { ...o, [k]: e.target.value } : o)));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e }));

  // i minorenni non pagano la tassa di soggiorno: li contiamo appena l'ospite inserisce le date di nascita
  const minors = others.filter((o) => { const a = ageOf(o.birthDate); return a !== null && a < 18; }).length;
  const q = quote(from, to, s, { transfer, extras, guests, adults: guests - minors, pet: form.pet });
  const valid = q.status === "ok";
  const activeExtras = EXTRAS.filter((e) => s.extras?.[e.id]?.enabled);
  const exPrice = (e) => {
    const p = Number(s.extras[e.id].price) || 0;
    return p ? `+${euro(p)}${e.unit === "person" ? ` ${k.perPerson}` : e.unit === "night" ? ` ${k.perNightEx}` : ""}` : k.free;
  };
  const maxG = Number(s.maxGuests) || 5;
  const months = typeof window !== "undefined" && innerWidth > 980 ? 2 : 1;
  const tfOn = transfer && s.transferEnabled;

  const status = {
    ok: ["ok", k.status.ok],
    unavailable: ["bad", k.status.unavailable],
    closed: ["bad", k.status.closed],
    past: ["bad", k.status.past],
    min: ["bad", k.status.min(s.minNights)],
    empty: ["idle", from ? k.status.pickDeparture : k.status.pickArrival],
  }[q.status];

  // una riga per ogni ospite oltre al principale
  useEffect(() => {
    setOthers((arr) => Array.from({ length: Math.max(0, guests - 1) }, (_, i) => arr[i] || { firstName: "", lastName: "", sex: "", birthDate: "", nationality: "Italia", residence: "" }));
  }, [guests]);

  const mainAge = ageOf(main.birthDate);
  const fullName = `${main.firstName} ${main.lastName}`.trim();
  const mainOk = main.firstName.trim() && main.lastName.trim() && main.sex && mainAge !== null && mainAge >= 18 &&
    main.birthPlace.trim() && main.birthCountry.trim() && main.nationality.trim() && (!isItalian(main.nationality) || main.residence.trim()) &&
    main.docType && main.docNumber.trim().length >= 5 && main.docIssuedBy.trim();
  // altri ospiti: si possono mandare fino al giorno prima, ma chi è compilato da italiano deve avere la residenza
  const othersOk = others.every((o) => !o.firstName.trim() || !isItalian(o.nationality) || o.residence?.trim());
  const formOk = mainOk && othersOk && /\S+@\S+\.\S+/.test(form.email) && form.phone.replace(/\D/g, "").length >= 8 && form.consent;

  const waMsg = from && to
    ? [
        `Ciao! Sono ${fullName || "interessato/a"} e vorrei soggiornare a Flori's Home dal ${fmtDate(from)} al ${fmtDate(to)} (${q.nights.length} notti), ${guests} ospiti${form.pet ? ` + un animale (${euro(q.petFee)})` : ""}.`,
        tfOn ? `Vorrei anche il transfer dall'aeroporto di Orio al Serio${form.arrivalTime ? ` (arrivo ${form.arrivalTime}${form.flight ? `, volo ${form.flight}` : ""})` : ""}.` : null,
        q.extras.length ? `Servizi extra: ${q.extras.map((e) => `${EXTRA_IT[e.id]}${e.qty > 1 ? ` ×${e.qty}` : ""} (${euro(e.amount)})`).join(", ")}.` : null,
        `Totale stimato ${euro(q.total)}${q.tax ? ` (di cui ${euro(q.tax)} di tassa di soggiorno)` : ""}. È disponibile?`,
        Number(s.cancelDays) > 0 ? `Ho letto che la cancellazione è gratuita fino a ${s.cancelDays} giorni prima dell'arrivo.` : null,
        form.email ? `Email: ${form.email}` : null,
        form.notes ? `Note: ${form.notes}` : null,
        "",
        "Dati per il check-in:",
        `${fullName} · ${main.sex} · nato/a il ${main.birthDate ? fmtDate(main.birthDate, { day: "numeric", month: "numeric", year: "numeric" }) : "-"} a ${main.birthPlace} (${main.birthCountry}) · nazionalità ${main.nationality}${main.residence ? ` · residente a ${main.residence}` : ""}`,
        `${main.docType} n. ${main.docNumber} rilasciato da ${main.docIssuedBy}`,
        ...others.filter((o) => o.firstName).map((o, i) => `Ospite ${i + 2}: ${o.firstName} ${o.lastName} · ${o.sex || "-"} · ${o.birthDate || "-"} · ${o.nationality}${o.residence ? ` · residente a ${o.residence}` : ""}`),
        others.some((o) => !o.firstName) ? "I dati degli altri ospiti li mando entro il giorno prima del check-in." : null,
      ].filter((l) => l !== null && l !== undefined).join("\n")
    : "";

  const submit = async () => {
    setError("");
    if (!hasApi()) {
      window.open(`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(waMsg)}`, "_blank");
      setDone({ viaWhatsApp: true });
      setStep(2);
      return;
    }
    setSending(true);
    try {
      const r = await api("/api/bookings", {
        method: "POST",
        body: { ...form, name: fullName, guest: main, others, from, to, guests, transfer: tfOn, extras: q.extras.map((e) => e.id), lang, arrivalTime: tfOn ? form.arrivalTime : "", flight: tfOn ? form.flight : "" },
      });
      setDone(r);
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
    setSending(false);
  };

  const reset = () => { setFrom(null); setTo(null); setTransfer(false); setExtras([]); setDone(null); setStep(0); };
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = document.getElementById("prenota");
    if (el && el.getBoundingClientRect().top < -200) window.__lenis?.scrollTo(el, { offset: -10, duration: 0.8 });
  }, [step]);

  return (
    <section className="sec book" id="prenota">
      <div className="wrap">
        <Head kicker={k.kicker} title={`${k.title1} <em>${k.title2}</em>`} sub={k.sub} center />
        {s.notice && <Reveal className="notice">{s.notice}</Reveal>}
        <div className="book-steps">
          {k.steps.map((x, i) => <span key={i} className={i === step ? "on" : i < step ? "done" : ""}><i>{i < step ? <Check size={13} /> : i + 1}</i>{x}</span>)}
        </div>
        <div className="book-grid">
          <Reveal className="book-cal">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="cal" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  {s.bookingOpen ? (
                    <Calendar settings={s} mode="range" from={from} to={to} months={months} onRange={(a, b) => { setFrom(a); setTo(b); }} />
                  ) : (
                    <div className="closed-box"><b>{k.closedT}</b><span>{k.closedS}</span></div>
                  )}
                  <div className="cal-legend">
                    <span><i className="lg-sel" /> {k.legend[0]}</span>
                    <span><i className="lg-off" /> {k.legend[1]}</span>
                    <span><i className="lg-sp" /> {k.legend[2]}</span>
                  </div>

                  {s.transferEnabled && (
                    <div className={`transfer ${tfOn ? "on" : ""}`}>
                      <button className="tf-head" onClick={() => setTransfer(!transfer)} aria-pressed={tfOn}>
                        <span className="tf-ico"><Plane size={22} /></span>
                        <span className="tf-txt">
                          <b>{k.tfTitle}</b>
                          <span>{k.tfSub}</span>
                        </span>
                        <span className="tf-price">+{euro(s.transferPrice)}</span>
                        <span className="tf-switch"><i /></span>
                      </button>
                      <AnimatePresence initial={false}>
                        {tfOn && (
                          <motion.div className="tf-body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                            <label><span>{k.tfTime}</span><input type="time" value={form.arrivalTime} onChange={set("arrivalTime")} /></label>
                            <label><span>{k.tfFlight}</span><input placeholder={k.tfFlightPh} value={form.flight} onChange={set("flight")} /></label>
                            <small>{k.tfNote}</small>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {activeExtras.length > 0 && (
                    <div className="extras">
                      <div className="ex-head"><b>{k.exTitle}</b><span>{k.exSub}</span></div>
                      <div className="ex-grid">
                        {activeExtras.map((e) => {
                          const I = EXTRA_ICON[e.id];
                          const on = extras.includes(e.id);
                          return (
                            <button key={e.id} className={`ex ${on ? "on" : ""}`} onClick={() => toggleExtra(e.id)} aria-pressed={on}>
                              <span className="ex-ico"><I size={19} /></span>
                              <span className="ex-txt"><b>{k.ex[e.id].t}</b><small>{k.ex[e.id].s}</small></span>
                              <span className="ex-price">{exPrice(e)}</span>
                              <motion.span className="ex-check" animate={{ scale: on ? 1 : 0.6, opacity: on ? 1 : 0 }}><Check size={13} /></motion.span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="form" className="guest-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3>{k.formTitle}</h3>
                  <p className="gf-sub">{k.formSub}</p>

                  <div className="gf-block">
                    <span className="gf-title"><i>1</i> {k.contacts}</span>
                    <div className="gf-grid">
                      <label><span>{k.email}</span><input type="email" value={form.email} onChange={set("email")} autoComplete="email" placeholder="mario@email.it" /></label>
                      <label><span>{k.phone}</span><input type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="+39 333 123 4567" /></label>
                    </div>
                  </div>

                  <div className="gf-block">
                    <span className="gf-title"><i>2</i> {k.mainGuest} <small>{k.asOnDoc}</small></span>
                    <div className="gf-grid">
                      <label><span>{k.firstName}</span><input value={main.firstName} onChange={setM("firstName")} autoComplete="given-name" /></label>
                      <label><span>{k.lastName}</span><input value={main.lastName} onChange={setM("lastName")} autoComplete="family-name" /></label>
                      <label><span>{k.sex}</span>
                        <select value={main.sex} onChange={setM("sex")}><option value="">—</option><option>M</option><option>F</option></select>
                      </label>
                      <label><span>{k.birth} {mainAge !== null && <em className={mainAge < 18 ? "age bad" : "age"}>{mainAge} {k.years}</em>}</span>
                        <input type="date" value={main.birthDate} onChange={setM("birthDate")} max={new Date().toISOString().slice(0, 10)} autoComplete="bday" />
                      </label>
                      <label><span>{k.birthPlace}</span><input value={main.birthPlace} onChange={setM("birthPlace")} placeholder={k.cityPh} /></label>
                      <label><span>{k.birthCountry}</span><input list="countries" value={main.birthCountry} onChange={setM("birthCountry")} /></label>
                      <label className={isItalian(main.nationality) ? "" : "full"}><span>{k.nationality}</span><input list="countries" value={main.nationality} onChange={setM("nationality")} /></label>
                      {isItalian(main.nationality) && (
                        <label><span>{k.residence}</span><input value={main.residence} onChange={setM("residence")} placeholder={k.residencePh} autoComplete="address-level2" /></label>
                      )}
                    </div>
                    {mainAge !== null && mainAge < 18 && <div className="status bad"><i /> {k.minor}</div>}
                  </div>

                  <div className="gf-block">
                    <span className="gf-title"><i>3</i> {k.doc}</span>
                    <div className="doc-types">
                      {DOC_TYPES.map((t) => (
                        <button key={t} type="button" className={main.docType === t ? "on" : ""} onClick={() => setMain((m) => ({ ...m, docType: t }))}>
                          {t === "Passaporto" ? <BookOpen size={16} /> : t === "Patente di guida" ? <Car size={16} /> : <IdCard size={16} />} {k.docTypes[t]}
                        </button>
                      ))}
                    </div>
                    <div className="gf-grid">
                      <label><span>{main.docType === "Passaporto" ? k.passportNumber : k.docNumber}</span><input value={main.docNumber} onChange={(e) => setMain((m) => ({ ...m, docNumber: e.target.value.toUpperCase() }))} placeholder={main.docType === "Passaporto" ? "es. YA1234567" : "es. CA12345AB"} autoComplete="off" /></label>
                      <label><span>{k.issuedBy}</span><input value={main.docIssuedBy} onChange={setM("docIssuedBy")} placeholder={k.issuedByPh} /></label>
                    </div>
                  </div>

                  {others.length > 0 && (
                    <div className="gf-block">
                      <span className="gf-title"><i>4</i> {k.others} <small>{k.othersNote}</small></span>
                      {from && <div className="others-due"><CalendarX2 size={15} /> {k.othersDue(fmtDate(addDaysLocal(from, -1), { weekday: "long", day: "numeric", month: "long" }))}</div>}
                      {others.map((o, i) => (
                        <div className="other" key={i}>
                          <b>{k.guestN(i + 2)} {ageOf(o.birthDate) !== null && <em className="age">{ageOf(o.birthDate)} {k.years}</em>}</b>
                          <div className={`gf-grid five ${isItalian(o.nationality) ? "six" : ""}`}>
                            <input placeholder={k.firstName} value={o.firstName} onChange={setO(i, "firstName")} />
                            <input placeholder={k.lastName} value={o.lastName} onChange={setO(i, "lastName")} />
                            <select value={o.sex} onChange={setO(i, "sex")}><option value="">{k.sex}</option><option>M</option><option>F</option></select>
                            <input type="date" value={o.birthDate} onChange={setO(i, "birthDate")} max={new Date().toISOString().slice(0, 10)} aria-label={k.birth} />
                            <input list="countries" placeholder={k.nationality} value={o.nationality} onChange={setO(i, "nationality")} />
                            {isItalian(o.nationality) && (
                              <input className={o.firstName.trim() && !o.residence?.trim() ? "need" : ""} placeholder={k.residence} value={o.residence || ""} onChange={setO(i, "residence")} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <datalist id="countries">{COUNTRIES.map((c) => <option key={c} value={c} />)}</datalist>

                  <div className="gf-grid">
                    <label className="full"><span>{k.notes}</span><textarea rows={3} value={form.notes} onChange={set("notes")} placeholder={k.notesPh} /></label>
                    <input className="hp" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} aria-hidden="true" />
                  </div>
                  <label className="bs-pet"><input type="checkbox" checked={form.pet} onChange={set("pet")} /><i /> <span>{k.pet} <small>{k.petFee(Number(s.petFee) ? `+${euro(s.petFee)}` : k.free)}</small></span></label>
                  <div className="law"><ShieldCheck size={18} /><span>{k.law}</span></div>
                  <label className="consent"><input type="checkbox" checked={form.consent} onChange={set("consent")} /> {k.consent}</label>
                  {error && <div className="status bad"><i /> {error}</div>}
                  <button className="btn ghost back" onClick={() => setStep(0)}><ChevronLeft size={16} /> {k.back}</button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="done" className="done-box" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <motion.div className="done-ico" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 0.15 }}><Check size={34} /></motion.div>
                  <h3>{done?.viaWhatsApp ? k.almost : k.sent}</h3>
                  {done?.viaWhatsApp ? (
                    <p>{k.waDone1} <b>{k.waDone2}</b> {k.waDone3} <a href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noreferrer">{k.waNotOpen}</a></p>
                  ) : (
                    <p>{k.apiDone(main.firstName)}</p>
                  )}
                  {done?.id && <div className="done-code">{k.code} <b>{done.id}</b></div>}
                  <button className="btn ghost" onClick={reset}>{k.newReq}</button>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>

          <Reveal className="book-sum" delay={0.1}>
            <div className="bs-price">
              <div><b>{euro(s.pricePerNight)}</b><span> {k.perNight}</span></div>
              <small className={loading ? "live wait" : "live"}><i /> {loading ? k.updating : k.updated}</small>
            </div>
            <div className="bs-fields">
              <div className={from ? "on" : ""}><span>{t.hero.arrival}</span><b>{from ? fmtDate(from, { day: "numeric", month: "short" }) : "—"}</b></div>
              <div className={to ? "on" : ""}><span>{t.hero.departure}</span><b>{to ? fmtDate(to, { day: "numeric", month: "short" }) : "—"}</b></div>
              <div className="full">
                <span>{t.hero.guests}</span>
                <div className="stepper">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} aria-label={k.less} disabled={step === 2}><Minus size={14} /></button>
                  <b>{guests}</b>
                  <button onClick={() => setGuests(Math.min(maxG, guests + 1))} aria-label={k.more} disabled={step === 2}><Plus size={14} /></button>
                </div>
              </div>
            </div>

            {step < 2 && (
              <AnimatePresence mode="wait">
                <motion.div key={status[1]} className={`status ${status[0]}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  {status[0] === "ok" ? <Check size={16} /> : <i />} {status[1]}
                </motion.div>
              </AnimatePresence>
            )}

            <AnimatePresence>
              {valid && (
                <motion.div className="bs-lines" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  {q.groups.map((g, i) => (
                    <div key={i}>
                      <span>{euro(g.price)} × {k.nightsN(g.count)}{g.kind === "season" ? ` · ${g.label || k.season}` : g.kind === "weekend" ? ` · ${k.weekend}` : ""}</span>
                      <span>{euro(g.price * g.count)}</span>
                    </div>
                  ))}
                  {q.factor > 1 && <small className="guest-note">{k.extraGuest(guests, Number(s.guestsIncluded) || 2, Number(s.extraGuestPct) || 0)}</small>}
                  {Number(s.cleaningFee) > 0 && <div><span>{k.cleaning}</span><span>{euro(s.cleaningFee)}</span></div>}
                  <AnimatePresence>
                    {tfOn && (
                      <motion.div className="tf-line" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                        <span><Plane size={14} /> {k.transferLine}</span><span>{euro(q.transferFee)}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {q.petFee > 0 && <div className="ex-line"><span><PawPrint size={14} /> {k.petLine}</span><span>{euro(q.petFee)}</span></div>}
                  <AnimatePresence initial={false}>
                    {q.extras.map((e) => (
                      <motion.div key={e.id} className="ex-line" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <span>{k.ex[e.id].t}{e.qty > 1 ? ` × ${e.qty}` : ""}</span><span>{e.amount ? euro(e.amount) : k.free}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {q.tax > 0 && (
                    <div className="tax-line">
                      <span>{k.tax} <small>{k.taxNote(s.taxRate, euro(s.taxCap), s.taxMaxNights)}</small></span>
                      <span>{euro(q.tax)}</span>
                    </div>
                  )}
                  <div className="tot"><span>{k.total}</span><motion.b key={q.total} initial={{ scale: 1.15 }} animate={{ scale: 1 }}>{euro(q.total)}</motion.b></div>
                  {q.tax > 0 && <small className="tax-pay">{k.taxPay(euro(q.tax))}</small>}
                  {Number(s.cancelDays) > 0 && (
                    <div className="cancel-note">
                      <CalendarX2 size={15} />
                      <span>{cancelDeadline(from, s) >= today()
                        ? k.cancelUntil(fmtDate(cancelDeadline(from, s), { day: "numeric", month: "long" }), s.cancelDays)
                        : k.cancelNo(s.cancelDays)}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {step === 0 && (
              <button className={`btn ${valid ? "" : "off"}`} onClick={() => valid && setStep(1)}>
                {k.cont} <ArrowUpRight size={18} />
              </button>
            )}
            {step === 1 && (
              <button className={`btn ${valid && formOk && !sending ? "" : "off"}`} onClick={submit}>
                {sending ? k.sending : <><MessageCircle size={18} /> {hasApi() ? k.send : k.sendWa}</>}
              </button>
            )}
            <p className="fine">{k.fine(euro(s.deposit))}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
export function Faq() {
  const [open, setOpen] = useState(0);
  const { t } = useLang();
  const fq = t.faq;
  const { settings: st } = useSettings();
  const facts = [
    [fq.facts[0], st.checkIn],
    [fq.facts[1], st.checkOut],
    [fq.facts[2], fq.minN(Number(st.minNights))],
    [fq.facts[3], euro(st.deposit)],
  ];
  return (
    <section className="sec soft">
      <div className="wrap faq-wrap">
        <div>
          <Head kicker={fq.kicker} title={`${fq.title1} <em>${fq.title2}</em>`} />
          <div className="facts">
            {facts.map(([k, v], i) => (
              <Reveal key={k} delay={i * 0.05} className="fact"><span>{k}</span><b>{v}</b></Reveal>
            ))}
          </div>
          <Reveal className="rules-note">{fq.rules}</Reveal>
        </div>
        <div className="faq">
          {fq.items.map((f, i) => (
            <Reveal key={i} delay={i * 0.05} className={`faq-i ${open === i ? "open" : ""}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{f.q}</span>
                <motion.i animate={{ rotate: open === i ? 45 : 0 }}><Plus size={18} /></motion.i>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div className="faq-a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }}>
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
export function Footer() {
  const { settings: st } = useSettings();
  const { t } = useLang();
  const f = t.foot;
  const LINKS = useLinks();
  return (
    <footer className="foot">
      <div className="wrap">
        <Reveal>
          <Trail className="foot-cta">
            <span className="trail-hint">{f.hint}</span>
            <h2>{f.title1} <em>{f.title2}</em></h2>
            <p>{f.sub}</p>
            <a href="#prenota" className="btn light">{f.cta} <ArrowUpRight size={18} /></a>
          </Trail>
        </Reveal>
        <div className="foot-grid">
          <div>
            <a href="#top" className="brand"><span className="brand-mark">F</span><span className="brand-name">Flori's <em>Home</em></span></a>
            <p>{SITE.address}</p>
          </div>
          <div>
            <span className="lbl">{f.contacts}</span>
            <p><a href={`mailto:${st.email}`}>{st.email}</a><br /><a href={`tel:${String(st.phone).replace(/\s/g, "")}`}>{st.phone}</a></p>
          </div>
          <div>
            <span className="lbl">{f.explore}</span>
            <p className="foot-links">{LINKS.map(([l, h]) => <a key={h} href={h}>{l}</a>)}<a href="#guida">{f.guide}</a></p>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Flori's Home · {f.copy}</span>
          <span>{f.photos}</span>
        </div>
      </div>
    </footer>
  );
}
