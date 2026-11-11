import { Link, useSearchParams } from "react-router";
import StateMessage from "../components/StateMessage.jsx";
import { useLiveFlights } from "../hooks/useLiveFlights.js";
import { useNow } from "../hooks/useNow.js";
import { formatDeparture, STATUS_REMARKS, TERMINALS } from "../utils/flights.js";

const REFRESH_MS = 30000; 
export default function BoardPage() {
  const { flights, status, error, updatedAt, refreshFailed, refreshing, reload } = useLiveFlights(REFRESH_MS);
  const now = useNow(1000);
  const [searchParams, setSearchParams] = useSearchParams();
  const terminal = searchParams.get("terminal") ?? "";

  const rows = terminal ? flights.filter((flight) => flight.terminal === terminal) : flights;
  const secondsAgo = updatedAt ? Math.max(0, Math.floor((now - updatedAt) / 1000)) : null;
  const clock = new Date(now).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <section className="page board-page">
      <div className="board">
        <header className="board__header">
          <div>
            <p className="board__title">✈ Departures</p>
            <p className="board__subtitle">Вылет · Ұшып шығу · Almaty International</p>
          </div>
          <div className="board__clock" aria-label="Current time">
            {clock}
          </div>
        </header>

        <div className="board__tabs" role="tablist" aria-label="Terminal">
          {["", ...TERMINALS].map((value) => (
            <button
              key={value || "all"}
              role="tab"
              aria-selected={terminal === value}
              className={`board__tab ${terminal === value ? "board__tab--active" : ""}`}
              onClick={() => setSearchParams(value ? { terminal: value } : {})}
            >
              {value || "All terminals"}
            </button>
          ))}
        </div>

        {status === "loading" && <p className="board__message">Loading departures…</p>}

        {status === "error" && (
          <div className="board__message board__message--error">
            <p>Board is not available: {error}</p>
            <button className="btn" onClick={reload}>
              Try again
            </button>
          </div>
        )}

        {status === "success" && rows.length === 0 && (
          <p className="board__message">No departures from this terminal.</p>
        )}

        {status === "success" && rows.length > 0 && (
          <div className="board__table" role="table">
            <div className="board__row board__row--head" role="row">
              <span role="columnheader">Time</span>
              <span role="columnheader">Flight</span>
              <span role="columnheader">Destination</span>
              <span role="columnheader" className="board__col--airline">
                Airline
              </span>
              <span role="columnheader" className="board__col--terminal">
                Terminal
              </span>
              <span role="columnheader">Gate</span>
              <span role="columnheader">Remarks</span>
            </div>

            {rows.map((flight) => (
              <Link key={flight.id} to={`/flights/${flight.id}`} className="board__row" role="row">
                <span className="board__time">{formatDeparture(flight.departureTime).time}</span>
                <span className="board__flight">{flight.name}</span>
                <span className="board__destination">{flight.destination}</span>
                <span className="board__col--airline">{flight.airline}</span>
                <span className="board__col--terminal">{flight.terminal}</span>
                <span>{flight.gate}</span>
                <span className={`board__remark board__remark--${flight.status}`}>
                  {STATUS_REMARKS[flight.status] ?? flight.status}
                </span>
              </Link>
            ))}
          </div>
        )}

        <footer className="board__footer">
          <span>
            {secondsAgo === null ? "Waiting for data…" : `Updated ${secondsAgo} s ago`} · auto-refresh every{" "}
            {REFRESH_MS / 1000} s
            {refreshFailed && status === "success" && !refreshing && (
              <span className="board__warning"> · last refresh failed ({error}), showing previous data</span>
            )}
          </span>
          <button className="board__refresh" onClick={reload} disabled={refreshing}>
            {refreshing ? "Refreshing…" : "↻ Refresh now"}
          </button>
        </footer>
      </div>

      {status === "success" && (
        <StateMessage type="info" title="Tip">
          Click any row to open the flight. The board refreshes by itself — change a status on a flight page and watch it
          appear here.
        </StateMessage>
      )}
    </section>
  );
}