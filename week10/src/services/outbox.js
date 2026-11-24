import { deleteOutboxItem, putOutboxItem, readOutbox } from "../api/outboxDb.js";
import { NotFoundError, OfflineError, updateFlight } from "./service.js";


let state = { items: [], flushing: false };
let loaded = false;
const listeners = new Set();

function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

async function refresh() {
  setState({ items: await readOutbox() });
}


export function subscribeToOutbox(listener) {
  listeners.add(listener);
  if (!loaded) {
    loaded = true;
    refresh().catch(() => {});
  }
  return () => listeners.delete(listener);
}


export function getOutboxSnapshot() {
  return state;
}


export async function queueStatusChange({ uid, flight, status }) {
  await putOutboxItem({
    uid,
    flightId: flight.id,
    flightName: flight.name,
    status,
    createdAt: Date.now(),
    lastError: "",
  });
  await refresh();
}

export async function discardChange(uid, flightId) {
  await deleteOutboxItem(uid, flightId);
  await refresh();
}


let running = null;
export function flushOutbox(uid) {
  if (running) return running; 
  setState({ flushing: true });
  running = (async () => {
    const sent = [];
    const failed = [];
    const mine = (await readOutbox()).filter((item) => item.uid === uid);

    for (const item of mine) {
      try {
        await updateFlight(item.flightId, { status: item.status });
        await deleteOutboxItem(uid, item.flightId);
        sent.push(item);
      } catch (err) {
        if (err instanceof OfflineError) break;
        if (err instanceof NotFoundError) {
          await deleteOutboxItem(uid, item.flightId);
          failed.push({ ...item, lastError: "the flight was deleted" });
        } else {
          await putOutboxItem({ ...item, lastError: err.message });
          failed.push({ ...item, lastError: err.message });
        }
      }
    }
    await refresh();
    return { sent, failed };
  })().finally(() => {
    running = null;
    setState({ flushing: false });
  });
  return running;
}