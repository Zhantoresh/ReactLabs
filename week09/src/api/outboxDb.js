const DB_NAME = "departures-week09";
const DB_VERSION = 1;
const STORE = "outbox";

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    // runs the first time (or when DB_VERSION grows): create the table
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE, { keyPath: ["uid", "flightId"] });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}


async function withStore(mode, operation) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const request = operation(transaction.objectStore(STORE));
    transaction.oncomplete = () => {
      db.close();
      resolve(request.result);
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}


export async function readOutbox() {
  const items = await withStore("readonly", (store) => store.getAll());
  return items.sort((a, b) => a.createdAt - b.createdAt);
}

export function putOutboxItem(item) {
  return withStore("readwrite", (store) => store.put(item));
}

export function deleteOutboxItem(uid, flightId) {
  return withStore("readwrite", (store) => store.delete([uid, flightId]));
}