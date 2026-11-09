import { lazy, Suspense, useEffect, useState } from "react";
import "lenis/dist/lenis.css";
import { Nav, MobileBar, useSmoothScroll } from "./components/Chrome";
import { Hero, Trust } from "./components/Hero";
import Tour from "./components/Tour";
import { Bento, Audience, Amenities, Reviews, Bergamo, Booking, Faq, Footer } from "./components/Sections";
import { SettingsProvider } from "./lib/settings";
import { BookingProvider } from "./lib/booking";

// Il pannello admin viene scaricato solo da chi apre #admin
const Admin = lazy(() => import("./admin/Admin"));

function Site() {
  useSmoothScroll();
  return (
    <SettingsProvider>
      <BookingProvider>
        <Nav />
        <main>
          <Hero />
          <Trust />
          <Bento />
          <Tour />
          <Audience />
          <Amenities />
          <Reviews />
          <Bergamo />
          <Booking />
          <Faq />
        </main>
        <Footer />
        <MobileBar />
      </BookingProvider>
    </SettingsProvider>
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
