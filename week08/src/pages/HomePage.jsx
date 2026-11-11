import { Link } from "react-router";
import heroImage from "../assets/departures-hero.svg";

export default function HomePage() {
  return (
    <section className="page home">
      <div className="home__hero">
        <div className="home__text">
          <p className="home__eyebrow">Almaty International · ALA</p>
          <h1>Departures Board</h1>
          <p>
            Follow every departure of the day: search flights, filter them by status and terminal, open a flight to see
            its gate, aircraft and passengers, and update its status in real time.
          </p>
          <div className="home__links">
            <Link to="/flights" className="btn">
              Browse flights
            </Link>
            <Link to="/board" className="btn btn--ghost">
              Live board
            </Link>
            <Link to="/flights?status=delayed" className="btn btn--ghost">
              Delayed flights
            </Link>
          </div>
        </div>
        <img className="home__image" src={heroImage} alt="Airplane taking off above a departures board" />
      </div>

      <div className="home__features">
        <Link to="/flights" className="feature">
          <h2>Flights</h2>
          <p>Search, two filters, sorting and pagination — all saved in the URL.</p>
        </Link>
        <Link to="/board" className="feature">
          <h2>Live board</h2>
          <p>The airport departures screen, refreshed automatically every 30 seconds.</p>
        </Link>
        <Link to="/dashboard" className="feature">
          <h2>Dashboard 🔒</h2>
          <p>For signed-in users: statistics and breakdowns by status and airline, filtered by terminal.</p>
        </Link>
        <Link to="/about" className="feature">
          <h2>About</h2>
          <p>How the project is built: routes, architecture and technologies.</p>
        </Link>
      </div>
    </section>
  );
}