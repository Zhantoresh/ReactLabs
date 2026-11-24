import { useDispatch } from "react-redux";
import { fetchFlightById } from "../features/flights/flightsSlice.js";


export function usePrefetchFlight() {
  const dispatch = useDispatch();
  return (id) => dispatch(fetchFlightById({ id }));
}