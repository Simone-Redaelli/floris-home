import { useEffect, useRef } from "react";
import Tour from "./components/Tour";
import { Nav, Hero, Marquee, Intro, Gallery, Amenities, Location, Reviews, Booking, Rules, Faq, Footer } from "./components/Sections";

/* Alone luminoso che segue il cursore (solo desktop) */
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const m = (e) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    };
    window.addEventListener("pointermove", m);
    return () => window.removeEventListener("pointermove", m);
  }, []);
  return <div ref={ref} className="cursor-glow" />;
}

export default function App() {
  return (
    <>
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Intro />
        <Tour />
        <Gallery />
        <Amenities />
        <Location />
        <Reviews />
        <Booking />
        <Rules />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
