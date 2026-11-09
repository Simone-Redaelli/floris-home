// Elenco Stati (nomi in italiano generati dal browser)
const CODES = "IT AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI KH CM CA CV CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HK HU IS IN ID IR IQ IE IL JM JP JO KZ KE KI XK KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG KP MK NO OM PK PW PS PA PG PY PE PH PL PT PR QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW".split(" ");

let names = CODES;
try {
  const dn = new Intl.DisplayNames(["it"], { type: "region" });
  const it = dn.of("IT");
  names = [it, ...CODES.slice(1).map((c) => dn.of(c)).sort((a, b) => a.localeCompare(b, "it"))];
} catch {
  /* browser vecchio: restano i codici */
}
export const COUNTRIES = names;

export const DOC_TYPES = ["Carta d'identità", "Passaporto", "Patente di guida"];

export function ageOf(birth) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birth || "")) return null;
  const [y, m, d] = birth.split("-").map(Number);
  const now = new Date();
  let a = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) a--;
  return a >= 0 && a < 120 ? a : null;
}
