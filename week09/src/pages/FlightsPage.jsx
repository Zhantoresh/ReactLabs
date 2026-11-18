import { Link, useSearchParams } from "react-router";
import FlightCard from "../components/FlightCard.jsx";
import FlightFilters from "../components/FlightFilters.jsx";
import Pagination from "../components/Pagination.jsx";
import StateMessage from "../components/StateMessage.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useFlightsList } from "../hooks/useFlightsList.js";
import { PAGE_SIZE } from "../services/service.js";

const FILTER_KEYS = ["search", "status", "terminal"];

export default function FlightsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const terminal = searchParams.get("terminal") ?? "";
  const sort = searchParams.get("sort") ?? "departure";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const list = useFlightsList({ search, status, terminal, sort, page, limit: PAGE_SIZE });

  function handleFilterChange(key, value) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        next.delete("page");
        return next;
      },
      { replace: key === "search" },
    );
  }

  function handleReset() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      FILTER_KEYS.forEach((key) => next.delete(key));
      next.delete("page");
      return next;
    });
  }

  function handlePageChange(newPage) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newPage <= 1) next.delete("page");
      else next.set("page", String(newPage));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const from = list.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, list.total);

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Flights</h1>
          <p className="page__subtitle">All departures from Almaty International (ALA).</p>
        </div>
        <div className="page__actions">
          {/* /flights/new is protected: without login RequireAuth sends you to /login and back */}
          <Link to="/flights/new" className="btn" title={user ? "" : "You will be asked to log in"}>
            {user ? "+ New flight" : "🔒 New flight"}
          </Link>
          <button className="btn btn--ghost" onClick={list.reload} disabled={list.isUpdating}>
            {list.isUpdating ? "Updating…" : "Reload"}
          </button>
        </div>
      </div>

      <FlightFilters
        search={search}
        status={status}
        terminal={terminal}
        sort={sort}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {list.status === "loading" && <StateMessage type="loading" title="Loading flights…" />}

      {list.refreshFailed && (
        <StateMessage
          type="error"
          title="Could not refresh the list — showing cached data"
          action={
            <button className="btn btn--small" onClick={list.reload}>
              Try again
            </button>
          }
        >
          {list.error}
        </StateMessage>
      )}

      {list.status === "error" && (
        <StateMessage
          type="error"
          title="Failed to load flights"
          action={
            <button className="btn" onClick={list.reload}>
              Try again
            </button>
          }
        >
          {list.error}
        </StateMessage>
      )}

      {list.status === "success" && list.total === 0 && (
        <StateMessage
          type="empty"
          title="No flights found"
          action={
            <button className="btn btn--ghost" onClick={handleReset}>
              Reset filters
            </button>
          }
        >
          Nothing matches these filters. Try another search or reset the filters.
        </StateMessage>
      )}

      {list.status === "success" && list.total > 0 && list.data.length === 0 && (
        <StateMessage
          type="empty"
          title={`Page ${page} does not exist`}
          action={
            <button className="btn btn--ghost" onClick={() => handlePageChange(1)}>
              Go to page 1
            </button>
          }
        >
          There are only {list.totalPages} page(s) for these filters.
        </StateMessage>
      )}

      {list.status === "success" && list.data.length > 0 && (
        <>
          <p className="results-info">
            Showing {from}–{to} of {list.total} flights
            {list.isUpdating && <span className="results-info__updating"> · updating…</span>}
          </p>
          <div className="card-grid">
            {list.data.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
          <Pagination page={page} totalPages={list.totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </section>
  );
}