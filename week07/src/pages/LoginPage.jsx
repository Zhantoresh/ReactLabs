import { useState } from "react";
import { Link } from "react-router";

// Placeholder for future authentication: the form works as a controlled form,
// but nothing is sent anywhere yet.
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="page login">
      <form className="login__card" onSubmit={handleSubmit}>
        <h1>Log in</h1>
        <p className="muted">Staff access to the departures board.</p>

        <label className="login__field">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="dispatcher@ala.kz"
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
            required
          />
        </label>

        <button className="btn login__submit" type="submit">
          Log in
        </button>

        {submitted && (
          <p className="state state--info">Authentication is not implemented yet — this page is a placeholder.</p>
        )}

        <p className="muted login__note">
          No account needed for now. <Link to="/flights">Continue to flights →</Link>
        </p>
      </form>
    </section>
  );
}