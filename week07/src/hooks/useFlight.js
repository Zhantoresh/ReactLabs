import { useEffect, useState } from "react";
import { getFlight, NotFoundError } from "../services/service.js";

export function useFlight(id) {
  const [flight, setFlight] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "error" | "notfound" | "success"
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    setFlight(null);
    setStatus("loading");
    setError("");

    getFlight(id)
      .then((item) => {
        if (ignore) return; 
        setFlight(item);
        setStatus("success");
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
        setStatus(err instanceof NotFoundError ? "notfound" : "error");
      });

    return () => {
      ignore = true;
    };
  }, [id, reloadKey]);

  function reload() {
    setReloadKey((key) => key + 1);
  }


  return { flight, setFlight, status, error, reload };
}