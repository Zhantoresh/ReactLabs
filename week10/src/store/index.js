import { configureStore } from "@reduxjs/toolkit";
import flightsReducer from "../features/flights/flightsSlice.js";
import favoritesReducer from "../features/favorites/favoritesSlice.js";
import outboxReducer from "../features/outbox/outboxSlice.js";
import notificationsReducer from "../features/notifications/notificationsSlice.js";
import { listenerMiddleware } from "./listeners.js";

// One Redux store for the whole app, made of four feature slices:
//   flights       — all flights (normalized), loading state of the list and of single flights
//   favorites     — "My flights" of the signed-in user
//   outbox        — status changes made offline, waiting to be sent
//   notifications — toast messages (bonus), filled by the listener middleware
// configureStore adds redux-thunk (for createAsyncThunk) and the Redux DevTools.
// The listener middleware goes first (prepend), before the default ones.
export const store = configureStore({
  reducer: {
    flights: flightsReducer,
    favorites: favoritesReducer,
    outbox: outboxReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});
