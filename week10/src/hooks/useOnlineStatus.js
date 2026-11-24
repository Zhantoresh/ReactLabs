import { useState, useSyncExternalStore } from "react";
import { checkConnection } from "../services/connection.js";

function subscribe(callback) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}


export function useOnlineStatus() {
  return useSyncExternalStore(subscribe, () => navigator.onLine);
}


export function useRetryConnection(onBackOnline) {
  const [checking, setChecking] = useState(false);
  const [stillOffline, setStillOffline] = useState(false);

  async function retry() {
    setChecking(true);
    setStillOffline(false);
    const online = await checkConnection();
    setChecking(false);
    if (online) onBackOnline();
    else setStillOffline(true);
  }

  return { retry, checking, stillOffline };
}