import { useEffect, useState } from "react";
import { buildFlightsQuery, getFlights } from "../services/service.js";


// params = { search, status, terminal, sort, page, limit }
export function useFlightsList(params) {
  // A string is a stable dependency: same filters -> same string -> no new request.
  const query = buildFlightsQuery(params);

  const [result, setResult] = useState({ data: [], total: 0, totalPages: 0 });
  const [status, setStatus] = useState("loading"); // "loading" | "error" | "success"
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    setStatus("loading");
    setError("");

    getFlights(query)
      .then((response) => {
        if (ignore) return; 
        setResult({ data: response.data, total: response.total, totalPages: response.totalPages });
        setStatus("success");
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
        setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [query, reloadKey]);

  function reload() {
    setReloadKey((key) => key + 1);
  }

  return { ...result, status, error, reload };
}