# Task 5 — Routing & Application Architecture (Departures Board)

The week06 departures board extended with React Router: separate pages, nested routes,
dynamic URLs, filters in the URL and lazy-loaded pages. Extra features: staff login with
protected routes, a live departures board and previous/next departure navigation.

- Deployed: https://zhantoresh.github.io/ReactLabs/week07/
- Repo: https://github.com/Zhantoresh/ReactLabs (folder `week07`)
- Demo staff account: `dispatcher@ala.kz` / `ala2026`

## Run locally

    cd week07
    npm install
    npm run dev

## Routes

| Path | Page | Access |
| --- | --- | --- |
| `/` | Home | public |
| `/about` | About the project | public |
| `/flights` | Flights list (search, 2 filters, sorting, pagination) | public |
| `/flights/new` | New flight | staff |
| `/flights/:id` | Flight details (+ previous / next departure) | public, editing for staff |
| `/board` | Live departures board | public |
| `/dashboard` | Dashboard | staff |
| `/login` | Staff login | public |
| `*` | Not Found (404) | public |

`HashRouter` is used, so URLs look like `…/week07/#/flights/3?…`.
GitHub Pages serves only real files; with the route after `#` every direct URL,
refresh and Back/Forward loads `index.html`, and React Router reads the route from the hash.

## Structure

    src/
      App.jsx              routes only (nested routes, protected routes, React.lazy)
      main.jsx             HashRouter + AuthProvider + global styles
      layouts/RootLayout   NavBar + <Suspense><Outlet/></Suspense> + footer
      pages/               Home, About, Flights, NewFlight, FlightDetails, Board, Dashboard, Login, NotFound
      components/          NavBar, RequireAuth, FlightCard, FlightFilters, FlightForm, Pagination,
                           StatusBadge, StateMessage, PageLoader
      context/             AuthContext + AuthProvider (logged-in staff user)
      hooks/               useFlightsList, useFlight, useAllFlights, useAdjacentFlights,
                           useLiveFlights, useNow, useAuth (effects with cleanup)
      services/service.js  all API requests + fake staff login
      api/                 fake API (status/terminal/airline filters and extra sorts added),
                           settings, seed data (40 flights)
      utils/flights.js     constants and formatting helpers
      styles/              global, layout, components, pages

## Required features

- **Flights**: reusable `FlightCard`, search + status filter + terminal filter + sorting + pagination.
  All of them live in the URL (`useSearchParams`), so links, refresh and Back/Forward keep them.
  Loading / error (Try again) / empty / "page does not exist" states.
- **Flight details**: `useParams` + `getFlight(id)`; 11 fields; Back and All flights links;
  loading, error with retry, not found (missing or invalid id like `/flights/abc`).
  Stale requests are ignored (`ignore` flag in the effect cleanup) and the page component
  gets `key={id}`, so switching flights resets its state.
- **Dashboard**: 5 statistics from API data, breakdowns by status and by airline,
  terminal filter (also in the URL) that recalculates everything, links to filtered lists and flights.
- **Lazy loading**: About, FlightDetails, NewFlight, Board, Dashboard, Login and NotFound
  with `React.lazy` + `Suspense` (in RootLayout).
- **404** page with a Home link.
- Everything from week06 is kept: create, edit, change status, remove, reload, error handling.

## Extra features

- **Staff login and protected routes.** The Login placeholder became a working (fake) staff login.
  `RequireAuth` is a layout route: without login it redirects to `/login` with
  `state={{ from: location }}`, and after login the user is sent back to the page they wanted.
  `/dashboard` and `/flights/new` are protected; on the flight page status/edit/remove buttons
  are shown only to staff. The user is shared through Context (`AuthProvider` + `useAuth`),
  the session is saved, so a refresh does not log you out.
- **Live departures board (`/board`).** A public airport-style screen with all departures,
  terminal tabs in the URL, a clock and auto-refresh every 30 s (`setInterval` in `useEffect`,
  cleared in cleanup). If a background refresh fails, the board keeps the previous data and shows a warning.
- **Previous / next departure** links on the flight page (dynamic URLs `/flights/:id`).

The fake API uses its own localStorage key (`departures-board-week07`), so week06 data is not mixed in.