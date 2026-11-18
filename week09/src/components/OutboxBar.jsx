import { Link } from "react-router";
import { useOutbox } from "../hooks/useOutbox.js";
import { STATUS_REMARKS } from "../utils/flights.js";

function plural(count, word) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}


export default function OutboxBar() {
  const { items, online, sending, result, send, discard } = useOutbox();

  if (items.length === 0) {
    if (!result) return null;
    const deleted = result.failed.filter((item) => item.lastError === "the flight was deleted");
    return (
      <div className="outbox-bar outbox-bar--done" role="status">
        {result.sent.length > 0 && <span>✓ {plural(result.sent.length, "offline change")} sent to the server.</span>}
        {deleted.length > 0 && (
          <span>
            {" "}
            Not sent: {deleted.map((item) => item.flightName).join(", ")} — the flight was deleted.
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="outbox-bar" role="status">
      <div className="outbox-bar__head">
        <strong>⏳ {plural(items.length, "change")} waiting to be sent</strong>
        {online ? (
          <button className="btn btn--small" onClick={send} disabled={sending}>
            {sending ? "Sending…" : "Send now"}
          </button>
        ) : (
          <span className="outbox-bar__hint">They will be sent automatically when the connection is back.</span>
        )}
      </div>
      <ul className="outbox-bar__list">
        {items.map((item) => (
          <li key={item.flightId}>
            <Link to={`/flights/${item.flightId}`}>{item.flightName}</Link> →{" "}
            {STATUS_REMARKS[item.status] ?? item.status}
            {item.lastError && <span className="outbox-bar__error"> ({item.lastError})</span>}
            <button className="outbox-bar__discard" onClick={() => discard(item.flightId)}>
              Discard
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}