import { API_CONFIG, FAVORITES_KEY } from "./settings.js";

function fakeRequest(operation) {
  const { minDelay, maxDelay, errorChance } = API_CONFIG;
  return new Promise((resolve, reject) => {
    const delayMS = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    setTimeout(() => {
      if (Math.random() < errorChance) {
        reject(new Error("Simulated server Error"));
        return;
      }
      try {
        resolve(operation());
      } catch (error) {
        reject(error);
      }
    }, delayMS);
  });
}

function readAll() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "{}");
}

function writeAll(data) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(data));
}


export function getFavoriteIds(uid) {
  return fakeRequest(() => readAll()[uid] ?? []);
}


export function toggleFavoriteId(uid, flightId) {
  return fakeRequest(() => {
    const data = readAll();
    const ids = data[uid] ?? [];
    const id = Number(flightId);
    data[uid] = ids.includes(id) ? ids.filter((saved) => saved !== id) : [...ids, id];
    writeAll(data);
    return data[uid];
  });
}