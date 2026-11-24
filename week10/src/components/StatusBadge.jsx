import { show } from "../utils/flights.js";


export default function StatusBadge({ status, updating = false, pending = false }) {
  if (updating) {
    return <span className="badge badge--updating">updating…</span>;
  }
  return (
    <span
      className={`badge badge--${status} ${pending ? "badge--pending" : ""}`}
      title={pending ? "Changed offline: waiting to be sent" : undefined}
    >
      {pending && <span aria-hidden="true">⏳ </span>}
      {show(status)}
    </span>
  );
}