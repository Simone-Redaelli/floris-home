import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig, isConfigured } from "../lib/firebase-config";

let fb = null;
export function getFb() {
  if (!fb && isConfigured) {
    const app = initializeApp(firebaseConfig);
    fb = { auth: getAuth(app), db: getFirestore(app) };
  }
  return fb;
}

