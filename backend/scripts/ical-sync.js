// Sincronizza i calendari Booking/Airbnb e scrive i file .ics del sito.
// Uso: node scripts/ical-sync.js [--out cartella]
// Lo esegue in automatico GitHub Actions ogni 30 minuti (vedi .github/workflows/ical-sync.yml).
import { syncIcal } from '../src/ical.js';
import { firebaseReady } from '../src/firebase.js';

const i = process.argv.indexOf('--out');
const outDir = i > -1 ? process.argv[i + 1] : null;

if (!firebaseReady) {
  console.log('ℹ️  Account di servizio Firebase non impostato: sincronizzazione saltata.');
  process.exit(0);
}
try {
  const r = await syncIcal({ outDir });
  console.log(`✅ Sincronizzazione completata: ${r.extBlocked.length} notti occupate fuori dal sito.`);
  process.exit(0);
} catch (err) {
  console.error('❌ Sincronizzazione non riuscita:', err.message);
  process.exit(1);
}
