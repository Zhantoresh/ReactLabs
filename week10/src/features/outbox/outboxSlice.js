import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { deleteOutboxItem, putOutboxItem, readOutbox } from "../../api/outboxDb.js";
import { NotFoundError, OfflineError, updateFlight } from "../../services/service.js";


const initialState = {
  items: [], // { uid, flightId, flightName, status, createdAt, lastError }
  loaded: false,
  flushing: false,
};

export const loadOutbox = createAsyncThunk("outbox/load", () => readOutbox(), {
  condition: (_arg, { getState }) => !getState().outbox.loaded,
});


export const queueStatusChange = createAsyncThunk("outbox/queue", async ({ uid, flight, status }) => {
  await putOutboxItem({
    uid,
    flightId: flight.id,
    flightName: flight.name,
    status,
    createdAt: Date.now(),
    lastError: "",
  });
  return readOutbox();
});

export const discardChange = createAsyncThunk("outbox/discard", async ({ uid, flightId }) => {
  await deleteOutboxItem(uid, flightId);
  return readOutbox();
});


export const flushOutbox = createAsyncThunk(
  "outbox/flush",
  async (uid) => {
    const sent = [];
    const failed = [];
    const mine = (await readOutbox()).filter((item) => item.uid === uid);

    for (const item of mine) {
      try {
        await updateFlight(item.flightId, { status: item.status });
        await deleteOutboxItem(uid, item.flightId);
        sent.push(item);
      } catch (err) {
        if (err instanceof OfflineError) break; 
        if (err instanceof NotFoundError) {
          await deleteOutboxItem(uid, item.flightId); 
          failed.push({ ...item, lastError: "the flight was deleted" });
        } else {
          await putOutboxItem({ ...item, lastError: err.message }); 
          failed.push({ ...item, lastError: err.message });
        }
      }
    }
    return { sent, failed, items: await readOutbox() };
  },
  {
    condition: (_uid, { getState }) => !getState().outbox.flushing, // one sending at a time
  },
);

const outboxSlice = createSlice({
  name: "outbox",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadOutbox.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loaded = true;
      })
      .addCase(queueStatusChange.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(discardChange.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(flushOutbox.pending, (state) => {
        state.flushing = true;
      })
      .addCase(flushOutbox.fulfilled, (state, action) => {
        state.flushing = false;
        state.items = action.payload.items;
      })
      .addCase(flushOutbox.rejected, (state) => {
        state.flushing = false;
      });
  },
});

export default outboxSlice.reducer;

// ---------- selectors ----------
export const selectOutboxFlushing = (state) => state.outbox.flushing;


export const selectOutboxItemsForUser = createSelector(
  [(state) => state.outbox.items, (_state, uid) => uid],
  (items, uid) => (uid ? items.filter((item) => item.uid === uid) : []),
);