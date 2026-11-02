import { Link, NavLink } from "react-router";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/flights", label: "Flights" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
];

function linkClass({ isActive }) {
  return isActive ? "navbar__link navbar__link--active" : "navbar__link";
}

export default function NavBar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        ✈ Departures Board
      </Link>

      <nav className="navbar__links">
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
            {link.label}
          </NavLink>
        ))}
        <NavLink to="/login" className={({ isActive }) => `btn btn--small ${isActive ? "" : "btn--ghost"}`}>
          Log in
        </NavLink>
      </nav>
    </header>
  );
}