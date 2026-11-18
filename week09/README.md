# Task 7 — Progressive Web App (Departures Board)

The departures board from the previous homeworks (React Router, Firebase Authentication, TanStack Query)
turned into an **installable Progressive Web App**: Web App Manifest, a hand-written Service Worker with
versioned caches and updates, two runtime caching strategies, an offline page, an online/offline indicator
and a mobile interface from 320px. All features of week07 and week08 are kept.

- Deployed: https://zhantoresh.github.io/ReactLabs/week09/
- Repo: https://github.com/Zhantoresh/ReactLabs (folder `week09`)

## Run locally

    cd week09
    npm install
    cp .env.example .env.local   # put your Firebase web-app config into .env.local
    npm run dev                  # development (no Service Worker)

    npm run build && npm run preview   # production build: Service Worker, offline, install

The Service Worker is registered only in the production build (`npm run preview` or the deployed site).
`.env.local` is in `.gitignore`; `.env.example` lists the variables.

## Firebase setup

1. Firebase console → Web app → copy its config into `.env.local`.
2. Authentication → enable **Email/Password** and **Google**; add `zhantoresh.github.io` to Authorized domains.
3. Firestore Database → create the `(default)` database and publish these rules:

       match /flights/{flightId} {
         allow read: if true;                                  // public data
         allow create, update, delete: if request.auth != null; // signed-in users only
       }

4. Upload the 40 seed flights once (needs an email/password account of the project):

       SEED_EMAIL=you@example.com SEED_PASSWORD='secret' npm run seed

## Why the flights moved to Firestore

The fake API from the earlier homeworks kept data in `localStorage` and made no network requests,
so a Service Worker had nothing to cache. The flights now live in Firestore and are read through its
**REST API with `fetch()`** (`src/services/service.js`):

- reads (list, details) are public **GET requests without a token** → the Service Worker caches them;
- writes (create, edit, status, delete) send the user's ID token (`Authorization: Bearer …`) and are never cached;
- search, filters, sorting and pagination work exactly as before (done in the service).

## 1. Manifest & installation

`public/manifest.json`, linked in `index.html` (`<link rel="manifest">`, `theme-color`, `apple-touch-icon`):

| Field | Value |
| --- | --- |
| `name` / `short_name` | Departures Board — Almaty International / Departures |
| `start_url` / `scope` | `./` → `/ReactLabs/week09/` (relative to the manifest) |
| `display` | `standalone` |
| `theme_color` / `background_color` | `#5b4fe0` / `#f7f6fc` |
| `icons` | 192×192, 512×512 and a 512×512 maskable icon (`public/icons/`) |

The deployed app is installable in Chrome / Edge / Android; on iPhone via Share → Add to Home Screen.

## 2. Service Worker lifecycle

`public/sw.js` — plain JavaScript, no libraries. A small Vite plugin in `vite.config.js` runs after
`vite build` and writes into `dist/sw.js` the list of all built files and a **VERSION** (hash of those files).

| Event | What happens |
| --- | --- |
| `install` | pre-caches the app shell into `departures-week09-shell-<VERSION>`: `index.html`, every built JS/CSS file, icons, manifest, `offline.html` |
| `activate` | deletes every `departures-week09-*` cache that is not current (old versions), then `clients.claim()` |
| `fetch` | chooses a strategy by request type (see below) |
| `message` | `SKIP_WAITING` from the page activates a waiting new version |

**Updates** (`src/services/serviceWorker.js`, `UpdateBanner`): a new deploy changes `sw.js`, the browser installs
the new version and it **waits**. The page notices it (`updatefound` / `registration.waiting`) and shows
"A new version is available — **Update now**". The button sends `SKIP_WAITING`; on `controllerchange` the page
reloads once with the new version, and `activate` removes the old cache. Nobody has to clear browser storage.
The browser checks for updates on every navigation; the app also calls `registration.update()` every 30 minutes
and when the tab becomes visible.

## 3. Runtime caching

| Requests | Strategy | Cache | Limit |
| --- | --- | --- | --- |
| app shell (pre-cached files) | cache first | `shell-<VERSION>` | replaced by every deploy |
| images and fonts | **cache first** | `departures-week09-static-v1` | 60 entries |
| Firestore flights (GET, no token) | **network first**, 5 s timeout, cache as fallback | `departures-week09-api-v1` | 50 entries, 7 days |
| Firebase Auth, Google sign-in, profile photos, requests with `Authorization`, POST/PATCH/DELETE | network only | — | never cached |

- **Offline access:** previously fetched lists and flights are answered from `api-v1` when the network fails.
- **"You are viewing cached data":** responses from the cache get `X-SW-From-Cache` and `X-SW-Cached-At` headers;
  the service returns `cachedAt` with the data and the pages show "📦 Saved copy… saved on 19 Nov, 01:56".
- **Cache size:** `trimCache()` keeps only the newest entries; API entries older than 7 days are not used.
- **Private data:** nothing with a token or from Firebase Auth goes to the shared caches; saved flights
  ("My flights") stay in `localStorage` per user.
- **Failed requests:** without a connection and without a saved copy the service throws `OfflineError`;
  pages show the offline message instead of crashing. Changes without a connection fail with a clear message
  (or go to the offline queue, see Extra features).
- **TanStack Query** (`src/services/queryClient.js`): `networkMode: "offlineFirst"` (requests still run offline,
  so the Service Worker can answer them), a saved copy is stale at once (`staleTime` function),
  `refetchOnReconnect` reloads fresh data when the connection returns.

## 4. Offline page and connectivity

- **`/offline`** (`pages/OfflinePage.jsx`) — styled message, **Retry connection**, link to saved flights;
  not lazy-loaded and pre-cached, so it opens with no connection at all.
- **Retry connection** makes a real request (`services/connection.js`), because `navigator.onLine` only says
  that Wi-Fi is on, not that the internet works. On success it returns to the previous page.
- **Pages whose data was never loaded** show the same offline message (`OfflineMessage`) instead of an error.
- **Navigation the Service Worker cannot complete** (a page outside the cached app) → `public/offline.html`.
- **Indicator:** "● Online / ● Offline" next to the logo and a bar under the menu while offline.
- **Back online:** queries refetch automatically and the "saved copy" notices disappear.

## 5. Mobile

`src/styles/mobile.css` (loaded last):

- **☰ menu** up to 1080px (`NavBar`): `aria-expanded`, closes after navigation and on Escape, scrolls on low screens;
- screens from **320px**, no horizontal scrolling (checked on every page at 320, 375, 640×360 and 768);
- **touch-friendly**: buttons, inputs, menu items and the ☆ button at least 44px; inputs 16px (no zoom on iPhone);
- cards, forms, filters, dashboard and details are one column; the live board hides airline/terminal/gate columns
  on narrow screens so destinations stay readable;
- **landscape phones**: the bar is not sticky and the menu scrolls.

## Extra features (bonus)

### Offline queue for status changes

Without a connection a status change is **not lost**:

1. `useChangeFlightStatus` gets `OfflineError` and saves the change in **IndexedDB** (`api/outboxDb.js`,
   key `[uid, flightId]`, so a newer change of the same flight replaces the older one).
2. The new status is shown at once with ⏳ — on the details page, in the list and on the live board, even after
   a reload (`withQueuedStatuses` in `service.js` puts queued statuses over the data).
3. A bar shows "⏳ 2 changes waiting to be sent" with **Discard** for each change.
4. When the connection returns (`online` event), after login or on **Send now**, `flushOutbox` sends the changes
   with a fresh ID token, removes them from the queue and reloads the flights. Result: "✓ 2 offline changes sent".
5. Conflicts: a flight deleted while offline is dropped with a message; other errors stay in the queue with the
   error text.

Sending is done by the page, not by Background Sync in the Service Worker: Firestore needs the user's
Firebase ID token (refreshed in the page), and the `online` event works in every browser, including Safari.

### Install button

`services/install.js` keeps the `beforeinstallprompt` event and shows **⬇ Install** in the menu;
it opens the browser install dialog. On iPhone it shows "Share → Add to Home Screen" instructions.
The button is hidden when the app is installed (`appinstalled`, `display-mode: standalone`).

## Previous homeworks (kept)

- **Routing (week07):** nested and protected routes, `/flights/:id`, filters and pagination in the URL,
  lazy pages, live board with auto-refresh, previous/next departure, 404.
- **Auth and caching (week08):** Firebase email/password + Google, `AuthProvider` with `onAuthStateChanged`,
  `RequireAuth` / `GuestOnly`, profile, password reset, email verification; TanStack Query with query keys
  `["flights","list",params]`, `["flights","detail",id]`, `["flights","all"]`, `["favorites",uid]`,
  invalidation after create / edit / status / delete, optimistic status, saved flights, prefetch on hover.

## Structure (new in week09)

    public/
      manifest.json, icons/        Web App Manifest and icons
      sw.js                        Service Worker
      offline.html                 offline fallback of the Service Worker
    scripts/seed-firestore.mjs     uploads the seed flights to Firestore
    vite.config.js                 plugin: pre-cache list + VERSION for sw.js
    src/
      api/firestoreFormat.js       Firestore REST <-> flight objects
      api/outboxDb.js              IndexedDB for the offline queue
      services/service.js          flights API on Firestore REST (+ cachedAt, OfflineError)
      services/serviceWorker.js    registration and update detection
      services/connection.js       real connection check
      services/outbox.js           offline queue: queue / send / discard
      services/install.js          beforeinstallprompt / appinstalled
      hooks/                       useAppUpdate, useOnlineStatus, useOutbox, useInstallApp (+ previous hooks)
      components/                  UpdateBanner, OfflineBar, OfflineMessage, CachedDataNotice, OutboxBar,
                                   InstallButton (+ previous components)
      pages/OfflinePage.jsx        /offline
      styles/mobile.css            mobile version

UI components never call `fetch`, Firebase, IndexedDB or `localStorage` directly — only through hooks and services.

## How to check (Chrome DevTools)

- **Application → Manifest:** fields, icons, no installability errors.
- **Application → Service workers:** `sw.js` activated; tick **Offline** to test offline mode.
- **Application → Cache storage:** `shell-<VERSION>`, `static-v1`, `api-v1`.
- **Application → IndexedDB → departures-week09 → outbox:** queued offline changes.
- **Network:** Firestore GET requests show `(ServiceWorker)`; offline they return `200 (from service worker)`
  with `X-SW-From-Cache: 1`.
- **Device toolbar (Cmd + Shift + M):** 320px, iPhone, landscape.
