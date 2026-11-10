import { lazy, Suspense, useEffect, useState } from "react";
import "lenis/dist/lenis.css";
import { Nav, MobileBar, useSmoothScroll } from "./components/Chrome";
import { Hero, Trust } from "./components/Hero";
import Tour from "./components/Tour";
import Door, { shouldPlayIntro } from "./components/Door";
import Activities from "./components/Activities";
import { Stack, Wave } from "./components/Wow";
import { Bento, Amenities, Reviews, Bergamo, Booking, Faq, Footer } from "./components/Sections";
import { SettingsProvider } from "./lib/settings";
import { BookingProvider } from "./lib/booking";
import { LangProvider } from "./i18n";

// Il pannello admin viene scaricato solo da chi apre #admin
const Admin = lazy(() => import("./admin/Admin"));

function Site() {
  useSmoothScroll();
  const [intro, setIntro] = useState(shouldPlayIntro);
  const [revealed, setRevealed] = useState(!intro);
  useEffect(() => {
    const l = window.__lenis;
    if (intro) {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      l?.stop();
      document.documentElement.classList.add("intro-on");
    } else {
      l?.start();
      document.documentElement.classList.remove("intro-on");
    }
  }, [intro]);
  return (
    <LangProvider>
    <SettingsProvider>
      <BookingProvider>
        <Nav />
        <main>
          {intro && <Door onReveal={() => setRevealed(true)} onDone={() => setIntro(false)} />}
          <Hero key={revealed ? "hero" : "hero-wait"} />
          <Trust />
          <Bento />
          <Tour />
          <Wave from="var(--bg)" to="var(--bg-2)" />
          <Stack />
          <Wave from="var(--bg-2)" to="var(--bg)" flip />
          <Amenities />
          <Reviews />
          <Bergamo />
          <Activities />
          <Booking />
          <Faq />
        </main>
        <Footer />
        <MobileBar />
      </BookingProvider>
    </SettingsProvider>
    </LangProvider>
  );
}

const isAdminHash = () => window.location.hash.startsWith("#admin");

export default function App() {
  const [admin] = useState(isAdminHash);
  useEffect(() => {
    const f = () => isAdminHash() !== admin && window.location.reload();
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, [admin]);

  if (admin) {
    return (
      <Suspense fallback={<div className="adm-loading"><span /></div>}>
        <Admin />
      </Suspense>
    );
  }
  return <Site />;
}
