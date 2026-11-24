import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlightById } from "../features/flights/flightsSlice.js";
import { selectFlightById, selectFlightDetailState } from "../features/flights/flightsSelectors.js";

export function useFlight(id) {
  const dispatch = useDispatch();
  const flight = useSelector((state) => selectFlightById(state, id));
  const detail = useSelector((state) => selectFlightDetailState(state, id));

  useEffect(() => {
    dispatch(fetchFlightById({ id }));
  }, [dispatch, id]);

  let status = "success";
  if (detail?.status === "notfound") status = "notfound";
  else if (!flight && detail?.status === "failed") status = detail.error?.kind === "offline" ? "offline" : "error";
  else if (!flight) status = "loading";

  return {
    flight: flight ?? null,
    cachedAt: detail?.cachedAt ?? null,
    status,
    error: detail?.error?.message ?? "",
    reload: () => dispatch(fetchFlightById({ id, force: true })),
  };
}