import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import { DEMO_ACCOUNT } from "../services/service.js";

// Staff login. Passengers can browse without an account;
// creating, editing, changing status and the dashboard need a login.
export default function LoginPage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // where RequireAuth sent us from (e.g. /dashboard), if anywhere
  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search}` : "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      // replace: the login page should not stay in history
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  function fillDemo() {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    setError("");
  }

  if (user) {
    return (
      <section className="page login">
        <div className="login__card">
          <h1>You are logged in</h1>
          <p className="muted">
            Signed in as <strong>{user.name}</strong> ({user.email}).
          </p>
          <Link to="/dashboard" className="btn login__submit">
            Open dashboard
          </Link>
          <button className="btn btn--ghost login__submit" onClick={logout}>
            Log out
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page login">
      <form className="login__card" onSubmit={handleSubmit}>
        <h1>Staff log in</h1>
        <p className="muted">Dispatchers can add flights, edit them, change statuses and open the dashboard.</p>

        {from && (
          <p className="state state--info">
            Log in to open <code>{from.pathname}</code>.
          </p>
        )}

        <label className="login__field">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="dispatcher@ala.kz"
            autoComplete="username"
            required
          />
        </label>

        <label className="login__field">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="state state--error">{error}</p>}

        <button className="btn login__submit" type="submit" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </button>

        <div className="login__demo">
          <span>
            Demo account: <code>{DEMO_ACCOUNT.email}</code> / <code>{DEMO_ACCOUNT.password}</code>
          </span>
          <button type="button" className="btn btn--ghost btn--small" onClick={fillDemo}>
            Fill in
          </button>
        </div>

        <p className="muted login__note">
          Just looking? <Link to="/flights">Browse flights without an account →</Link>
        </p>
      </form>
    </section>
  );
}