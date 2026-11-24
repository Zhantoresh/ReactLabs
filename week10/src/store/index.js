import { configureStore } from "@reduxjs/toolkit";
import flightsReducer from "../features/flights/flightsSlice.js";
import favoritesReducer from "../features/favorites/favoritesSlice.js";
import outboxReducer from "../features/outbox/outboxSlice.js";


export const store = configureStore({
  reducer: {
    flights: flightsReducer,
    favorites: favoritesReducer,
    outbox: outboxReducer,
  },
});