import { useEffect, useState } from "react";
import { getAllFlights } from "../services/service.js";

export function useAllFlights() {
  const [flights, setFlights] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "error" | "success"
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    setStatus("loading");
    setError("");

    getAllFlights()
      .then((data) => {
        if (ignore) return;
        setFlights(data);
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
  }, [reloadKey]);

  function reload() {
    setReloadKey((key) => key + 1);
  }

  return { flights, status, error, reload };
}