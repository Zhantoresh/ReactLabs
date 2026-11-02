import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import FlightCard from "../components/FlightCard.jsx";
import FlightFilters from "../components/FlightFilters.jsx";
import FlightForm from "../components/FlightForm.jsx";
import Pagination from "../components/Pagination.jsx";
import StateMessage from "../components/StateMessage.jsx";
import { useFlightsList } from "../hooks/useFlightsList.js";
import { createFlight, PAGE_SIZE } from "../services/service.js";

const FILTER_KEYS = ["search", "status", "terminal"];

export default function FlightsPage() {
  const navigate = useNavigate();

  // The URL is the single source of truth for filters:
  // /flights?search=dubai&status=delayed&sort=departure&page=2
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const terminal = searchParams.get("terminal") ?? "";
  const sort = searchParams.get("sort") ?? "departure";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const list = useFlightsList({ search, status, terminal, sort, page, limit: PAGE_SIZE });

  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [createError, setCreateError] = useState("");

  // Change one URL parameter. Any filter change returns to page 1.
  function handleFilterChange(key, value) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        next.delete("page");
        return next;
      },
      // typing in search should not create a history entry for every letter
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

  async function handleCreate(values) {
    setSaving(true);
    setCreateError("");
    try {
      const { flight, warning } = await createFlight(values);
      // go to the new flight; the message is passed in navigation state
      navigate(`/flights/${flight.id}`, {
        state: { notice: warning || `Flight ${flight.name} was created.` },
      });
    } catch (err) {
      setCreateError(`Create failed: ${err.message}`);
      setSaving(false);
    }
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
          <button className="btn" onClick={() => setIsCreating(true)} disabled={isCreating}>
            New flight
          </button>
          <button className="btn btn--ghost" onClick={list.reload} disabled={list.status === "loading"}>
            Reload
          </button>
        </div>
      </div>

      {createError && <StateMessage type="error" title={createError} />}

      {isCreating && (
        <FlightForm
          title="New flight"
          submitLabel="Create"
          saving={saving}
          onSubmit={handleCreate}
          onCancel={() => {
            setIsCreating(false);
            setCreateError("");
          }}
        />
      )}

      <FlightFilters
        search={search}
        status={status}
        terminal={terminal}
        sort={sort}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {list.status === "loading" && <StateMessage type="loading" title="Loading flights…" />}

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