// ============================================================
//  CONFIGURAZIONE FIREBASE
//  1. Crea un progetto su https://console.firebase.google.com
//  2. Aggiungi un'app Web e copia qui sotto i valori di "firebaseConfig"
//  3. Imposta ADMIN_EMAIL con l'email dell'account amministratore
//  (Questi valori sono pubblici per natura: la sicurezza la fanno
//   il login e le regole di Firestore, vedi README.)
// ============================================================

export const firebaseConfig = {
  apiKey: "AIzaSyB0QJHXYmsLkk08uCa7_8rb6jNorsyggl4",
  authDomain: "flori-cf1fc.firebaseapp.com",
  projectId: "flori-cf1fc",
  storageBucket: "flori-cf1fc.firebasestorage.app",
  messagingSenderId: "570848539",
  appId: "1:570848539:web:7382f0972caede756a4fbe",
};

export const ADMIN_EMAIL = "";

export const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
