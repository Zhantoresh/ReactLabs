import { createSelector } from "@reduxjs/toolkit";
import { flightsAdapter } from "./flightsSlice.js";
import { filterFlights, paginate, sortFlights } from "../../utils/flightList.js";


export const { selectAll: selectAllFlights, selectById: selectFlightByNumericId } = flightsAdapter.getSelectors(
  (state) => state.flights,
);

// Reusable selectors
export const selectFlightsListState = (state) => state.flights.list;
export const selectFlightDetailState = (state, id) => state.flights.details[String(id)];
export const selectFlightById = (state, id) => selectFlightByNumericId(state, Number(id));


export const selectFlightsPage = createSelector(
  [
    selectAllFlights,
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


export const selectAdjacentFlights = createSelector(
  [selectAllFlights, (_state, id) => Number(id)],
  (flights, id) => {
    const index = flights.findIndex((flight) => flight.id === id);
    if (index === -1) return { prev: null, next: null };
    return { prev: flights[index - 1] ?? null, next: flights[index + 1] ?? null };
  },
);