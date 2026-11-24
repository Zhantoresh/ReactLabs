let deferredPrompt = null; 
let state = { canInstall: false, installed: false, ios: false };
const listeners = new Set();

function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function isIos() {
  const iPadAsMac = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || iPadAsMac;
}


export function initInstallPrompt() {
  setState({ installed: isStandalone(), ios: isIos() && !isStandalone() });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault(); 
    deferredPrompt = event;
    setState({ canInstall: true });
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    setState({ canInstall: false, installed: true });
  });
}


export function subscribeToInstall(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getInstallSnapshot() {
  return state;
}


export async function promptInstall() {
  if (!deferredPrompt) return "dismissed";
  const event = deferredPrompt;
  deferredPrompt = null; 
  setState({ canInstall: false });
  await event.prompt();
  const { outcome } = await event.userChoice;
  return outcome;
}