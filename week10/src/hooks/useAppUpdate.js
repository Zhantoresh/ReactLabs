import { useSyncExternalStore } from "react";
import { applyUpdate, isUpdateWaiting, subscribeToUpdate } from "../services/serviceWorker.js";


export function useAppUpdate() {
  const updateAvailable = useSyncExternalStore(subscribeToUpdate, isUpdateWaiting);
  return { updateAvailable, applyUpdate };
}