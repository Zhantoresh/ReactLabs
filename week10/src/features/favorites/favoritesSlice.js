import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { getFavorites, toggleFavorite as toggleFavoriteRequest } from "../../services/favorites.js";
import { toRejectValue, withRetry } from "../../store/requestHelpers.js";
import { selectVisibleFlights } from "../flights/flightsSelectors.js";

// "My flights": ids of the flights the signed-in user saved with ☆ (one user at a time).
const initialState = {
  uid: null, // whose list is loaded
  ids: [],
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  "favorites/fetch",
  async (uid, { rejectWithValue }) => {
    try {
      return await withRetry(() => getFavorites(uid));
    } catch (err) {
      return rejectWithValue(toRejectValue(err));
    }
  },
  {
    // already loaded (or loading) for this user: no new request
    condition: (uid, { getState }) => {
      const { uid: loadedUid, status } = getState().favorites;
      if (loadedUid === uid && (status === "loading" || status === "succeeded")) return false;
    },
  },
);

// Optimistic: the star changes at once (pending), rolls back if the request fails (rejected).
export const toggleFavorite = createAsyncThunk(
  "favorites/toggle",
  async ({ uid, flightId }, { rejectWithValue }) => {
    try {
      return await toggleFavoriteRequest(uid, flightId); // the new list of ids
    } catch (err) {
      return rejectWithValue(toRejectValue(err));
    }
  },
);

function flip(ids, flightId) {
  const id = Number(flightId);
  return ids.includes(id) ? ids.filter((saved) => saved !== id) : [...ids, id];
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    // logout: personal data must not stay in memory
    favoritesCleared: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state, action) => {
        state.uid = action.meta.arg;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        if (state.uid !== action.meta.arg) return; // another user logged in meanwhile
        state.ids = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        if (state.uid !== action.meta.arg) return;
        state.status = "failed";
        state.error = action.payload ?? { message: action.error.message, kind: "error" };
      })
      .addCase(toggleFavorite.pending, (state, action) => {
        state.ids = flip(state.ids, action.meta.arg.flightId);
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (state.uid === action.meta.arg.uid) state.ids = action.payload;
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.ids = flip(state.ids, action.meta.arg.flightId); // rollback
      });
  },
});

export const { favoritesCleared } = favoritesSlice.actions;
export default favoritesSlice.reducer;

// ---------- selectors ----------
export const selectFavoritesState = (state) => state.favorites;
export const selectFavoriteIds = (state) => state.favorites.ids;
export const selectIsFavorite = (state, flightId) => state.favorites.ids.includes(Number(flightId));

// MEMOIZED: the saved flights themselves (My flights page), in departure order.
export const selectFavoriteFlights = createSelector([selectVisibleFlights, selectFavoriteIds], (flights, ids) =>
  flights.filter((flight) => ids.includes(flight.id)),
);
