import { createContext, useContext, useState } from "react";

/* Date e ospiti scelti dall'utente, condivisi tra la barra in alto e la sezione prenota */
const Ctx = createContext(null);

// date già scelte dal link della lista d'attesa: ?arrivo=2026-12-15&partenza=2026-12-18&ospiti=2
const fromUrl = () => {
  try {
    const q = new URLSearchParams(window.location.search);
    const ok = (d) => (/^\d{4}-\d{2}-\d{2}$/.test(d || "") ? d : null);
    const a = ok(q.get("arrivo"));
    const b = ok(q.get("partenza"));
    return { from: a, to: a && b && b > a ? b : null, guests: Math.min(10, Math.max(1, Number(q.get("ospiti")) || 2)) };
  } catch {
    return { from: null, to: null, guests: 2 };
  }
};

export function BookingProvider({ children }) {
  const [init] = useState(fromUrl);
  const [from, setFrom] = useState(init.from);
  const [to, setTo] = useState(init.to);
  const [guests, setGuests] = useState(init.guests);
  const [transfer, setTransfer] = useState(false);
  const [extras, setExtras] = useState([]); // id dei servizi extra scelti
  const toggleExtra = (id) => setExtras((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]));
  return (
    <Ctx.Provider value={{ from, to, guests, transfer, extras, setFrom, setTo, setGuests, setTransfer, setExtras, toggleExtra }}>
      {children}
    </Ctx.Provider>
  );
}

export const useBooking = () => useContext(Ctx);

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  window.__lenis ? window.__lenis.scrollTo(el, { offset: -20, duration: 1.4 }) : el.scrollIntoView({ behavior: "smooth" });
}
