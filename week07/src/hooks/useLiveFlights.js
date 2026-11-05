import { useEffect, useState } from "react";
import { getAllFlights } from "../services/service.js";


export function useLiveFlights(intervalMs = 30000) {
  const [flights, setFlights] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "error" | "success"
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [refreshFailed, setRefreshFailed] = useState(false); 
  const [refreshing, setRefreshing] = useState(false); 
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    function load() {
      getAllFlights()
        .then((data) => {
          if (ignore) return;
          setFlights(data);
          setStatus("success");
          setUpdatedAt(Date.now());
          setRefreshFailed(false);
          setRefreshing(false);
        })
        .catch((err) => {
          if (ignore) return;
          setError(err.message);
          setRefreshFailed(true);
          setRefreshing(false);
          
          setStatus((prev) => (prev === "success" ? "success" : "error"));
        });
    }

    load(); 
    const timer = setInterval(load, intervalMs); 

    
    return () => {
      ignore = true;
      clearInterval(timer);
    };
  }, [intervalMs, reloadKey]);


  function reload() {
    if (status !== "success") setStatus("loading");
    setRefreshing(true);
    setReloadKey((key) => key + 1);
  }

  return { flights, status, error, updatedAt, refreshFailed, refreshing, reload };
}