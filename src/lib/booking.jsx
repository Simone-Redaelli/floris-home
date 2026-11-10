import { createContext, useContext, useState } from "react";

/* Date e ospiti scelti dall'utente, condivisi tra la barra in alto e la sezione prenota */
const Ctx = createContext(null);

export function BookingProvider({ children }) {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [guests, setGuests] = useState(2);
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
