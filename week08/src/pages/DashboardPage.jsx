import { Link, useSearchParams } from "react-router";
import FlightCard from "../components/FlightCard.jsx";
import StateMessage from "../components/StateMessage.jsx";
import { useAllFlights } from "../hooks/useAllFlights.js";
import { STATUSES, TERMINALS } from "../utils/flights.js";


function countBy(items, field) {
  const counts = {};
  for (const item of items) {
    const key = item[field] || "unknown";
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

function percent(part, total) {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

export default function DashboardPage() {
  const { flights, status, error, reload } = useAllFlights();

  // Interactive filter: terminal. Kept in the URL (?terminal=T2) so it survives refresh.
  const [searchParams, setSearchParams] = useSearchParams();
  const terminal = searchParams.get("terminal") ?? "";

  function handleTerminalChange(value) {
    setSearchParams(value ? { terminal: value } : {});
  }

  if (status === "loading") {
    return (
      <section className="page">
        <h1>Dashboard</h1>
        <StateMessage type="loading" title="Loading statistics…" />
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="page">
        <h1>Dashboard</h1>
        <StateMessage
          type="error"
          title="Failed to load statistics"
          action={
            <button className="btn" onClick={reload}>
              Try again
            </button>
          }
        >
          {error}
        </StateMessage>
      </section>
    );
  }

  // Everything below is calculated from API data on every render
  const visible = terminal ? flights.filter((flight) => flight.terminal === terminal) : flights;

  const totalFlights = visible.length;
  const totalPassengers = visible.reduce((sum, flight) => sum + (Number(flight.passengers) || 0), 0);
  const operating = visible.filter((flight) => flight.status !== "cancelled");
  const avgPassengers = operating.length === 0 ? 0 : Math.round(totalPassengers / operating.length);
  const problemFlights = visible.filter((flight) => flight.status === "delayed" || flight.status === "cancelled");
  const onTimeRate = percent(totalFlights - problemFlights.length, totalFlights);

  const byStatus = STATUSES.map((value) => ({
    key: value,
    count: visible.filter((flight) => flight.status === value).length,
  }));
  const byAirline = countBy(visible, "airline");
  const maxAirline = byAirline[0]?.count ?? 0;
  const delayedFlights = visible.filter((flight) => flight.status === "delayed").slice(0, 4);

  // link to the Flights page with the same filters applied
  function flightsLink(extra) {
    const params = new URLSearchParams(extra);
    if (terminal) params.set("terminal", terminal);
    const query = params.toString();
    return query ? `/flights?${query}` : "/flights";
  }

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Dashboard</h1>
          <p className="page__subtitle">Statistics calculated from the current flight data.</p>
        </div>
        <div className="page__actions">
          <label className="filters__field">
            Terminal
            <select value={terminal} onChange={(event) => handleTerminalChange(event.target.value)}>
              <option value="">All terminals</option>
              {TERMINALS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <button className="btn btn--ghost" onClick={reload}>
            Reload
          </button>
        </div>
      </div>

      {totalFlights === 0 ? (
        <StateMessage type="empty" title="No flights for this terminal">
          Choose another terminal or <Link to="/flights">add a flight</Link>.
        </StateMessage>
      ) : (
        <>
          <div className="stats">
            <Link to={flightsLink({})} className="stat">
              <span className="stat__value">{totalFlights}</span>
              <span className="stat__label">Flights</span>
            </Link>
            <div className="stat">
              <span className="stat__value">{totalPassengers.toLocaleString("en-US")}</span>
              <span className="stat__label">Passengers</span>
            </div>
            <div className="stat">
              <span className="stat__value">{avgPassengers}</span>
              <span className="stat__label">Avg passengers per operating flight</span>
            </div>
            <div className="stat">
              <span className="stat__value">{onTimeRate}%</span>
              <span className="stat__label">On time (not delayed / cancelled)</span>
            </div>
            <Link to={flightsLink({ status: "delayed" })} className="stat stat--warning">
              <span className="stat__value">{problemFlights.length}</span>
              <span className="stat__label">Delayed or cancelled</span>
            </Link>
          </div>

          <div className="breakdowns">
            <div className="panel">
              <h2>By status</h2>
              <ul className="bars">
                {byStatus.map((row) => (
                  <li key={row.key}>
                    <Link to={flightsLink({ status: row.key })} className="bars__row">
                      <span className="bars__label">{row.key}</span>
                      <span className="bars__track">
                        <span
                          className={`bars__fill bars__fill--${row.key}`}
                          style={{ width: `${percent(row.count, totalFlights)}%` }}
                        />
                      </span>
                      <span className="bars__value">{row.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel">
              <h2>By airline</h2>
              <ul className="bars">
                {byAirline.map((row) => (
                  <li key={row.key}>
                    <Link to={flightsLink({ search: row.key })} className="bars__row">
                      <span className="bars__label">{row.key}</span>
                      <span className="bars__track">
                        <span className="bars__fill" style={{ width: `${percent(row.count, maxAirline)}%` }} />
                      </span>
                      <span className="bars__value">{row.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="panel">
            <div className="panel__header">
              <h2>Delayed flights</h2>
              <Link to={flightsLink({ status: "delayed" })}>See all delayed →</Link>
            </div>
            {delayedFlights.length === 0 ? (
              <p className="muted">No delayed flights. 🎉</p>
            ) : (
              <div className="card-grid">
                {delayedFlights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}