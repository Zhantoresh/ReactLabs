# Task 8 — Redux Toolkit (Departures Board)

The departures board from the previous homeworks (React Router, Firebase Authentication, PWA) with its
**whole data layer refactored to Redux Toolkit**: one store, four feature slices, async thunks for every
request and mutation, normalized flights and memoized selectors. TanStack Query was removed completely, so
server data lives in one place only. Authentication stays in `AuthContext`, temporary form and UI state stays
local in components. All features of week07–week09 are kept: protected routes, CRUD, the live board, the PWA
and the offline mode.

- Deployed: https://zhantoresh.github.io/ReactLabs/week10/
- Repo: https://github.com/Zhantoresh/ReactLabs/tree/main/week10

## Run locally

    cd week10
    npm install
    cp .env.example .env.local   # put your Firebase web-app config into .env.local
    npm run dev                  # development (no Service Worker)

    npm run build && npm run preview   # production build: Service Worker, offline, install

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

## Redux architecture

    src/
      store/index.js               configureStore: flights + favorites + outbox + notifications
      store/listeners.js           listener middleware: toasts, delete with Undo (bonus)
      store/requestHelpers.js      toRejectValue (error -> { message, kind }), withRetry, STALE_AFTER_MS
      features/flights/            flightsSlice.js (entity adapter, thunks, extraReducers), flightsSelectors.js
      features/favorites/          favoritesSlice.js (thunks, reducer, selectors)
      features/outbox/             outboxSlice.js (offline queue: thunks, selectors)
      features/notifications/      notificationsSlice.js (toast messages, bonus)
      services/                    API only: Firestore REST, favorites, auth, Service Worker — no Redux
      hooks/                       useSelector / useDispatch wrappers used by the pages
      utils/flightList.js          pure filter / sort / paginate functions used by the selectors

Layers: **UI components → hooks (useSelector / useDispatch) → thunks → services → network**.
Components never import the store, `fetch`, Firebase or IndexedDB. `main.jsx` wraps the app in
`<Provider store={store}>`, then `HashRouter` and `AuthProvider`.

What is **not** in Redux, on purpose:

| State | Where | Why |
| --- | --- | --- |
| signed-in user | `AuthContext` (`onAuthStateChanged`) | required by the task; Firebase owns it |
| filters, sort, page | URL search params | shareable links, Back button |
| text being typed, form fields, burger menu, dialogs | `useState` in the component | temporary UI state |
| online / offline, install prompt, SW update | small hooks | browser events, not app data |

### Slices

| Slice | State | Thunks / reducers |
| --- | --- | --- |
| `flights` | `createEntityAdapter` (`ids`, `entities`, sorted by departure time); `list: { status, error, lastFetched, cachedAt, requestId }`; `details[id]` with the same fields per flight; `previousStatus` for rollback | `fetchFlights`, `fetchFlightById`, `createFlight`, `updateFlight`, `changeFlightStatus`, `deleteFlight` |
| `favorites` | `{ uid, ids, status, error }` — saved flights of the signed-in user | `fetchFavorites`, `toggleFavorite` (optimistic), reducer `favoritesCleared` (on logout) |
| `outbox` | `{ items, loaded, flushing }` — status changes made offline (IndexedDB) | `loadOutbox`, `queueStatusChange`, `discardChange`, `flushOutbox` |
| `notifications` | `{ items: [{ id, type, message, duration, undoDeleteId }] }` — toasts (bonus) | `notificationAdded` (with `prepare`), `notificationDismissed` |

Flights are **normalized**: the list, the live board, the dashboard, the details page and "My flights" all read
the same `entities`. Favorites keep only ids and get the flights through a selector, so nothing is duplicated.

### Async thunks (`createAsyncThunk`)

| Thunk | Kind | Request | Notes |
| --- | --- | --- | --- |
| `fetchFlights({ force })` | list | GET all flights | `condition`: skipped while loading or if loaded < 60 s ago (unless `force`) |
| `fetchFlightById({ id, force })` | details | GET one flight | same `condition` per id; 404 → status `notfound`, the flight is removed |
| `createFlight(values)` | mutation | POST | adds the flight, then `fetchFlights({ force: true })` |
| `updateFlight({ id, changes })` | mutation | PATCH | updates the entity, then reloads |
| `changeFlightStatus({ id, status, uid })` | mutation | PATCH | **optimistic**: `pending` sets the new status, `rejected` rolls back; offline → `queueStatusChange` |
| `deleteFlight(id)` | mutation | DELETE | removes the entity, then reloads; started by the Undo listener (bonus) |
| `fetchFavorites(uid)`, `toggleFavorite({ uid, flightId })` | favorites | storage per user | `condition`: not again for the same uid |
| `loadOutbox`, `queueStatusChange`, `discardChange`, `flushOutbox(uid)` | offline queue | IndexedDB + PATCH | `flushOutbox` runs once at a time (`condition: !flushing`) |

Every thunk is handled in `extraReducers` with **pending / fulfilled / rejected**:

- **loading** — `status: "loading"`; pages show "Loading…" / skeletons;
- **errors** — thunks return `rejectWithValue({ message, kind })` with `kind` = `offline`, `notfound` or `error`,
  so pages show the right message (offline message, "flight not found", error with **Retry**);
- **empty results** — the selector returns an empty page → "No flights match these filters";
- **retries** — `withRetry` repeats a failed read once after 800 ms; **Retry / Reload** buttons dispatch with `force`;
- **stale requests** — `pending` stores `action.meta.requestId`; a `fulfilled` / `rejected` with another id
  (an older request that finished late) is ignored;
- **after mutations** — the changed entity is updated at once and the collection is reloaded in the background;
- **no extra requests** — `condition` cancels a thunk when the same data is loading or still fresh.

Pages call thunks through hooks; mutations use `.unwrap()` to get the result or catch the error in the form:

    const createFlight = useCreateFlight();
    const { flight } = await createFlight(values);   // dispatch(createFlight(values)).unwrap()

### Selectors

| Selector | Memoized | Used by |
| --- | --- | --- |
| `selectAllFlights`, `selectFlightByNumericId` | entity adapter | base for the others |
| `selectVisibleFlights` | **`createSelector`** | board, dashboard; input of all list selectors (hides flights waiting for Undo) |
| `selectFlightsListState`, `selectFlightDetailState(state, id)`, `selectFlightById(state, id)` | — | list, details |
| `selectFlightsPage(state, { search, status, terminal, sort, page, limit })` | **`createSelector`** | Flights page: filter → sort → paginate |
| `selectAdjacentFlights(state, id)` | **`createSelector`** | previous / next departure on the details page |
| `selectFavoriteFlights` | **`createSelector`** | "My flights" (favorite ids → flight objects) |
| `selectOutboxItemsForUser(state, uid)` | **`createSelector`** | offline queue bar |
| `selectFavoriteIds`, `selectIsFavorite(state, id)`, `selectOutboxFlushing`, `selectNotifications` | — | ☆ button, queue bar, toasts |

`selectFlightsPage` gets each parameter through its own input selector (primitive values), so the result is
recalculated only when the flights or one of the filters change. Changing a filter, the sort or the page makes
**no network request** — the data is already in the store.

### URL, filters and debounce

Search, status, terminal, sort and page live in the URL (`useSearchParams`), as before. The search box keeps the
typed text in local state and writes it to the URL **400 ms after the last key press** (`hooks/useDebouncedValue.js`,
`components/FlightFilters.jsx`). Reset filters and the Back button update the box from the URL.

## Extra features (bonus): toasts and delete with Undo

**Listener middleware** (`createListenerMiddleware`, `store/listeners.js`) runs side effects *after* an action
reached the reducers, so components and slices stay simple:

- **Toasts for thunk results** — one listener per success (`createFlight.fulfilled`, `updateFlight.fulfilled`,
  `changeFlightStatus.fulfilled`, `toggleFavorite.fulfilled`) and one listener for several errors with
  `isAnyOf(changeFlightStatus.rejected, deleteFlight.rejected, toggleFavorite.rejected)`. The texts are kept in the
  `notifications` slice (plain serializable data) and shown by `components/Toaster.jsx` (`aria-live`, a countdown
  line, full width on phones). Every toast closes itself: a listener on `notificationAdded` waits with
  `listenerApi.delay(duration)` and dispatches `notificationDismissed`.
- **Delete with Undo** instead of `window.confirm()`:
  1. **Remove** dispatches `deletionScheduled({ id, name })`. The reducer puts the id into `pendingDeletion`;
     the memoized `selectVisibleFlights` skips it, so the flight disappears from the list, the board,
     the dashboard and My flights at once. No request yet.
  2. The listener shows "Flight KC 935 removed · **Undo**" and waits with
     `listenerApi.condition(deletionCancelled for this id, 5000)`.
  3. **Undo** → `deletionCancelled(id)`: the flight is visible again and nothing was sent to the server.
     No Undo in 5 s → `dispatch(deleteFlight(id))` sends DELETE. If it fails (for example offline),
     `deleteFlight.rejected` removes the id from `pendingDeletion`, the flight comes back and an error toast explains why.

Check: Flight details → **Remove** → the list shows 39 flights and the toast; **Undo** → 40 again and Network has no
DELETE request; Remove again and wait 5 s → one DELETE request. In Redux DevTools:
`flights/deletionScheduled` → `notifications/notificationAdded` → `flights/deletionCancelled` or `flights/delete/pending`.

## PWA (kept from week09)

The flights are read through the Firestore **REST API with `fetch()`** (`src/services/service.js`): reads are
public GET requests without a token, so the Service Worker caches them; writes send the user's ID token and are
never cached.

### 1. Manifest & installation

`public/manifest.json`, linked in `index.html` (`<link rel="manifest">`, `theme-color`, `apple-touch-icon`):

| Field | Value |
| --- | --- |
| `name` / `short_name` | Departures Board — Almaty International / Departures |
| `start_url` / `scope` | `./` → `/ReactLabs/week10/` (relative to the manifest) |
| `display` | `standalone` |
| `theme_color` / `background_color` | `#5b4fe0` / `#f7f6fc` |
| `icons` | 192×192, 512×512 and a 512×512 maskable icon (`public/icons/`) |

The deployed app is installable in Chrome / Edge / Android; on iPhone via Share → Add to Home Screen.

### 2. Service Worker lifecycle

`public/sw.js` — plain JavaScript, no libraries. A small Vite plugin in `vite.config.js` runs after
`vite build` and writes into `dist/sw.js` the list of all built files and a **VERSION** (hash of those files).

| Event | What happens |
| --- | --- |
| `install` | pre-caches the app shell into `departures-week10-shell-<VERSION>`: `index.html`, every built JS/CSS file, icons, manifest, `offline.html` |
| `activate` | deletes every `departures-week10-*` cache that is not current (old versions), then `clients.claim()` |
| `fetch` | chooses a strategy by request type (see below) |
| `message` | `SKIP_WAITING` from the page activates a waiting new version |

**Updates** (`src/services/serviceWorker.js`, `UpdateBanner`): a new deploy changes `sw.js`, the browser installs
the new version and it **waits**. The page notices it (`updatefound` / `registration.waiting`) and shows
"A new version is available — **Update now**". The button sends `SKIP_WAITING`; on `controllerchange` the page
reloads once with the new version, and `activate` removes the old cache. Nobody has to clear browser storage.
The browser checks for updates on every navigation; the app also calls `registration.update()` every 30 minutes
and when the tab becomes visible.

### 3. Runtime caching

| Requests | Strategy | Cache | Limit |
| --- | --- | --- | --- |
| app shell (pre-cached files) | cache first | `shell-<VERSION>` | replaced by every deploy |
| images and fonts | **cache first** | `departures-week10-static-v1` | 60 entries |
| Firestore flights (GET, no token) | **network first**, 5 s timeout, cache as fallback | `departures-week10-api-v1` | 50 entries, 7 days |
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
- **Redux:** a saved copy (`cachedAt` set) is never treated as fresh, so the next visit asks the network again;
  `useAutoRefresh` reloads the flights when the connection returns and when the tab becomes visible.

### 4. Offline page and connectivity

- **`/offline`** (`pages/OfflinePage.jsx`) — styled message, **Retry connection**, link to saved flights;
  not lazy-loaded and pre-cached, so it opens with no connection at all.
- **Retry connection** makes a real request (`services/connection.js`), because `navigator.onLine` only says
  that Wi-Fi is on, not that the internet works. On success it returns to the previous page.
- **Pages whose data was never loaded** show the same offline message (`OfflineMessage`) instead of an error.
- **Navigation the Service Worker cannot complete** (a page outside the cached app) → `public/offline.html`.
- **Indicator:** "● Online / ● Offline" next to the logo and a bar under the menu while offline.
- **Back online:** the flights are reloaded automatically and the "saved copy" notices disappear.

### 5. Mobile

`src/styles/mobile.css` (loaded last):

- **☰ menu** up to 1080px (`NavBar`): `aria-expanded`, closes after navigation and on Escape, scrolls on low screens;
- screens from **320px**, no horizontal scrolling (checked on every page at 320, 375, 640×360 and 768);
- **touch-friendly**: buttons, inputs, menu items and the ☆ button at least 44px; inputs 16px (no zoom on iPhone);
- cards, forms, filters, dashboard and details are one column; the live board hides airline/terminal/gate columns
  on narrow screens so destinations stay readable;
- **landscape phones**: the bar is not sticky and the menu scrolls.

### Extra features (bonus)

#### Offline queue for status changes

Without a connection a status change is **not lost**:

1. The `changeFlightStatus` thunk gets `OfflineError` and dispatches `queueStatusChange`, which saves the
   change in **IndexedDB** (`api/outboxDb.js`,
   key `[uid, flightId]`, so a newer change of the same flight replaces the older one).
2. The new status is shown at once with ⏳ — on the details page, in the list and on the live board, even after
   a reload (`withQueuedStatuses` in `service.js` puts queued statuses over the data).
3. A bar shows "⏳ 2 changes waiting to be sent" with **Discard** for each change.
4. When the connection returns (`online` event), after login or on **Send now**, the `flushOutbox` thunk sends the changes
   with a fresh ID token, removes them from the queue and reloads the flights. Result: "✓ 2 offline changes sent".
5. Conflicts: a flight deleted while offline is dropped with a message; other errors stay in the queue with the
   error text.

Sending is done by the page, not by Background Sync in the Service Worker: Firestore needs the user's
Firebase ID token (refreshed in the page), and the `online` event works in every browser, including Safari.

#### Install button

`services/install.js` keeps the `beforeinstallprompt` event and shows **⬇ Install** in the menu;
it opens the browser install dialog. On iPhone it shows "Share → Add to Home Screen" instructions.
The button is hidden when the app is installed (`appinstalled`, `display-mode: standalone`).

## Previous homeworks (kept)

- **Routing (week07):** nested and protected routes, `/flights/:id`, filters and pagination in the URL,
  lazy pages, live board with auto-refresh, previous/next departure, 404.
- **Auth (week08):** Firebase email/password + Google, `AuthProvider` with `onAuthStateChanged`,
  `RequireAuth` / `GuestOnly`, profile, password reset, email verification, saved flights, prefetch on hover.
  The caching part of week08 (TanStack Query) is now done by the Redux slices above.

## How to check (Chrome DevTools)

- **Application → Manifest:** fields, icons, no installability errors.
- **Application → Service workers:** `sw.js` activated; tick **Offline** to test offline mode.
- **Application → Cache storage:** `shell-<VERSION>`, `static-v1`, `api-v1`.
- **Application → IndexedDB → departures-week10 → outbox:** queued offline changes.
- **Network:** Firestore GET requests show `(ServiceWorker)`; offline they return `200 (from service worker)`
  with `X-SW-From-Cache: 1`.
- **Device toolbar (Cmd + Shift + M):** 320px, iPhone, landscape.
- **Redux DevTools** (optional browser extension): actions such as `flights/fetchAll/pending` →
  `flights/fetchAll/fulfilled`, `flights/changeStatus/pending` → `…/fulfilled` or `…/rejected`, and the state tree
  `flights`, `favorites`, `outbox`.
