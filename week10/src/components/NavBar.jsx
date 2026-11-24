import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import { useOnlineStatus } from "../hooks/useOnlineStatus.js";
import InstallButton from "./InstallButton.jsx";

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
  const location = useLocation();


  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(location.pathname);


  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname);
    setMenuOpen(false);
  }


  useEffect(() => {
    if (!menuOpen) return;
    function handleKey(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/flights", label: "Flights" },
    { to: "/board", label: "Live board" },
    { to: "/dashboard", label: user ? "Dashboard" : "🔒 Dashboard" },
    { to: "/about", label: "About" },
  ];

  async function handleLogout() {
    setMenuOpen(false);
    await logOut();
    navigate("/login", { replace: true });
  }

  return (
    <header className={`navbar ${menuOpen ? "navbar--open" : ""}`}>
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
          <span className="net-status__text">{online ? "Online" : "Offline"}</span>
        </span>
      </div>

      {/* visible only on narrow screens (see mobile.css) */}
      <button
        type="button"
        className="navbar__toggle"
        aria-expanded={menuOpen}
        aria-controls="main-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="navbar__toggle-icon" aria-hidden="true">
          {menuOpen ? "✕" : "☰"}
        </span>
      </button>

      <nav id="main-menu" className="navbar__links" aria-label="Main">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
            {link.label}
          </NavLink>
        ))}
        <InstallButton />
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