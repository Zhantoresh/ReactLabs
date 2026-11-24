import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "./useAuth.js";
import {
  fetchFavorites,
  selectFavoriteFlights,
  selectFavoritesState,
  toggleFavorite,
} from "../features/favorites/favoritesSlice.js";


export function useFavorites() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const uid = user?.uid;
  const favorites = useSelector(selectFavoritesState);
  const flights = useSelector(selectFavoriteFlights);

  useEffect(() => {
    if (uid) dispatch(fetchFavorites(uid));
  }, [dispatch, uid]);

  const ids = uid ? favorites.ids : [];
  return {
    ids,
    flights, 
    isSaved: (flightId) => ids.includes(Number(flightId)),
    status: favorites.status === "failed" ? "error" : favorites.status === "succeeded" || !uid ? "success" : "loading",
    error: favorites.error?.message ?? "",
    reload: () => uid && dispatch(fetchFavorites(uid)),
  };
}


export function useToggleFavorite() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  return (flightId) => {
    if (user) dispatch(toggleFavorite({ uid: user.uid, flightId }));
  };
}