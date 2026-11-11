import { Link } from "react-router";

const ROUTES = [
  { path: "/", page: "Home" },
  { path: "/about", page: "About" },
  { path: "/flights", page: "Flights list (search, filters, sorting, pagination)" },
  { path: "/flights/new", page: "New flight (signed-in users)" },
  { path: "/flights/:id", page: "Flight details (+ previous / next departure)" },
  { path: "/board", page: "Live departures board (auto-refresh)" },
  { path: "/dashboard", page: "Dashboard (signed-in users)" },
  { path: "/profile", page: "Profile: email, UID, logout (signed-in users)" },
  { path: "/login", page: "Log in: email/password or Google" },
  { path: "/signup", page: "Sign up: email, password, confirm password" },
  { path: "*", page: "Not Found (404)" },
];

const STACK = [
  "React 19",
  "React Router",
  "TanStack Query",
  "Firebase Authentication",
  "Vite + env variables",
  "Fake API (Promise + random delay + errors)",
  "CSS",
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
          (email/password and Google) and server-data caching with TanStack Query. It also has protected routes and a
          live departures board like the screens in the airport.
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
              <code>hooks/</code> — cached queries and mutations (TanStack Query), useAuth
            </li>
            <li>
              <code>context/</code> — AuthProvider: the Firebase user (onAuthStateChanged) for the whole app
            </li>
            <li>
              <code>RequireAuth</code> / <code>GuestOnly</code> — layout routes for protected and guest-only pages
            </li>
            <li>
              <code>services/service.js</code> — all flight API requests
            </li>
            <li>
              <code>services/auth.js</code> + <code>firebase.js</code> — Firebase Authentication
            </li>
            <li>
              <code>services/queryClient.js</code> — TanStack Query cache settings and query keys
            </li>
            <li>
              <code>styles/</code> — global, layout, component and page styles
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