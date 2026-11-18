import { useSyncExternalStore } from "react";
import { getInstallSnapshot, promptInstall, subscribeToInstall } from "../services/install.js";


export function useInstallApp() {
  const state = useSyncExternalStore(subscribeToInstall, getInstallSnapshot);
  return { ...state, install: promptInstall };
}