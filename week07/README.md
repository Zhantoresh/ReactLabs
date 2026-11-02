# Task 4 — Async React: Effects & API (Departures Board)

Flight departures board built with React (`useState` + `useEffect` only) on top of a simulated async API
(random delays 0.5–3 s, random errors ~5%, data in localStorage).

- Deployed: https://zhantoresh.github.io/ReactLabs/week06/
- Repo: https://github.com/Zhantoresh/ReactLabs (folder `week06`)

## Run locally

    cd week06
    npm install
    npm run dev

## What is implemented

- Flight list loaded in `useEffect`; loading / error / empty / success states; Reload button.
- Create / Edit / Remove flights (create = `createItem` + `updateItem`, because the API's `createItem` stores only `name` and `description`).
- Select a flight → its extended details are loaded asynchronously (10 fields: flight number, route, airline, destination, terminal, gate, departure, aircraft, passengers, status).
- Action on the selected flight: change status (boarding / departed / delayed / cancelled).
- Responsive layout (two columns → one column on narrow screens).

## Effects, cleanup, race conditions

- List effect: `[reloadKey]`. Reload increments `reloadKey`, which re-runs the effect.
- Details effect: `[selectedId, detailReloadKey]`. Each run has its own `ignore` flag;
  cleanup sets `ignore = true`, so a late response of an old request is discarded.
  Old details are cleared at the start of the effect, so outdated data is never shown.

## Stale closures

`handleChangeStatus` stores `const id = selectedId` before `await`, then applies the response by `id`
with functional updates (`setFlights(prev => ...)`, `setDetails(prev => ...)`).
While a status update is pending, other actions (edit / remove / new / other statuses) are disabled,
but the user may select another flight — the response still updates the correct item.

## Restrictions respected

Only `useState` / `useEffect`, no custom hooks, no debouncing, no fetching libraries,
no direct `localStorage` access in components, `fakeApi.js` and `settings.js` are untouched
(only the seed data in `initial-data-sample.js` is custom).

## How to demo delayed requests

1. Click flight A, then quickly B, then C — only C's details stay on screen.
2. Press "Mark departed" on A and immediately select B — A's badge shows `updating…`,
   B's details stay untouched, A becomes `departed` when the response arrives.