import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Landmark, TramFront, Palette, Drama, Factory, FerrisWheel, Waves, Ship, Sailboat, ChefHat, Trophy, ShoppingBag, Compass,
} from "lucide-react";
import { SITE } from "../data";

const ICONS = { Landmark, TramFront, Palette, Drama, Factory, FerrisWheel, Waves, Ship, Sailboat, ChefHat, Trophy, ShoppingBag, Compass };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/* Mappa delle attività: segnaposto colorati per categoria + la casa al centro */
const CITY_KM = 8; // entro questa distanza = "Bergamo"

export default function ActMap({ list, k, onReady }) {
  const box = useRef(null);
  const pts = useRef({ all: [], city: [] });
  const map = useRef(null);
  const layer = useRef(null);
  const roots = useRef([]);

  useEffect(() => {
    const m = L.map(box.current, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 18,
      subdomains: "abcd",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(m);
    const { lat, lng } = SITE.coords;
    L.marker([lat, lng], {
      icon: L.divIcon({ className: "mk-home", html: '<span>F</span>', iconSize: [46, 46], iconAnchor: [23, 23] }),
      zIndexOffset: 1000,
      keyboard: false,
    }).addTo(m).bindTooltip(k.home, { direction: "top", offset: [0, -22] });
    layer.current = L.layerGroup().addTo(m);
    map.current = m;
    onReady?.();
    return () => { roots.current.forEach((r) => setTimeout(() => r.unmount())); m.remove(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    roots.current.forEach((r) => setTimeout(() => r.unmount()));
    roots.current = [];
    layer.current.clearLayers();
    const pp = [[SITE.coords.lat, SITE.coords.lng]];
    for (const a of list) {
      if (a.lat == null) continue;
      const txt = k.items[a.id];
      const mk = L.marker([a.lat, a.lng], {
        icon: L.divIcon({ className: `mk mk-${a.cat}`, html: '<span class="mk-pin"><i></i></span>', iconSize: [38, 46], iconAnchor: [19, 44], popupAnchor: [0, -40] }),
        title: txt.title,
      });
      mk.bindPopup(
        `<div class="mp"><small>${esc(k.cats[a.cat])} · ${a.min} min</small><b>${esc(txt.title)}</b><p>${esc(txt.desc)}</p>` +
        `<a href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">${esc(k.cta[a.cta])} ↗</a></div>`,
        { maxWidth: 260, className: "mp-wrap" },
      );
      mk.on("add", () => {
        const el = mk.getElement()?.querySelector("i");
        if (!el) return;
        const r = createRoot(el);
        const I = ICONS[a.icon] || Compass;
        r.render(<I size={17} strokeWidth={2} />);
        roots.current.push(r);
      });
      mk.addTo(layer.current);
      pp.push([a.lat, a.lng]);
    }
    const city = pp.filter((_, i) => i === 0 || (list.filter((a) => a.lat != null)[i - 1]?.km ?? 99) <= CITY_KM);
    pts.current = { all: pp, city: city.length > 1 ? city : pp };
    m.fitBounds(L.latLngBounds(pp), { padding: [46, 46], maxZoom: 13 });
  }, [list, k]);

  const zoom = (which) => map.current?.flyToBounds(L.latLngBounds(pts.current[which]), { padding: [56, 56], maxZoom: 14, duration: 0.9 });

  return (
    <div className="act-map-box">
      <div className="act-map" ref={box} />
      <div className="act-zoom">
        <button onClick={() => zoom("city")}>{k.zoomCity}</button>
        <button onClick={() => zoom("all")}>{k.zoomAll}</button>
      </div>
    </div>
  );
}
