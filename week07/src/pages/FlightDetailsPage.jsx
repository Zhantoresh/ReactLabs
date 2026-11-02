import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import FlightForm from "../components/FlightForm.jsx";
import StateMessage from "../components/StateMessage.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useFlight } from "../hooks/useFlight.js";
import { deleteFlight, updateFlight } from "../services/service.js";
import { formatDeparture, show, STATUS_ACTIONS } from "../utils/flights.js";

export default function FlightDetailsPage() {
  const { id } = useParams();
  // key={id}: when the URL changes from /flights/3 to /flights/5 React creates
  // a fresh FlightDetails, so form / pending state of the old flight is reset.
  return <FlightDetails key={id} id={id} />;
}

function FlightDetails({ id }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { flight, setFlight, status, error, reload } = useFlight(id);

  const [isEditing, setIsEditing] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // null | "edit" | "status" | "delete"
  const [actionError, setActionError] = useState("");
  const isBusy = pendingAction !== null;
  const notice = location.state?.notice ?? "";

  // "Back" goes to the previous page (keeps list filters).
  // If the page was opened directly (no history inside the app), go to the list.
  function handleBack() {
    if (location.key !== "default") navigate(-1);
    else navigate("/flights");
  }

  async function handleEdit(values) {
    const flightId = flight.id; // remember the id before await
    setPendingAction("edit");
    setActionError("");
    try {
      const updated = await updateFlight(flightId, values);
      setFlight((prev) => (prev && prev.id === updated.id ? updated : prev));
      setIsEditing(false);
    } catch (err) {
      setActionError(`Update failed: ${err.message}`);
    } finally {
      setPendingAction(null);
    }
  }

  async function handleChangeStatus(newStatus) {
    if (isBusy) return;
    const flightId = flight.id;
    setPendingAction("status");
    setActionError("");
    try {
      const updated = await updateFlight(flightId, { status: newStatus });
      setFlight((prev) => (prev && prev.id === updated.id ? updated : prev));
    } catch (err) {
      setActionError(`Status update failed for flight #${flightId}: ${err.message}`);
    } finally {
      setPendingAction(null);
    }
  }

  async function handleRemove() {
    if (!window.confirm(`Remove flight ${flight.name}?`)) return;
    const flightId = flight.id;
    setPendingAction("delete");
    setActionError("");
    try {
      await deleteFlight(flightId);
      navigate("/flights", { replace: true });
    } catch (err) {
      setActionError(`Remove failed: ${err.message}`);
      setPendingAction(null);
    }
  }

  const links = (
    <div className="details-nav">
      <button className="btn btn--ghost btn--small" onClick={handleBack}>
        ← Back
      </button>
      <Link to="/flights" className="btn btn--ghost btn--small">
        All flights
      </Link>
    </div>
  );

  if (status === "loading") {
    return (
      <section className="page">
        {links}
        <StateMessage type="loading" title="Loading flight details…" />
      </section>
    );
  }

  if (status === "notfound") {
    return (
      <section className="page">
        {links}
        <StateMessage
          type="empty"
          title="Flight not found"
          action={
            <Link to="/flights" className="btn">
              See all flights
            </Link>
          }
        >
          {error}. It may have been removed or the link is wrong.
        </StateMessage>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="page">
        {links}
        <StateMessage
          type="error"
          title="Failed to load flight details"
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

  const { date, time } = formatDeparture(flight.departureTime);

  return (
    <section className="page">
      {links}

      {notice && <StateMessage type="info" title={notice} />}
      {actionError && <StateMessage type="error" title={actionError} />}

      <div className="details-card">
        <div className="details-card__header">
          <div>
            <p className="details-card__eyebrow">{show(flight.airline)}</p>
            <h1 className="details-card__title">{flight.name}</h1>
            <p className="details-card__route">{flight.description}</p>
          </div>
          <StatusBadge status={flight.status} updating={pendingAction === "status"} />
        </div>

        <dl className="details-grid">
          <div><dt>Flight number</dt><dd>{show(flight.name)}</dd></div>
          <div><dt>Route</dt><dd>{show(flight.description)}</dd></div>
          <div><dt>Airline</dt><dd>{show(flight.airline)}</dd></div>
          <div><dt>Destination</dt><dd>{show(flight.destination)}</dd></div>
          <div><dt>Departure date</dt><dd>{date}</dd></div>
          <div><dt>Departure time</dt><dd>{time}</dd></div>
          <div><dt>Terminal</dt><dd>{show(flight.terminal)}</dd></div>
          <div><dt>Gate</dt><dd>{show(flight.gate)}</dd></div>
          <div><dt>Aircraft</dt><dd>{show(flight.aircraft)}</dd></div>
          <div><dt>Passengers</dt><dd>{show(flight.passengers)}</dd></div>
          <div><dt>Status</dt><dd>{show(flight.status)}</dd></div>
        </dl>

        <div className="status-actions">
          <span className="status-actions__label">
            {pendingAction === "status" ? "Updating status…" : "Change status:"}
          </span>
          {STATUS_ACTIONS.filter((action) => action.value !== flight.status).map((action) => (
            <button
              key={action.value}
              className="btn btn--small"
              onClick={() => handleChangeStatus(action.value)}
              disabled={isBusy}
            >
              {action.label}
            </button>
          ))}
        </div>

        <div className="details-card__actions">
          <button className="btn" onClick={() => setIsEditing(true)} disabled={isBusy || isEditing}>
            Edit
          </button>
          <button className="btn btn--danger" onClick={handleRemove} disabled={isBusy}>
            {pendingAction === "delete" ? "Removing…" : "Remove"}
          </button>
        </div>
      </div>

      {isEditing && (
        <FlightForm
          title={`Edit ${flight.name}`}
          submitLabel="Save"
          initialValues={flight}
          saving={pendingAction === "edit"}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </section>
  );
}