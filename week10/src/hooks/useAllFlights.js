import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlights } from "../features/flights/flightsSlice.js";
import {
  selectAdjacentFlights,
  selectFlightsListState,
  selectVisibleFlights,
} from "../features/flights/flightsSelectors.js";

// All flights in departure order (dashboard, live board).
// Flights removed a moment ago (waiting for Undo) are already hidden by the selector.
//   options.refetchInterval — reload automatically every N ms (live board)
export function useAllFlights(options = {}) {
  const dispatch = useDispatch();
  const flights = useSelector(selectVisibleFlights);
  const list = useSelector(selectFlightsListState);
  const { refetchInterval } = options;

  useEffect(() => {
    dispatch(fetchFlights());
  }, [dispatch]);

  // live board: reload every refetchInterval ms while the page is open
  useEffect(() => {
    if (!refetchInterval) return;
    const timer = setInterval(() => dispatch(fetchFlights({ force: true })), refetchInterval);
    return () => clearInterval(timer);
  }, [dispatch, refetchInterval]);

  const hasData = flights.length > 0;
  const failed = list.status === "failed";
  return {
    flights,
    status: !hasData && (list.status === "idle" || list.status === "loading") ? "loading" : failed && !hasData ? "error" : "success",
    offline: failed && !hasData && list.error?.kind === "offline",
    error: list.error?.message ?? "",
    updatedAt: list.lastFetched,
    isFetching: list.status === "loading",
    refreshFailed: failed && hasData,
    cachedAt: list.cachedAt,
    reload: () => dispatch(fetchFlights({ force: true })),
  };
}

// Previous / next departure, from the same flights in the store (no request).
export function useAdjacentFlights(id) {
  return useSelector((state) => selectAdjacentFlights(state, id));
}
