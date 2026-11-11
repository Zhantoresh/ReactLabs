import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import GoogleButton from "../components/GoogleButton.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { authErrorMessage } from "../services/auth.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


function validate({ email, password, confirm }) {
  const errors = {};
  if (!email.trim()) errors.email = "Enter your email.";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "This does not look like an email.";

  if (!password) errors.password = "Enter a password.";
  else if (password.length < 6) errors.password = "At least 6 characters (Firebase rule).";

  if (!confirm) errors.confirm = "Repeat the password.";
  else if (confirm !== password) errors.confirm = "Passwords do not match.";
  return errors;
}


export default function SignupPage() {
  const { signUp, logInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search}` : "/profile";

  const [values, setValues] = useState({ email: "", password: "", confirm: "" });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const errors = validate(values); 
  const showError = (field) => (touched[field] || submitted) && errors[field];

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

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
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return; 
    run(() => signUp(values.email, values.password));
  }

  return (
    <section className="page login">
      <form className="login__card" onSubmit={handleSubmit} noValidate>
        <h1>Create an account</h1>
        <p className="muted">With an account you can add and edit flights and open the dashboard.</p>

        <GoogleButton onClick={() => run(logInWithGoogle)} disabled={submitting}>
          Sign up with Google
        </GoogleButton>

        <div className="login__divider">
          <span>or with email</span>
        </div>

        <label className="login__field">
          Email
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={Boolean(showError("email"))}
          />
          {showError("email") && <span className="field-error">{errors.email}</span>}
        </label>

        <label className="login__field">
          Password
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            aria-invalid={Boolean(showError("password"))}
          />
          {showError("password") && <span className="field-error">{errors.password}</span>}
        </label>

        <label className="login__field">
          Confirm password
          <input
            type="password"
            name="confirm"
            value={values.confirm}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Repeat the password"
            autoComplete="new-password"
            aria-invalid={Boolean(showError("confirm"))}
          />
          {showError("confirm") && <span className="field-error">{errors.confirm}</span>}
        </label>

        {error && (
          <p className="state state--error" role="alert">
            {error}
          </p>
        )}

        <button className="btn login__submit" type="submit" disabled={submitting}>
          {submitting ? "Creating account…" : "Sign up"}
        </button>

        <p className="muted login__note">
          Already have an account?{" "}
          <Link to="/login" state={location.state}>
            Log in
          </Link>
        </p>
      </form>
    </section>
  );
}