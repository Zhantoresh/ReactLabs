let waitingWorker = null; 
let updateRequested = false; 
const listeners = new Set();

function setWaitingWorker(worker) {
  waitingWorker = worker;
  listeners.forEach((listener) => listener());
}


export function subscribeToUpdate(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isUpdateWaiting() {
  return waitingWorker !== null;
}


export function applyUpdate() {
  if (!waitingWorker) return;
  updateRequested = true;
  waitingWorker.postMessage({ type: "SKIP_WAITING" });
}

export function registerServiceWorker() {
 
  if (!("serviceWorker" in navigator) || !import.meta.env.PROD) return;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (updateRequested) window.location.reload();
  });

  window.addEventListener("load", async () => {
    try {
      const base = import.meta.env.BASE_URL; 
      const registration = await navigator.serviceWorker.register(`${base}sw.js`, { scope: base });

   
      if (registration.waiting && navigator.serviceWorker.controller) {
        setWaitingWorker(registration.waiting);
      }


      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {

          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            setWaitingWorker(worker);
          }
        });
      });


      setInterval(() => registration.update().catch(() => {}), 30 * 60 * 1000);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") registration.update().catch(() => {});
      });
    } catch (err) {
      console.error("Service Worker registration failed:", err);
    }
  });
}