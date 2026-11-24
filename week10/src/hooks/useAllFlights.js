import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlights } from "../features/flights/flightsSlice.js";
import {
  selectAdjacentFlights,
  selectAllFlights,
  selectFlightsListState,
} from "../features/flights/flightsSelectors.js";


export function useAllFlights(options = {}) {
  const dispatch = useDispatch();
  const flights = useSelector(selectAllFlights);
  const list = useSelector(selectFlightsListState);
  const { refetchInterval } = options;

  useEffect(() => {
    dispatch(fetchFlights());
  }, [dispatch]);


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


export function useAdjacentFlights(id) {
  return useSelector((state) => selectAdjacentFlights(state, id));
}