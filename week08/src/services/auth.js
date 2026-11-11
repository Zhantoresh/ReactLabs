// All Firebase Authentication calls live here. UI components never call Firebase directly:
// they use useAuth(), and AuthProvider uses these functions.
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase.js";

export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email.trim(), password);
}

export function logIn(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export function logInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function logOut() {
  return signOut(auth);
}

// Calls `callback(user | null)` now and on every login / logout.
// Returns the unsubscribe function (used as useEffect cleanup).
export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// Firebase error codes -> messages for the user
const MESSAGES = {
  "auth/invalid-credential": "Wrong email or password.",
  "auth/wrong-password": "Wrong email or password.",
  "auth/user-not-found": "Wrong email or password.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/email-already-in-use": "An account with this email already exists. Log in instead.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/missing-password": "Enter a password.",
  "auth/too-many-requests": "Too many attempts. Please wait a bit and try again.",
  "auth/popup-closed-by-user": "Google sign-in was cancelled.",
  "auth/cancelled-popup-request": "Google sign-in was cancelled.",
  "auth/popup-blocked": "The browser blocked the Google popup. Allow popups for this site and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/operation-not-allowed": "This sign-in method is not enabled in the Firebase console.",
  "auth/unauthorized-domain":
    "This domain is not allowed in Firebase. Add it in Authentication → Settings → Authorized domains.",
  "auth/invalid-api-key": "Firebase API key is wrong. Check .env.local.",
};

export function authErrorMessage(error) {
  return MESSAGES[error?.code] ?? error?.message ?? "Something went wrong. Try again.";
}