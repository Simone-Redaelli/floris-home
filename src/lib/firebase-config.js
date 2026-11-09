// ============================================================
//  CONFIGURAZIONE FIREBASE
//  1. Crea un progetto su https://console.firebase.google.com
//  2. Aggiungi un'app Web e copia qui sotto i valori di "firebaseConfig"
//  3. Imposta ADMIN_EMAIL con l'email dell'account amministratore
//  (Questi valori sono pubblici per natura: la sicurezza la fanno
//   il login e le regole di Firestore, vedi README.)
// ============================================================

export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

export const ADMIN_EMAIL = "";

export const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
