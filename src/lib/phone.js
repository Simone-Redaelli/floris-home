/* Prefissi internazionali: l'ospite sceglie il paese e scrive solo il numero */
export const DIAL = [
  ["IT", "39"], ["GB", "44"], ["FR", "33"], ["ES", "34"], ["DE", "49"], ["PL", "48"], ["CH", "41"], ["AT", "43"],
  ["NL", "31"], ["BE", "32"], ["PT", "351"], ["IE", "353"], ["LU", "352"], ["DK", "45"], ["SE", "46"], ["NO", "47"],
  ["FI", "358"], ["IS", "354"], ["CZ", "420"], ["SK", "421"], ["HU", "36"], ["RO", "40"], ["BG", "359"], ["GR", "30"],
  ["HR", "385"], ["SI", "386"], ["RS", "381"], ["BA", "387"], ["ME", "382"], ["MK", "389"], ["AL", "355"], ["XK", "383"],
  ["UA", "380"], ["MD", "373"], ["LT", "370"], ["LV", "371"], ["EE", "372"], ["BY", "375"], ["RU", "7"], ["TR", "90"],
  ["CY", "357"], ["MT", "356"], ["SM", "378"], ["VA", "379"], ["MC", "377"], ["AD", "376"], ["LI", "423"],
  ["US", "1"], ["CA", "1"], ["MX", "52"], ["BR", "55"], ["AR", "54"], ["CL", "56"], ["CO", "57"], ["PE", "51"],
  ["VE", "58"], ["EC", "593"], ["UY", "598"], ["AU", "61"], ["NZ", "64"], ["JP", "81"], ["KR", "82"], ["CN", "86"],
  ["IN", "91"], ["PK", "92"], ["BD", "880"], ["LK", "94"], ["PH", "63"], ["TH", "66"], ["VN", "84"], ["ID", "62"],
  ["MY", "60"], ["SG", "65"], ["AE", "971"], ["SA", "966"], ["QA", "974"], ["IL", "972"], ["EG", "20"], ["MA", "212"],
  ["TN", "216"], ["DZ", "213"], ["NG", "234"], ["ZA", "27"], ["SN", "221"], ["GH", "233"], ["KE", "254"], ["ET", "251"],
];
// in cima alla lista
export const TOP = ["IT", "GB", "FR", "ES", "DE", "PL", "CH", "AT", "NL", "BE", "US", "RO", "AL"];

export const flag = (iso) => String.fromCodePoint(...[...iso].map((c) => 0x1f1a5 + c.charCodeAt(0)));
export const dialOf = (iso) => (DIAL.find(([i]) => i === iso) || DIAL[0])[1];

const LANG_ISO = { it: "IT", en: "GB", fr: "FR", es: "ES", de: "DE", pl: "PL" };
export function defaultIso(lang) {
  let reg = "";
  try { reg = ((navigator.languages?.[0] || navigator.language || "").split("-")[1] || "").toUpperCase(); } catch { /* niente */ }
  // il paese del browser vince se è compatibile con la lingua (es. de-CH → Svizzera, en-US → USA)
  if (reg && DIAL.some(([i]) => i === reg) && (reg === LANG_ISO[lang] || ["CH", "AT", "US", "IE", "BE", "CA", "AU", "MX", "AR"].includes(reg))) return reg;
  return LANG_ISO[lang] || "IT";
}

/* "+39 333…" incollato nel campo numero → { iso, local } */
export function splitPasted(raw) {
  let d = String(raw).trim();
  if (!/^(\+|00)/.test(d)) return null;
  d = d.replace(/^00/, "").replace(/\D/g, "");
  const hit = [...DIAL].sort((a, b) => b[1].length - a[1].length).find(([, c]) => d.startsWith(c));
  return hit ? { iso: hit[0], local: d.slice(hit[1].length) } : null;
}
