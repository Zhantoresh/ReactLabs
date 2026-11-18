import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import { useOnlineStatus } from "../hooks/useOnlineStatus.js";

function linkClass({ isActive }) {
  return isActive ? "navbar__link navbar__link--active" : "navbar__link";
}

function buttonLinkClass({ isActive }) {
  return `btn btn--small ${isActive ? "" : "btn--ghost"}`;
}

export default function NavBar() {
  const { user, loading, logOut } = useAuth();
  const online = useOnlineStatus();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/flights", label: "Flights" },
    { to: "/board", label: "Live board" },
    // the lock shows that the page needs an account
    { to: "/dashboard", label: user ? "Dashboard" : "🔒 Dashboard" },
    { to: "/about", label: "About" },
  ];

  async function handleLogout() {
    await logOut();
    navigate("/login", { replace: true });
  }

  return (
    <header className="navbar">
      <div className="navbar__start">
        <Link to="/" className="navbar__brand">
          ✈ Departures Board
        </Link>
        {/* online / offline indicator */}
        <span
          className={`net-status ${online ? "net-status--online" : "net-status--offline"}`}
          role="status"
          title={online ? "Connected to the internet" : "No internet connection: showing saved data"}
        >
          <span className="net-status__dot" aria-hidden="true" />
          {online ? "Online" : "Offline"}
        </span>
      </div>

      <nav className="navbar__links">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
            {link.label}
          </NavLink>
        ))}

        {/* while Firebase restores the session we do not know yet which buttons to show */}
        {loading ? null : user ? (
          <span className="navbar__user">
            <NavLink to="/my-flights" className={linkClass}>
              ★ My flights
            </NavLink>
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