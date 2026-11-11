import { Link } from "react-router";
import StatusBadge from "./StatusBadge.jsx";
import { formatDeparture, show } from "../utils/flights.js";

// Reusable card: used on the Flights page and on the Dashboard.
export default function FlightCard({ flight }) {
  const { date, time } = formatDeparture(flight.departureTime);

  return (
    <Link to={`/flights/${flight.id}`} className="card">
      <div className="card__top">
        <span className="card__time">{time}</span>
        <StatusBadge status={flight.status} />
      </div>
      <h3 className="card__title">{flight.name}</h3>
      <p className="card__route">{flight.description}</p>
      <dl className="card__meta">
        <div>
          <dt>Airline</dt>
          <dd>{show(flight.airline)}</dd>
        </div>
        <div>
          <dt>Terminal / Gate</dt>
          <dd>
            {show(flight.terminal)} / {show(flight.gate)}
          </dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{date}</dd>
        </div>
      </dl>
    </Link>
  );
}