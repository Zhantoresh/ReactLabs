import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { toggleFavorite } from "../features/favorites/favoritesSlice.js";
import {
  changeFlightStatus,
  createFlight,
  deleteFlight,
  deletionCancelled,
  deletionScheduled,
  updateFlight,
} from "../features/flights/flightsSlice.js";
import { notificationAdded, notificationDismissed } from "../features/notifications/notificationsSlice.js";

// Listener middleware: code that runs AFTER an action reached the reducers.
// Side effects (toasts, timers, the delayed delete) live here, not in components,
// so every page gets them without extra code and the slices stay pure.
export const listenerMiddleware = createListenerMiddleware();
const { startListening } = listenerMiddleware;

export const UNDO_MS = 5000; // how long the Undo button is shown

const flightName = (state, id) => state.flights.entities[Number(id)]?.name ?? `#${id}`;
const toast = (type, message, extra = {}) => notificationAdded({ type, message, ...extra });

// ---------- success toasts ----------

startListening({
  actionCreator: createFlight.fulfilled,
  effect: (action, api) => {
    api.dispatch(toast("success", `Flight ${action.payload.flight.name} was created`));
  },
});

startListening({
  actionCreator: updateFlight.fulfilled,
  effect: (action, api) => {
    api.dispatch(toast("success", `Flight ${action.payload.name} saved`));
  },
});

startListening({
  actionCreator: changeFlightStatus.fulfilled,
  effect: (action, api) => {
    const { id, status } = action.meta.arg;
    const name = flightName(api.getState(), id);
    if (action.payload.queued) {
      api.dispatch(toast("info", `No connection: ${name} → ${status} will be sent when you are back online`));
    } else {
      api.dispatch(toast("success", `${name}: status changed to ${status}`));
    }
  },
});

startListening({
  actionCreator: toggleFavorite.fulfilled,
  effect: (action, api) => {
    const { flightId } = action.meta.arg;
    const saved = action.payload.includes(Number(flightId));
    const name = flightName(api.getState(), flightId);
    api.dispatch(toast("success", saved ? `${name} saved to My flights` : `${name} removed from My flights`));
  },
});

// ---------- error toasts (one listener for several thunks) ----------
// isAnyOf matches any of these actions; action.payload is { message, kind } from rejectWithValue.

startListening({
  matcher: isAnyOf(changeFlightStatus.rejected, deleteFlight.rejected, toggleFavorite.rejected),
  effect: (action, api) => {
    const message = String(action.payload?.message ?? action.error.message).replace(/\.$/, ""); // no ".."
    const arg = action.meta.arg;
    const id = typeof arg === "object" ? (arg.id ?? arg.flightId) : arg;
    const name = flightName(api.getState(), id);
    let text = `${name}: ${message}`;
    if (changeFlightStatus.rejected.match(action)) text = `Status of ${name} was not changed: ${message}`;
    if (deleteFlight.rejected.match(action)) text = `${name} was not removed: ${message}. It is back in the list.`;
    if (toggleFavorite.rejected.match(action)) text = `My flights not updated: ${message}`;
    api.dispatch(toast("error", text, { duration: 7000 }));
  },
});

// ---------- every toast closes by itself ----------

startListening({
  actionCreator: notificationAdded,
  effect: async (action, api) => {
    const { id, duration, undoDeleteId } = action.payload;
    if (undoDeleteId !== null) return; // the Undo toast is closed by the delete listener below
    await api.delay(duration); // a timer that is cleaned up together with the listener
    api.dispatch(notificationDismissed(id));
  },
});

// ---------- delete with Undo ----------
// 1. Remove button → deletionScheduled: the reducer hides the flight at once (selectors skip it).
// 2. A toast "Flight removed · Undo" with a countdown is shown.
// 3. Undo within UNDO_MS → deletionCancelled: the flight is shown again, no request at all.
//    No Undo → deleteFlight thunk sends DELETE; on error the flight comes back (rejected reducer).

startListening({
  actionCreator: deletionScheduled,
  effect: async (action, api) => {
    const { id, name } = action.payload;
    const toastId = `undo-delete-${id}`;
    api.dispatch(
      toast("info", `Flight ${name} removed`, { id: toastId, duration: UNDO_MS, undoDeleteId: id }),
    );

    // wait for an Undo of THIS flight, at most UNDO_MS; true = it came, false = time is over
    const undone = await api.condition(
      (next) => deletionCancelled.match(next) && Number(next.payload) === id,
      UNDO_MS,
    );
    api.dispatch(notificationDismissed(toastId));

    if (undone) {
      api.dispatch(toast("info", `Flight ${name} restored`));
      return;
    }
    api.dispatch(deleteFlight(id));
  },
});
