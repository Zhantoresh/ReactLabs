# Task 6 — Server Data, Caching & Firebase Authentication (Departures Board)

The week07 departures board (React Router, nested routes, filters in the URL, lazy pages, live board)
extended with **Firebase Authentication** (email/password + Google), **environment variables** and
**server-data caching with TanStack Query**. All routes, filters, pagination and features from week07 are kept.

- Deployed: https://zhantoresh.github.io/ReactLabs/week08/
- Repo: https://github.com/Zhantoresh/ReactLabs (folder `week08`)

## Run locally

    cd week08
    npm install
    cp .env.example .env.local   # then put your Firebase web-app config into .env.local
    npm run dev

`.env.local` is in `.gitignore` and is never committed. `.env.example` shows which variables are needed.
Vite exposes only variables that start with `VITE_` (read through `import.meta.env`).

## Firebase setup

1. Firebase console → create a project → add a **Web app** → copy its config into `.env.local`.
2. Authentication → Sign-in method → enable **Email/Password** and **Google**.
3. Authentication → Settings → Authorized domains → add `zhantoresh.github.io` (for the deployed version).

Firebase is initialized once in `src/firebase.js`. All auth calls are in `src/services/auth.js`.

## Routes

| Path | Page | Access |
| --- | --- | --- |
| `/` | Home | public |
| `/about` | About the project | public |
| `/flights` | Flights list (search, 2 filters, sorting, pagination in the URL) | public |
| `/flights/new` | New flight | signed in |
| `/flights/:id` | Flight details (+ previous / next departure) | public, editing when signed in |
| `/board` | Live departures board (auto-refresh) | public |
| `/dashboard` | Dashboard with statistics | signed in |
| `/profile` | Email, UID, account info, logout | signed in |
| `/login` | Email/password login, Google sign-in | guests only |
| `/signup` | Email, password, confirm password with validation, Google | guests only |
| `*` | Not Found (404) | public |

`HashRouter` is used (`…/week08/#/flights/3`), so direct URLs and refresh work on GitHub Pages.

## Authentication

- `AuthProvider` (`src/context/AuthProvider.jsx`) subscribes to Firebase with `onAuthStateChanged`
  and keeps `user` and `loading` in state; `useAuth()` gives them (plus `signUp`, `logIn`,
  `logInWithGoogle`, `logOut`) to any component.
- **Persistent sessions:** Firebase saves the session (`browserLocalPersistence`), and after a refresh
  `onAuthStateChanged` restores the user. While that happens `loading` is `true`.
- **Protected routes:** `RequireAuth` (layout route) waits while `loading`, then either renders the page
  or redirects to `/login` with `state={{ from: location }}`; after login the user returns to that page.
  `GuestOnly` sends a signed-in user away from `/login` and `/signup`.
- **NavBar:** shows *Log in / Sign up* for guests and *Profile / Log out* for signed-in users.
- **Errors:** Firebase error codes are turned into readable messages (`authErrorMessage` in `services/auth.js`).

## Caching strategy (TanStack Query)

Cache settings and query keys are in `src/services/queryClient.js`; hooks in `src/hooks/` use them.

| Query key | Data | Used by |
| --- | --- | --- |
| `["flights", "list", { search, status, terminal, sort, page, limit }]` | one page of the list | Flights page |
| `["flights", "detail", id]` | one flight | Flight details |
| `["flights", "all"]` | all flights sorted by time | Dashboard, Live board, previous/next links |

**Expiration / revalidation**

- `staleTime: 60 s` — cached data is shown instantly and not refetched for 60 seconds
  (e.g. going back to a list page or a flight you just opened).
- After 60 s the data is *stale*: it is still shown at once, and a background request refreshes it
  when the query is used again or the window regains focus.
- `gcTime: 5 min` — cache entries that no page uses are removed from memory after 5 minutes.
- The live board refetches `["flights", "all"]` every 30 s (`refetchInterval`) while it is open.
- `retry: 1` — a failed request (the fake API fails ~5% of the time) is retried once before showing an error.

**When the cache is invalidated**

| Operation | What happens to the cache |
| --- | --- |
| Create a flight | the new flight is put into `["flights", "detail", id]`; all lists and `["flights", "all"]` are invalidated |
| Edit / change status | the returned flight replaces `["flights", "detail", id]`; all lists and `["flights", "all"]` are invalidated |
| Delete a flight | its detail entry is marked stale (next visit shows "not found"); all lists and `["flights", "all"]` are invalidated |

Invalidated queries that are on screen refetch immediately; the others refetch the next time they are opened.
The mutations are in `src/hooks/useFlightMutations.js`.

**Outdated requests** — each filter combination has its own query key, so a late response for old filters
is stored under the old key and never replaces the list for the current filters. `placeholderData:
keepPreviousData` keeps the previous page on screen while the next one loads.

**States** — every page handles loading, error (with *Try again*), empty results and "not found";
if a background refresh fails, the cached data stays on screen with a warning.

## Structure

    src/
      firebase.js          Firebase app + auth (config from import.meta.env)
      App.jsx              routes only (nested, protected, guest-only, React.lazy)
      main.jsx             QueryClientProvider + HashRouter + AuthProvider
      layouts/RootLayout   NavBar + <Suspense><Outlet/></Suspense> + footer
      pages/               Home, About, Flights, NewFlight, FlightDetails, Board, Dashboard,
                           Login, Signup, Profile, NotFound
      components/          NavBar, RequireAuth, GuestOnly, GoogleButton, FlightCard, FlightFilters,
                           FlightForm, Pagination, StatusBadge, StateMessage, PageLoader
      context/             AuthContext + AuthProvider
      hooks/               useAuth, useFlightsList, useFlight, useAllFlights (+ useAdjacentFlights),
                           useFlightMutations, useNow
      services/            service.js (flight API), auth.js (Firebase auth), queryClient.js (cache + keys)
      api/                 fake API, settings, seed data (40 flights)
      utils/flights.js     constants and formatting helpers
      styles/              global, layout, components, pages

UI components never call the API, Firebase or `localStorage` directly — only through hooks and services.