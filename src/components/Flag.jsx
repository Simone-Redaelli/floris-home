/* Bandiera come immagine: su Windows le emoji delle bandiere si vedono come lettere ("IT") */
const LANG_TO_ISO = { it: "it", en: "gb", fr: "fr", es: "es", de: "de", pl: "pl" };

export default function Flag({ iso, lang, size = 18 }) {
  const c = String(iso || LANG_TO_ISO[lang] || "").toLowerCase();
  if (!c) return null;
  return (
    <img
      className="flag-img"
      src={`https://flagcdn.com/w40/${c}.png`}
      srcSet={`https://flagcdn.com/w80/${c}.png 2x`}
      width={size}
      height={Math.round(size * 0.72)}
      alt=""
      loading="lazy"
      decoding="async"
    />
  );
}
