import 'dotenv/config';

export const digits = (s) => String(s ?? '').replace(/\D/g, '');

const e = process.env;

export const env = {
  port: Number(e.PORT || 3002),
  publicUrl: (e.PUBLIC_URL || 'http://localhost:5173').replace(/\/$/, ''),
  allowedOrigins: (e.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean),
  dryRun: e.DRY_RUN === 'true',
  dataDir: e.DATA_DIR || './data',
  admin: {
    name: e.ADMIN_NAME || "Flori's Home",
    email: e.ADMIN_EMAIL || '',
    phone: digits(e.ADMIN_PHONE),
    // email con cui entri nel pannello admin del sito (di solito la stessa)
    panelEmail: (e.PANEL_ADMIN_EMAIL || e.ADMIN_EMAIL || '').toLowerCase(),
  },
  wa: {
    token: e.WA_TOKEN || '',
    phoneNumberId: e.WA_PHONE_NUMBER_ID || '',
    verifyToken: e.WA_VERIFY_TOKEN || '',
    appSecret: e.WA_APP_SECRET || '',
    apiVersion: e.WA_API_VERSION || 'v25.0',
    lang: e.WA_TEMPLATE_LANG || 'it',
    useTemplates: e.WA_USE_TEMPLATES !== 'false',
  },
  google: {
    clientId: e.GOOGLE_CLIENT_ID || '',
    clientSecret: e.GOOGLE_CLIENT_SECRET || '',
    refreshToken: e.GOOGLE_REFRESH_TOKEN || '',
    calendarId: e.GOOGLE_CALENDAR_ID || 'primary',
  },
  firebase: {
    // percorso del file JSON dell'account di servizio, oppure lo stesso JSON in base64
    serviceAccountPath: e.FIREBASE_SERVICE_ACCOUNT_PATH || '',
    serviceAccountBase64: e.FIREBASE_SERVICE_ACCOUNT_BASE64 || '',
  },
  property: {
    name: e.PROPERTY_NAME || "Flori's Home",
    address: e.PROPERTY_ADDRESS || 'Via San Pio X, 16 — 24125 Bergamo',
  },
  timezone: 'Europe/Rome',
};

export function checkEnv() {
  const required = {
    ADMIN_EMAIL: env.admin.email,
    ADMIN_PHONE: env.admin.phone,
    WA_TOKEN: env.wa.token,
    WA_PHONE_NUMBER_ID: env.wa.phoneNumberId,
    WA_VERIFY_TOKEN: env.wa.verifyToken,
    WA_APP_SECRET: env.wa.appSecret,
    GOOGLE_CLIENT_ID: env.google.clientId,
    GOOGLE_CLIENT_SECRET: env.google.clientSecret,
    GOOGLE_REFRESH_TOKEN: env.google.refreshToken,
    'FIREBASE_SERVICE_ACCOUNT_PATH o _BASE64': env.firebase.serviceAccountPath || env.firebase.serviceAccountBase64,
  };
  const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
  if (env.dryRun) {
    console.log('🧪 DRY_RUN attivo: WhatsApp, Gmail e Calendar vengono solo simulati nel terminale.');
  } else if (missing.length) {
    console.warn(`⚠️  Variabili mancanti nel .env: ${missing.join(', ')}`);
  }
}
