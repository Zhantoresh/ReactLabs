import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

function linkClass({ isActive }) {
  return isActive ? "navbar__link navbar__link--active" : "navbar__link";
}

function buttonLinkClass({ isActive }) {
  return `btn btn--small ${isActive ? "" : "btn--ghost"}`;
}

export default function NavBar() {
  const { user, loading, logOut } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/flights", label: "Flights" },
    { to: "/board", label: "Live board" },
    { to: "/dashboard", label: user ? "Dashboard" : "🔒 Dashboard" },
    { to: "/about", label: "About" },
  ];

  async function handleLogout() {
    await logOut();
    navigate("/login", { replace: true });
  }

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

        {/* while Firebase restores the session we do not know yet which buttons to show */}
        {loading ? null : user ? (
          <span className="navbar__user">
            <NavLink to="/profile" className={linkClass} title={user.email}>
              👤 Profile
            </NavLink>
            <button className="btn btn--ghost btn--small" onClick={handleLogout}>
              Log out
            </button>
          </span>
        ) : (
          <span className="navbar__user">
            <NavLink to="/login" className={buttonLinkClass}>
              Log in
            </NavLink>
            <NavLink to="/signup" className={buttonLinkClass}>
              Sign up
            </NavLink>
          </span>
        )}
      </nav>
    </header>
  );
}