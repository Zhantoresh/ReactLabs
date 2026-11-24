import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import {
  createFlight as createFlightRequest,
  deleteFlight as deleteFlightRequest,
  getAllFlights,
  getFlight,
  OfflineError,
  updateFlight as updateFlightRequest,
} from "../../services/service.js";
import { STALE_AFTER_MS, toRejectValue, withRetry } from "../../store/requestHelpers.js";
import { queueStatusChange } from "../outbox/outboxSlice.js";

// Flights are stored ONCE, normalized by id: { ids: [3, 7, …], entities: { 3: {…}, 7: {…} } }.
// The list page, the live board, the dashboard, My flights, previous/next links and the
// details page all read the same entities through selectors — no copies of the same flight.
// sortComparer keeps the ids ordered by departure time.
export const flightsAdapter = createEntityAdapter({
  sortComparer: (a, b) => String(a.departureTime).localeCompare(String(b.departureTime)),
});

const initialState = flightsAdapter.getInitialState({
  // loading of the whole collection
  list: {
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null, // { message, kind } of the last failure
    lastFetched: null, // ms, last successful load
    cachedAt: null, // not null = the data is a saved offline copy (Service Worker)
    requestId: null, // id of the request that is running now (stale responses are ignored)
  },
  // loading of single flights: { "12": { status, error, lastFetched, cachedAt, requestId } }
  details: {},
  // optimistic status changes: { 12: "boarding" } = previous status, to roll back on error
  previousStatus: {},
  // flights the user removed but can still restore with Undo: { 12: true }
  // they are hidden by the selectors and really deleted after a few seconds (store/listeners.js)
  pendingDeletion: {},
});

// ---------- thunks: reading ----------

// All flights (list, board, dashboard). Skipped while a request is running
// or while the data is fresh — unless { force: true } (Reload button, after changes).
export const fetchFlights = createAsyncThunk(
  "flights/fetchAll",
  async (_options, { rejectWithValue }) => {
    try {
      return await withRetry(() => getAllFlights());
    } catch (err) {
      return rejectWithValue(toRejectValue(err));
    }
  },
  {
    condition: ({ force = false } = {}, { getState }) => {
      const { status, lastFetched, cachedAt } = getState().flights.list;
      if (status === "loading") return false; // the same request is already running
      const fresh = lastFetched && !cachedAt && Date.now() - lastFetched < STALE_AFTER_MS;
      if (!force && fresh) return false; // nothing new to expect yet
    },
  },
);

// One flight (details page, prefetch on hover).
export const fetchFlightById = createAsyncThunk(
  "flights/fetchById",
  async ({ id }, { rejectWithValue }) => {
    try {
      return await withRetry(() => getFlight(id)); // { flight, cachedAt }
    } catch (err) {
      return rejectWithValue(toRejectValue(err));
    }
  },
  {
    condition: ({ id, force = false }, { getState }) => {
      const detail = getState().flights.details[String(id)];
      if (detail?.status === "loading") return false;
      const fresh = detail?.lastFetched && !detail.cachedAt && Date.now() - detail.lastFetched < STALE_AFTER_MS;
      if (!force && fresh) return false;
    },
  },
);

// ---------- thunks: changes (signed-in users) ----------
// After every change the affected flight is updated in the store at once,
// and the whole collection is reloaded in the background (fetchFlights force).

export const createFlight = createAsyncThunk("flights/create", async (values, { dispatch, rejectWithValue }) => {
  try {
    const result = await createFlightRequest(values); // { flight, warning }
    dispatch(fetchFlights({ force: true }));
    return result;
  } catch (err) {
    return rejectWithValue(toRejectValue(err));
  }
});

export const updateFlight = createAsyncThunk(
  "flights/update",
  async ({ id, changes }, { dispatch, rejectWithValue }) => {
    try {
      const flight = await updateFlightRequest(id, changes);
      dispatch(fetchFlights({ force: true }));
      return flight;
    } catch (err) {
      return rejectWithValue(toRejectValue(err));
    }
  },
);

// Status change: optimistic (pending shows the new status at once, rejected rolls it back).
// Without internet the change goes to the offline outbox instead of failing.
//   dispatch(changeFlightStatus({ id, status, uid })) -> { flight, queued }
export const changeFlightStatus = createAsyncThunk(
  "flights/changeStatus",
  async ({ id, status, uid }, { dispatch, getState, rejectWithValue }) => {
    try {
      const flight = await updateFlightRequest(id, { status });
      dispatch(fetchFlights({ force: true }));
      return { flight, queued: false };
    } catch (err) {
      if (err instanceof OfflineError && uid) {
        const flight = getState().flights.entities[Number(id)] ?? { id: Number(id), name: `#${id}` };
        await dispatch(queueStatusChange({ uid, flight, status })).unwrap();
        return { flight: null, queued: true };
      }
      return rejectWithValue(toRejectValue(err));
    }
  },
);

export const deleteFlight = createAsyncThunk("flights/delete", async (id, { dispatch, rejectWithValue }) => {
  try {
    await deleteFlightRequest(id);
    dispatch(fetchFlights({ force: true }));
    return Number(id);
  } catch (err) {
    return rejectWithValue(toRejectValue(err));
  }
});

// ---------- slice ----------

const flightsSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    // Remove button: hide the flight now, delete it on the server after the Undo time
    deletionScheduled: {
      reducer: (state, action) => {
        state.pendingDeletion[action.payload.id] = true;
      },
      prepare: ({ id, name }) => ({ payload: { id: Number(id), name } }),
    },
    // Undo button: show the flight again, nothing is sent to the server
    deletionCancelled: (state, action) => {
      delete state.pendingDeletion[Number(action.payload)];
    },
  },
  // pending / fulfilled / rejected of every thunk
  extraReducers: (builder) => {
    builder
      // ----- whole collection -----
      .addCase(fetchFlights.pending, (state, action) => {
        state.list.status = "loading";
        state.list.requestId = action.meta.requestId;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        if (state.list.requestId !== action.meta.requestId) return; // a newer request started: ignore
        flightsAdapter.setAll(state, action.payload.flights);
        state.list.status = "succeeded";
        state.list.error = null;
        state.list.lastFetched = Date.now();
        state.list.cachedAt = action.payload.cachedAt;
        state.list.requestId = null;
        // fresh data from the server: single flights are not "saved copies" any more
        if (!action.payload.cachedAt) {
          Object.values(state.details).forEach((detail) => {
            detail.cachedAt = null;
          });
        }
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        if (state.list.requestId !== action.meta.requestId) return;
        state.list.status = "failed"; // the old flights stay in the store (shown with a warning)
        state.list.error = action.payload ?? { message: action.error.message, kind: "error" };
        state.list.requestId = null;
      })

      // ----- one flight -----
      .addCase(fetchFlightById.pending, (state, action) => {
        const key = String(action.meta.arg.id);
        state.details[key] = { ...state.details[key], status: "loading", requestId: action.meta.requestId };
      })
      .addCase(fetchFlightById.fulfilled, (state, action) => {
        const key = String(action.meta.arg.id);
        if (state.details[key]?.requestId !== action.meta.requestId) return;
        flightsAdapter.upsertOne(state, action.payload.flight); // same entity the lists use
        state.details[key] = {
          status: "succeeded",
          error: null,
          lastFetched: Date.now(),
          cachedAt: action.payload.cachedAt,
          requestId: null,
        };
      })
      .addCase(fetchFlightById.rejected, (state, action) => {
        const key = String(action.meta.arg.id);
        if (state.details[key]?.requestId !== action.meta.requestId) return;
        const error = action.payload ?? { message: action.error.message, kind: "error" };
        if (error.kind === "notfound") flightsAdapter.removeOne(state, Number(key)); // deleted on the server
        state.details[key] = {
          ...state.details[key],
          status: error.kind === "notfound" ? "notfound" : "failed",
          error,
          requestId: null,
        };
      })

      // ----- create / edit / delete -----
      .addCase(createFlight.fulfilled, (state, action) => {
        const { flight } = action.payload;
        flightsAdapter.addOne(state, flight);
        state.details[String(flight.id)] = { status: "succeeded", error: null, lastFetched: Date.now(), cachedAt: null };
      })
      .addCase(updateFlight.fulfilled, (state, action) => {
        flightsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deleteFlight.fulfilled, (state, action) => {
        flightsAdapter.removeOne(state, action.payload);
        delete state.pendingDeletion[action.payload];
        state.details[String(action.payload)] = {
          status: "notfound",
          error: { message: `Flight #${action.payload} was deleted`, kind: "notfound" },
        };
      })

      .addCase(deleteFlight.rejected, (state, action) => {
        delete state.pendingDeletion[Number(action.meta.arg)]; // not deleted: show it again
      })

      // ----- status: optimistic update -----
      .addCase(changeFlightStatus.pending, (state, action) => {
        const id = Number(action.meta.arg.id);
        const flight = state.entities[id];
        if (!flight) return;
        state.previousStatus[id] = flight.status; // snapshot for rollback
        flight.status = action.meta.arg.status; // shown immediately
      })
      .addCase(changeFlightStatus.fulfilled, (state, action) => {
        const id = Number(action.meta.arg.id);
        delete state.previousStatus[id];
        if (action.payload.queued) {
          const flight = state.entities[id];
          if (flight) flight.pendingStatus = true; // waiting in the offline outbox (⏳)
        } else {
          flightsAdapter.upsertOne(state, action.payload.flight);
        }
      })
      .addCase(changeFlightStatus.rejected, (state, action) => {
        const id = Number(action.meta.arg.id);
        const flight = state.entities[id];
        if (flight && id in state.previousStatus) flight.status = state.previousStatus[id]; // rollback
        delete state.previousStatus[id];
      });
  },
});

export const { deletionScheduled, deletionCancelled } = flightsSlice.actions;
export default flightsSlice.reducer;
