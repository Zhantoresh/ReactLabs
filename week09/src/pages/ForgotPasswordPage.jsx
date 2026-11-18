import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import { authErrorMessage } from "../services/auth.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email ?? "");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setSending(true);
    setError("");
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="page login">
      <form className="login__card" onSubmit={handleSubmit} noValidate>
        <h1>Reset password</h1>
        <p className="muted">Enter the email of your account and we will send you a link to set a new password.</p>

        {sent ? (
          <p className="state state--info" role="status">
            If an account with <strong>{email.trim()}</strong> exists, a reset link is on its way. Check your inbox and
            the spam folder.
          </p>
        ) : (
          <>
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

            {error && (
              <p className="state state--error" role="alert">
                {error}
              </p>
            )}

            <button className="btn login__submit" type="submit" disabled={sending || !email}>
              {sending ? "Sending…" : "Send reset link"}
            </button>
          </>
        )}

        <p className="muted login__note">
          <Link to="/login">← Back to log in</Link>
        </p>
      </form>
    </section>
  );
}