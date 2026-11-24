import { createSlice, nanoid } from "@reduxjs/toolkit";

// Toast messages shown in the corner of the screen (components/Toaster.jsx).
// Only plain data is stored (no functions), so the state stays serializable:
//   { id, type: "success" | "error" | "info", message, duration, undoDeleteId?, createdAt }
// The listeners in store/listeners.js add them in reaction to thunk results.
const MAX_TOASTS = 4;

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { items: [] },
  reducers: {
    notificationAdded: {
      reducer: (state, action) => {
        // the same id again (e.g. a second delete of one flight) replaces the old toast
        state.items = state.items.filter((item) => item.id !== action.payload.id);
        state.items.push(action.payload);
        if (state.items.length > MAX_TOASTS) state.items.shift(); // the oldest goes away
      },
      // prepare: fills in the id, the type and the time, so callers pass only what matters
      prepare: ({ id, type = "info", message, duration = 4000, undoDeleteId = null }) => ({
        payload: { id: id ?? nanoid(), type, message, duration, undoDeleteId, createdAt: Date.now() },
      }),
    },
    notificationDismissed: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { notificationAdded, notificationDismissed } = notificationsSlice.actions;
export default notificationsSlice.reducer;

export const selectNotifications = (state) => state.notifications.items;
