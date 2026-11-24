import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchFlights } from "../features/flights/flightsSlice.js";

export function useAutoRefresh() {
  const dispatch = useDispatch();

  useEffect(() => {
    function handleOnline() {
      dispatch(fetchFlights({ force: true }));
    }
    function handleVisible() {
      if (document.visibilityState === "visible") dispatch(fetchFlights());
    }
    window.addEventListener("online", handleOnline);
    document.addEventListener("visibilitychange", handleVisible);
    return () => {
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("visibilitychange", handleVisible);
    };
  }, [dispatch]);
}