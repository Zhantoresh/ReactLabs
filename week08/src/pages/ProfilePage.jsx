import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import { authErrorMessage } from "../services/auth.js";

const PROVIDERS = { password: "Email & password", "google.com": "Google" };

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}


export default function ProfilePage() {
  const { user, logOut, sendVerificationEmail, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [verifyStatus, setVerifyStatus] = useState("idle"); // "idle" | "sending" | "sent" | "checking"

  if (!user) return null; 

  const provider = user.providerData[0]?.providerId;
  const name = user.displayName || user.email;

  async function handleSendVerification() {
    setVerifyStatus("sending");
    setError("");
    try {
      await sendVerificationEmail();
      setVerifyStatus("sent");
    } catch (err) {
      setError(authErrorMessage(err));
      setVerifyStatus("idle");
    }
  }

 
  async function handleCheckVerified() {
    setVerifyStatus("checking");
    setError("");
    try {
      const freshUser = await refreshUser();
      if (!freshUser?.emailVerified) {
        setError("Not verified yet — open the link in the email first, then press the button again.");
      }
      setVerifyStatus("sent");
    } catch (err) {
      setError(authErrorMessage(err));
      setVerifyStatus("sent");
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    setError("");
    try {
      await logOut();
      navigate("/login", { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
      setLoggingOut(false);
    }
  }

  return (
    <section className="page profile">
      <div className="profile__card">
        <div className="profile__header">
          {user.photoURL ? (
            <img className="profile__avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
          ) : (
            <span className="profile__avatar profile__avatar--letter" aria-hidden="true">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <h1>{name}</h1>
            <p className="muted">Signed in with {PROVIDERS[provider] ?? provider ?? "Firebase"}</p>
          </div>
        </div>

        {!user.emailVerified && (
          <div className="verify-banner">
            <p>
              <strong>Your email is not verified.</strong>{" "}
              {verifyStatus === "sent" || verifyStatus === "checking"
                ? `We sent a link to ${user.email}. Open it, then press "I have verified".`
                : "Verify it to make sure the account and password reset emails really reach you."}
            </p>
            <div className="verify-banner__actions">
              {verifyStatus === "idle" || verifyStatus === "sending" ? (
                <button className="btn btn--small" onClick={handleSendVerification} disabled={verifyStatus === "sending"}>
                  {verifyStatus === "sending" ? "Sending…" : "Send verification email"}
                </button>
              ) : (
                <>
                  <button className="btn btn--small" onClick={handleCheckVerified} disabled={verifyStatus === "checking"}>
                    {verifyStatus === "checking" ? "Checking…" : "I have verified"}
                  </button>
                  <button className="btn btn--ghost btn--small" onClick={handleSendVerification}>
                    Send again
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <dl className="details-grid profile__grid">
          <div>
            <dt>Email</dt>
            <dd>{user.email ?? "—"}</dd>
          </div>
          <div className="profile__uid">
            <dt>UID</dt>
            <dd>
              <code>{user.uid}</code>
            </dd>
          </div>
          <div>
            <dt>Email verified</dt>
            <dd>{user.emailVerified ? "Yes ✓" : "No"}</dd>
          </div>
          <div>
            <dt>Account created</dt>
            <dd>{formatDate(user.metadata.creationTime)}</dd>
          </div>
          <div>
            <dt>Last sign-in</dt>
            <dd>{formatDate(user.metadata.lastSignInTime)}</dd>
          </div>
        </dl>

        {error && <p className="state state--error">{error}</p>}

        <div className="details-card__actions">
          <Link to="/dashboard" className="btn">
            Open dashboard
          </Link>
          <Link to="/my-flights" className="btn btn--ghost">
            ★ My flights
          </Link>
          <Link to="/flights/new" className="btn btn--ghost">
            Add a flight
          </Link>
          <button className="btn btn--danger" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      </div>
    </section>
  );
}