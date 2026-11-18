// Service Worker of Departures Board (week09). Plain JavaScript, no libraries.
//
// Lifecycle:
//   install  -> pre-cache the application shell (index.html, built JS/CSS, icons, offline.html)
//   activate -> delete caches of older versions, take control of open pages
//   fetch    -> answer requests from the cache or the network
//
// VERSION and PRECACHE_URLS are filled in at build time by the plugin in vite.config.js:
// every build gets its own VERSION, so a new deploy = a new shell cache.
const VERSION = "__BUILD_VERSION__";
const PRECACHE_URLS = ["__PRECACHE_URLS__"];


const PREFIX = "departures-week09";
const SHELL_CACHE = `${PREFIX}-shell-${VERSION}`;
const CURRENT_CACHES = [SHELL_CACHE];


const BASE = new URL("./", self.location).href;
const INDEX_URL = new URL("index.html", BASE).href;
const OFFLINE_URL = new URL("offline.html", BASE).href;

// ---------- install: pre-cache the app shell ----------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      cache.addAll(PRECACHE_URLS.map((url) => new Request(url, { cache: "reload" }))),
    ),
  );

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

  if (url.origin === self.location.origin) {
    event.respondWith(fromShellCache(request));
  }

});


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