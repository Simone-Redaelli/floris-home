import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import "lenis/dist/lenis.css";
import { Preloader, Cursor, Nav, useSmoothScroll } from "./components/Chrome";
import { Hero, Stats, Manifesto } from "./components/Hero";
import Tour from "./components/Tour";
import { HGallery, Amenities, Marquee, Bergamo, Reviews, Booking, Info, Footer } from "./components/Sections";
import { SettingsProvider } from "./lib/settings";

// Il pannello admin viene scaricato solo da chi apre #admin
const Admin = lazy(() => import("./admin/Admin"));

function Site() {
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);
  useSmoothScroll(ready);

  return (
    <SettingsProvider>
      <Preloader onDone={done} />
      <Cursor />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Stats />
        <Manifesto />
        <Tour />
        <HGallery />
        <Marquee items={["Wi-Fi gratuito", "Parcheggio incluso", "Pet friendly", "Aria condizionata", "Balcone sul verde", "Smart TV", "Fino a 5 ospiti"]} />
        <Amenities />
        <Bergamo />
        <Reviews />
        <Booking />
        <Info />
      </main>
      <Footer />
    </SettingsProvider>
  );
}

const isAdminHash = () => window.location.hash.startsWith("#admin");

export default function App() {
  const [admin] = useState(isAdminHash);
  useEffect(() => {
    const f = () => {
      const a = isAdminHash();
      if (a !== admin) window.location.reload();
    };
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
