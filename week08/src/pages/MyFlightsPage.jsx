import { Link } from "react-router";
import FlightCard from "../components/FlightCard.jsx";
import StateMessage from "../components/StateMessage.jsx";
import { useAllFlights } from "../hooks/useAllFlights.js";
import { useFavorites } from "../hooks/useFavorites.js";


export default function MyFlightsPage() {
  const favorites = useFavorites(); 
  const all = useAllFlights(); 

  const loading = favorites.status === "loading" || all.status === "loading";
  const error = favorites.status === "error" ? favorites : all.status === "error" ? all : null;


  const saved = all.flights.filter((flight) => favorites.ids.includes(flight.id));

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>My flights</h1>
          <p className="page__subtitle">Flights you saved with ☆. Only you can see this list.</p>
        </div>
      </div>

      {loading && <StateMessage type="loading" title="Loading your flights…" />}

      {!loading && error && (
        <StateMessage
          type="error"
          title="Failed to load your flights"
          action={
            <button className="btn" onClick={error.reload}>
              Try again
            </button>
          }
        >
          {error.error}
        </StateMessage>
      )}

      {!loading && !error && saved.length === 0 && (
        <StateMessage
          type="empty"
          title="No saved flights yet"
          action={
            <Link to="/flights" className="btn">
              Browse flights
            </Link>
          }
        >
          Press ☆ on any flight card to keep it here.
        </StateMessage>
      )}

      {!loading && !error && saved.length > 0 && (
        <>
          <p className="results-info">{saved.length} saved flight(s)</p>
          <div className="card-grid">
            {saved.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}