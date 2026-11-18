// Flights now live in Firestore (see services/service.js).
// Saved flights ("My flights") are private data of one user, so they stay in localStorage
// and are never sent through the Service Worker caches.
export const FAVORITES_KEY = "departures-board-week09-favorites";

// configs for the fake favorites API (random delay and ~5% simulated errors)
export const API_CONFIG = {
  minDelay: 500,
  maxDelay: 3000,
  errorChance: 0.05,
};