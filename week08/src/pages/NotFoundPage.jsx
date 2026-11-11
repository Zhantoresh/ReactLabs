import { Link, useLocation } from "react-router";

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <section className="page not-found">
      <p className="not-found__code">404</p>
      <h1>Page not found</h1>
      <p className="muted">
        There is no page at <code>{location.pathname}</code>. The gate may have changed.
      </p>
      <div className="home__links">
        <Link to="/" className="btn">
          Go to Home
        </Link>
        <Link to="/flights" className="btn btn--ghost">
          See all flights
        </Link>
      </div>
    </section>
  );
}