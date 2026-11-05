import { Link, NavLink } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

function linkClass({ isActive }) {
  return isActive ? "navbar__link navbar__link--active" : "navbar__link";
}

export default function NavBar() {
  const { user, logout } = useAuth();

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/flights", label: "Flights" },
    { to: "/board", label: "Live board" },
    // the lock shows that the page needs a staff login
    { to: "/dashboard", label: user ? "Dashboard" : "🔒 Dashboard" },
    { to: "/about", label: "About" },
  ];

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        ✈ Departures Board
      </Link>

      <nav className="navbar__links">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
            {link.label}
          </NavLink>
        ))}

        {user ? (
          <span className="navbar__user">
            <span className="navbar__user-name" title={user.email}>
              👤 {user.name}
            </span>
            <button className="btn btn--ghost btn--small" onClick={logout}>
              Log out
            </button>
          </span>
        ) : (
          <NavLink to="/login" className={({ isActive }) => `btn btn--small ${isActive ? "" : "btn--ghost"}`}>
            Log in
          </NavLink>
        )}
      </nav>
    </header>
  );
}