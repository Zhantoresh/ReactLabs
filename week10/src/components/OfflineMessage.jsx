import { Link } from "react-router";
import { useRetryConnection } from "../hooks/useOnlineStatus.js";

export default function OfflineMessage({ onBackOnline, title = "You are offline" }) {
  const { retry, checking, stillOffline } = useRetryConnection(onBackOnline);

  return (
    <div className="offline-card" role="alert">
      <div className="offline-card__icon" aria-hidden="true">
        📡
      </div>
      <h2 className="offline-card__title">{title}</h2>
      <p>This page needs an internet connection: its data has not been saved on this device yet.</p>
      <p className="muted">
        Pages and flights you have already opened still work offline. Changes (new flights, statuses, edits) can be
        saved only online.
      </p>
      <div className="offline-card__actions">
        <button className="btn" onClick={retry} disabled={checking}>
          {checking ? "Checking…" : "Retry connection"}
        </button>
        <Link to="/flights" className="btn btn--ghost">
          Saved flights
        </Link>
      </div>
      {stillOffline && (
        <p className="offline-card__status" role="status">
          Still offline. Check Wi-Fi or mobile data and try again.
        </p>
      )}
    </div>
  );
}