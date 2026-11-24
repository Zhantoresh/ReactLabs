const VERSION = "__BUILD_VERSION__";
const PRECACHE_URLS = ["__PRECACHE_URLS__"];


const PREFIX = "departures-week10";
const SHELL_CACHE = `${PREFIX}-shell-${VERSION}`;

const STATIC_CACHE = `${PREFIX}-static-v1`;
const API_CACHE = `${PREFIX}-api-v1`;
const CURRENT_CACHES = [SHELL_CACHE, STATIC_CACHE, API_CACHE];


const STATIC_MAX_ENTRIES = 60;
const API_MAX_ENTRIES = 50;
const API_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; 
const NETWORK_TIMEOUT_MS = 5000; 

const CACHED_AT_HEADER = "X-SW-Cached-At";
const FROM_CACHE_HEADER = "X-SW-From-Cache";

const BASE = new URL("./", self.location).href;
const INDEX_URL = new URL("index.html", BASE).href;
const OFFLINE_URL = new URL("offline.html", BASE).href;

// ---------- install: pre-cache the app shell ----------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      // cache: "reload" skips the browser HTTP cache, so we store the files of THIS deploy
      cache.addAll(PRECACHE_URLS.map((url) => new Request(url, { cache: "reload" }))),
    ),
  );
  // No skipWaiting() here: a new version waits until the user presses "Update" (see "message").
});

// ---------- activate: remove outdated caches ----------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith(PREFIX) && !CURRENT_CACHES.includes(name))
          .map((name) => caches.delete(name)),
      );
      // control already open pages right away (first install: no reload needed)
      await self.clients.claim();
    })(),
  );
});

// ---------- update: the page asks the waiting worker to become active ----------
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

// ---------- fetch ----------
self.addEventListener("fetch", (event) => {
  const { request } = event;

  
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

 
  if (isPublicFlightsRequest(request, url)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isStaticAsset(request, url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(fromShellCache(request));
  }

  
});


function isPublicFlightsRequest(request, url) {
  return (
    url.hostname === "firestore.googleapis.com" &&
    url.pathname.includes("/documents/flights") &&
    !request.headers.has("Authorization")
  );
}


function isStaticAsset(request, url) {
  const isFont = request.destination === "font" || url.hostname === "fonts.gstatic.com";
  const isOwnImage = request.destination === "image" && url.origin === self.location.origin;
  return isFont || isOwnImage;
}

// ---------- strategies ----------

async function handleNavigation(request) {
  const cache = await caches.open(SHELL_CACHE);
  const url = new URL(request.url);

  const page = url.origin + url.pathname;
  const isAppPage = page === BASE || page === INDEX_URL;

  const cached = await cache.match(isAppPage ? INDEX_URL : request, { ignoreSearch: true, ignoreVary: true });
  if (cached) return cached;

  try {
    return await fetch(request);
  } catch {
    
    return Response.redirect(OFFLINE_URL, 302);
  }
}

async function fromShellCache(request) {
  const cached = await caches.match(request, { ignoreSearch: true, ignoreVary: true });
  if (cached) return cached;
  try {
    return await fetch(request);
  } catch {
    return Response.error();
  }
}


async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request, { ignoreVary: true });
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
      await trimCache(STATIC_CACHE, STATIC_MAX_ENTRIES);
    }
    return response;
  } catch {
    return Response.error();
  }
}

async function networkFirst(request) {
  const cache = await caches.open(API_CACHE);

  try {
    const response = await fetchWithTimeout(request, NETWORK_TIMEOUT_MS);

    if (response.ok) {
      await cache.put(request, await withHeaders(response.clone(), { [CACHED_AT_HEADER]: String(Date.now()) }));
      await trimCache(API_CACHE, API_MAX_ENTRIES);
    } else if (response.status === 404) {
      await cache.delete(request, { ignoreVary: true }); // the flight was deleted: forget the old copy
    }
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreVary: true });
    if (cached && !isExpired(cached)) {
      return withHeaders(cached, { [FROM_CACHE_HEADER]: "1" });
    }
    
    return Response.error();
  }
}

// ---------- helpers ----------

function fetchWithTimeout(request, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    fetch(request).then(
      (response) => {
        clearTimeout(timer);
        resolve(response);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}


async function withHeaders(response, extra) {
  const headers = new Headers(response.headers);
  
  headers.delete("Content-Encoding");
  headers.delete("Content-Length");
  for (const [name, value] of Object.entries(extra)) headers.set(name, value);
  return new Response(await response.blob(), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isExpired(response) {
  const cachedAt = Number(response.headers.get(CACHED_AT_HEADER));
  return !cachedAt || Date.now() - cachedAt > API_MAX_AGE_MS;
}


async function trimCache(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (const key of keys.slice(0, Math.max(0, keys.length - max))) {
    await cache.delete(key);
  }
}