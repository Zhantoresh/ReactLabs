import { show } from "../utils/flights.js";

export default function StatusBadge({ status, updating = false }) {
  if (updating) {
    return <span className="badge badge--updating">updating…</span>;
  }
  return <span className={`badge badge--${status}`}>{show(status)}</span>;
}