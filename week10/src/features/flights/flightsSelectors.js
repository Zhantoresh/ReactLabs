import { createSelector } from "@reduxjs/toolkit";
import { flightsAdapter } from "./flightsSlice.js";
import { filterFlights, paginate, sortFlights } from "../../utils/flightList.js";

// Base selectors from the entity adapter (selectAll is memoized: the same array
// is returned until the flights change). Flights are ordered by departure time.
export const { selectAll: selectAllFlights, selectById: selectFlightByNumericId } = flightsAdapter.getSelectors(
  (state) => state.flights,
);

// MEMOIZED: all flights except the ones waiting for Undo (removed a moment ago).
// Every list in the app reads this one, so a removed flight disappears everywhere at once.
const selectPendingDeletion = (state) => state.flights.pendingDeletion;
export const selectVisibleFlights = createSelector([selectAllFlights, selectPendingDeletion], (flights, pending) =>
  Object.keys(pending).length === 0 ? flights : flights.filter((flight) => !pending[flight.id]),
);

// Reusable selectors
export const selectFlightsListState = (state) => state.flights.list;
export const selectFlightDetailState = (state, id) => state.flights.details[String(id)];
export const selectFlightById = (state, id) => selectFlightByNumericId(state, Number(id));

// MEMOIZED: one page of the list for the filters in the URL.
// createSelector recalculates only when the flights or one of the params change;
// re-renders with the same values reuse the previous result (same array, no extra work).
//   useSelector((state) => selectFlightsPage(state, { search, status, terminal, sort, page, limit }))
export const selectFlightsPage = createSelector(
  [
    selectVisibleFlights,
    (_state, params) => params.search,
    (_state, params) => params.status,
    (_state, params) => params.terminal,
    (_state, params) => params.sort,
    (_state, params) => params.page,
    (_state, params) => params.limit,
  ],
  (flights, search, status, terminal, sort, page, limit) =>
    paginate(sortFlights(filterFlights(flights, { search, status, terminal }), sort), page, limit),
);

// MEMOIZED: previous / next departure around one flight (details page).
export const selectAdjacentFlights = createSelector(
  [selectVisibleFlights, (_state, id) => Number(id)],
  (flights, id) => {
    const index = flights.findIndex((flight) => flight.id === id);
    if (index === -1) return { prev: null, next: null };
    return { prev: flights[index - 1] ?? null, next: flights[index + 1] ?? null };
  },
);
