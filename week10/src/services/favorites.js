import { getFavoriteIds, toggleFavoriteId } from "../api/favoritesApi.js";

export function getFavorites(uid) {
  return getFavoriteIds(uid);
}

export function toggleFavorite(uid, flightId) {
  return toggleFavoriteId(uid, flightId);
}