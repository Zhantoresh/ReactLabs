import { Link } from "react-router";
import FavoriteButton from "./FavoriteButton.jsx";
import StatusBadge from "./StatusBadge.jsx";
import { usePrefetchFlight } from "../hooks/usePrefetchFlight.js";
import { formatDeparture, show } from "../utils/flights.js";


export default function FlightCard({ flight }) {
  const { date, time } = formatDeparture(flight.departureTime);
  const prefetch = usePrefetchFlight();

  return (
    <div className="card-wrap">
      {/* hovering (or focusing with Tab) loads the flight into the cache,
          so the details page usually opens without "Loading…" */}
      <Link
        to={`/flights/${flight.id}`}
        className="card"
        onMouseEnter={() => prefetch(flight.id)}
        onFocus={() => prefetch(flight.id)}
      >
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
      <FavoriteButton flightId={flight.id} />
    </div>
  );
}