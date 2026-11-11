import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import GoogleButton from "../components/GoogleButton.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { authErrorMessage } from "../services/auth.js";

export default function LoginPage() {
  const { logIn, logInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search}` : "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function run(action) {
    setSubmitting(true);
    setError("");
    try {
      await action();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
      setSubmitting(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    run(() => logIn(email, password));
  }

  return (
    <section className="page login">
      <form className="login__card" onSubmit={handleSubmit} noValidate>
        <h1>Log in</h1>
        <p className="muted">Sign in to add and edit flights and to open the dashboard.</p>

        {from && (
          <p className="state state--info">
            Log in to open <code>{from.pathname}</code>.
          </p>
        )}

        <GoogleButton onClick={() => run(logInWithGoogle)} disabled={submitting} />

        <div className="login__divider">
          <span>or with email</span>
        </div>

        <label className="login__field">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
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
          />
        </label>

        {error && (
          <p className="state state--error" role="alert">
            {error}
          </p>
        )}

        <button className="btn login__submit" type="submit" disabled={submitting || !email || !password}>
          {submitting ? "Logging in…" : "Log in"}
        </button>

        <p className="muted login__note">
          No account yet?{" "}
          <Link to="/signup" state={location.state}>
            Sign up
          </Link>
        </p>
      </form>
    </section>
  );
}