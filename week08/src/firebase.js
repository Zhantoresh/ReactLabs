// Firebase is initialized once, here. The rest of the app imports `auth` from this file.
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, GoogleAuthProvider, setPersistence } from "firebase/auth";

// Values come from .env.local (see .env.example). Vite exposes only variables
// that start with VITE_, through import.meta.env, at build time.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
  throw new Error(
    "Firebase config is missing. Copy .env.example to .env.local, fill in the values and restart `npm run dev`.",
  );
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Keep the user signed in after a page refresh / browser restart.
// (local persistence is the default in the browser; set it explicitly to make it visible)
setPersistence(auth, browserLocalPersistence);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });