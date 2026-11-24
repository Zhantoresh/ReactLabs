import { Link } from "react-router";

const ROUTES = [
  { path: "/", page: "Home" },
  { path: "/about", page: "About" },
  { path: "/flights", page: "Flights list (search, filters, sorting, pagination)" },
  { path: "/flights/new", page: "New flight (signed-in users)" },
  { path: "/flights/:id", page: "Flight details (+ previous / next departure)" },
  { path: "/board", page: "Live departures board (auto-refresh)" },
  { path: "/dashboard", page: "Dashboard (signed-in users)" },
  { path: "/profile", page: "Profile: email, UID, email verification, logout (signed-in users)" },
  { path: "/my-flights", page: "My flights: saved with ☆ (signed-in users)" },
  { path: "/login", page: "Log in: email/password or Google" },
  { path: "/signup", page: "Sign up: email, password, confirm password" },
  { path: "/forgot-password", page: "Password reset email" },
  { path: "/offline", page: "Offline page with Retry connection (works without internet)" },
  { path: "*", page: "Not Found (404)" },
];

const STACK = [
  "React 19",
  "React Router",
  "Redux Toolkit",
  "React Redux",
  "Firebase Authentication",
  "Firestore REST API",
  "Service Worker (no libraries)",
  "Cache Storage + IndexedDB",
  "Web App Manifest",
  "Vite + env variables",
  "CSS (mobile from 320px)",
];

export default function AboutPage() {
  return (
    <section className="page about">
      <h1>About the project</h1>

      <div className="panel">
        <h2>What it is</h2>
        <p>
          Departures Board is a small single-page application for an airport departures board. It started as the
          “Async React: Effects &amp; API” homework (week06) and was extended with React Router: separate pages, nested
          routes, dynamic URLs, filters stored in the URL and lazy-loaded pages, and then with Firebase Authentication
          (email/password and Google) and server-data caching. It also has protected routes and a
          live departures board like the screens in the airport, optimistic status changes, saved flights per user,
          prefetching on hover, password reset and email verification.
        </p>
        <p>
          Now it is an installable Progressive Web App: a hand-written Service Worker pre-caches the app shell, keeps
          flight data from Firestore for offline use (network-first) and images and fonts (cache-first), shows when you
          are offline or looking at a saved copy, offers updates with one button, and the whole interface works on phones
          from 320px. Status changes made offline are queued and sent automatically when the connection returns.
        </p>
        <p>
          In the last step the whole data layer moved to Redux Toolkit: one store with feature slices (flights,
          favorites, offline queue, notifications), async thunks for every request, normalized flights and memoized
          selectors, so search, filters, sorting and pagination work on data that is already loaded and make no new
          requests. A listener middleware shows toast messages after every change and lets you undo a removed flight
          for 5 seconds.
        </p>
      </div>

      <div className="about__grid">
        <div className="panel">
          <h2>Routes</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Path</th>
                <th>Page</th>
              </tr>
            </thead>
            <tbody>
              {ROUTES.map((route) => (
                <tr key={route.path}>
                  <td>
                    <code>{route.path}</code>
                  </td>
                  <td>{route.page}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h2>Architecture</h2>
          <ul className="about__list">
            <li>
              <code>App.jsx</code> — only routes
            </li>
            <li>
              <code>layouts/</code> — RootLayout with NavBar and Outlet
            </li>
            <li>
              <code>pages/</code> — one file per route
            </li>
            <li>
              <code>components/</code> — reusable UI (FlightCard, filters, pagination…)
            </li>
            <li>
              <code>store/</code> — configureStore, listener middleware (toasts, Undo), helpers (retry, errors, freshness)
            </li>
            <li>
              <code>features/</code> — Redux slices, async thunks and selectors: flights, favorites, outbox, notifications
            </li>
            <li>
              <code>hooks/</code> — useSelector / useDispatch wrappers for the pages, useAuth, useDebouncedValue
            </li>
            <li>
              <code>context/</code> — AuthProvider: the Firebase user (onAuthStateChanged) for the whole app
            </li>
            <li>
              <code>RequireAuth</code> / <code>GuestOnly</code> — layout routes for protected and guest-only pages
            </li>
            <li>
              <code>services/service.js</code> — all flight API requests (Firestore REST)
            </li>
            <li>
              <code>public/sw.js</code> — Service Worker: pre-cache, versioned caches, caching strategies
            </li>
            <li>
              <code>services/serviceWorker.js</code>, <code>install.js</code> — updates, install button;{" "}
              <code>api/outboxDb.js</code> — IndexedDB for the offline queue
            </li>
            <li>
              <code>services/auth.js</code> + <code>firebase.js</code> — Firebase Authentication
            </li>
            <li>
              <code>styles/</code> — global, layout, component, page and mobile styles
            </li>
          </ul>

          <h2>Stack</h2>
          <ul className="pill-list">
            {STACK.map((item) => (
              <li key={item} className="pill">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="panel">
        <h2>Author</h2>
        <p>
          Zhantore Orazymbetov — student at KBTU (Almaty), programming instructor and team lead on student development
          projects. GitHub:{" "}
          <a href="https://github.com/Zhantoresh" target="_blank" rel="noreferrer">
            Zhantoresh
          </a>
          .
        </p>
        <Link to="/flights" className="btn">
          Go to flights
        </Link>
      </div>
    </section>
  );
}
