import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlights } from "../features/flights/flightsSlice.js";
import { selectFlightsListState, selectFlightsPage } from "../features/flights/flightsSelectors.js";


export function useFlightsList(params) {
  const dispatch = useDispatch();
  const { search, status, terminal, sort, page, limit } = params;
  const result = useSelector((state) => selectFlightsPage(state, { search, status, terminal, sort, page, limit }));
  const list = useSelector(selectFlightsListState);
  const hasData = useSelector((state) => state.flights.ids.length > 0);

 
  useEffect(() => {
    dispatch(fetchFlights());
  }, [dispatch]);

  const failed = list.status === "failed";
  return {
    data: result.data,
    total: result.total,
    totalPages: result.totalPages,
    status: !hasData && (list.status === "idle" || list.status === "loading") ? "loading" : failed && !hasData ? "error" : "success",
    offline: failed && !hasData && list.error?.kind === "offline", 
    error: list.error?.message ?? "",
    isUpdating: list.status === "loading" && hasData, 
    refreshFailed: failed && hasData, 
    cachedAt: list.cachedAt, 
    reload: () => dispatch(fetchFlights({ force: true })),
  };
}