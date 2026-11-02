import { useState, useEffect } from "react";
import { getItemsList, getItem, createItem, updateItem, deleteItem } from "./api/fakeApi";
import FlightForm from "./FlightForm";
import "./App.css";

const STATUS_ACTIONS = [
  { value: "boarding", label: "Start boarding" },
  { value: "departed", label: "Mark departed" },
  { value: "delayed", label: "Mark delayed" },
  { value: "cancelled", label: "Cancel flight" },
];

function show(value) {
  return value ?? "—";
}

function App() {

  const [flights, setFlights] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "error" | "success"
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [selectedId, setSelectedId] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailStatus, setDetailStatus] = useState("idle"); // "idle" | "loading" | "error" | "success"
  const [detailError, setDetailError] = useState("");
  const [detailReloadKey, setDetailReloadKey] = useState(0);


  const [formMode, setFormMode] = useState(null); // null | "create" | "edit"
  const [pendingAction, setPendingAction] = useState(null); // null | "create" | "edit" | "delete" | "status"
  const [pendingId, setPendingId] = useState(null); 
  const [actionError, setActionError] = useState("");
  const isBusy = pendingAction !== null;


  useEffect(() => {
    let ignore = false;

    setStatus("loading");
    setError("");

    getItemsList("limit=100")
      .then((result) => {
        if (ignore) return;
        setFlights(result.data);
        setStatus("success");
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
        setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);


  useEffect(() => {
    if (selectedId === null) {
      setDetails(null);
      setDetailStatus("idle");
      return;
    }

    let ignore = false;

    setDetails(null);
    setDetailStatus("loading");
    setDetailError("");

    getItem(selectedId)
      .then((item) => {
        if (ignore) return;
        setDetails(item);
        setDetailStatus("success");
      })
      .catch((err) => {
        if (ignore) return;
        setDetailError(err.message);
        setDetailStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [selectedId, detailReloadKey]);

  function handleReload() {
    setActionError("");
    setReloadKey((key) => key + 1);
  }

  function handleSelect(id) {

    if (isBusy && pendingAction !== "status") return;
    setFormMode(null);
    setSelectedId(id);
  }

  function handleDetailRetry() {
    setDetailReloadKey((key) => key + 1);
  }


  async function handleCreate(values) {
    setPendingAction("create");
    setActionError("");

    const { name, description, ...extra } = values;

    let created;
    try {
      created = await createItem({ name, description });
    } catch (err) {
      setActionError(`Create failed: ${err.message}`);
      setPendingAction(null);
      return;
    }

    try {
      const full = await updateItem(created.id, extra);
      setFlights((prev) => [...prev, full]);
      setFormMode(null);
    } catch (err) {
      setFlights((prev) => [...prev, created]);
      setFormMode(null);
      setActionError(
        `Flight was created, but extra fields were not saved (${err.message}). Select it and press Edit to retry.`
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function handleEdit(values) {
    const id = selectedId;
    setPendingAction("edit");
    setPendingId(id);
    setActionError("");

    try {
      const updated = await updateItem(id, values);
      setFlights((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
      setDetails((prev) => (prev && prev.id === updated.id ? updated : prev));
      setFormMode(null);
    } catch (err) {
      setActionError(`Update failed: ${err.message}`);
    } finally {
      setPendingAction(null);
      setPendingId(null);
    }
  }


  async function handleChangeStatus(newStatus) {
    if (isBusy || selectedId === null) return;


    const id = selectedId;

    setPendingAction("status");
    setPendingId(id);
    setActionError("");

    try {
      const updated = await updateItem(id, { status: newStatus });

      setFlights((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
      setDetails((prev) => (prev && prev.id === updated.id ? updated : prev));
    } catch (err) {
      setActionError(`Status update failed for flight #${id}: ${err.message}`);
    } finally {
      setPendingAction(null);
      setPendingId(null);
    }
  }

  async function handleRemove() {
    const id = selectedId;
    if (!window.confirm("Remove this flight?")) return;

    setPendingAction("delete");
    setPendingId(id);
    setActionError("");

    try {
      await deleteItem(id);
      setFlights((prev) => prev.filter((f) => f.id !== id));
      setSelectedId((prev) => (prev === id ? null : prev));
      setFormMode(null);
    } catch (err) {
      setActionError(`Remove failed: ${err.message}`);
    } finally {
      setPendingAction(null);
      setPendingId(null);
    }
  }

  const canUseList = status === "success";
  const isStatusUpdatingHere = pendingAction === "status" && pendingId === selectedId;

  return (
    <div className="app">
      <header className="app__header">
        <h1>Departures Board</h1>
        <div className="app__header-actions">
          <button
            className="btn"
            onClick={() => {
              setActionError("");
              setFormMode("create");
            }}
            disabled={!canUseList || isBusy || formMode === "create"}
          >
            New flight
          </button>
          <button className="btn" onClick={handleReload} disabled={status === "loading" || isBusy}>
            Reload
          </button>
        </div>
      </header>

      {actionError && <p className="state state--error">{actionError}</p>}

      {formMode === "create" && (
        <FlightForm
          key="create"
          title="New flight"
          submitLabel="Create"
          saving={pendingAction === "create"}
          onSubmit={handleCreate}
          onCancel={() => setFormMode(null)}
        />
      )}

      {formMode === "edit" && details && (
        <FlightForm
          key={`edit-${details.id}`}
          title={`Edit ${details.name}`}
          submitLabel="Save"
          initialValues={details}
          saving={pendingAction === "edit"}
          onSubmit={handleEdit}
          onCancel={() => setFormMode(null)}
        />
      )}

      <div className="layout">
        <section className="panel">
          <h2>Flights</h2>

          {status === "loading" && <p className="state state--loading">Loading flights…</p>}

          {status === "error" && (
            <div className="state state--error">
              <p>Failed to load flights: {error}</p>
              <button className="btn" onClick={handleReload}>Try again</button>
            </div>
          )}

          {status === "success" && flights.length === 0 && (
            <p className="state state--empty">No flights yet. Press “New flight”.</p>
          )}

          {status === "success" && flights.length > 0 && (
            <ul className="flight-list">
              {flights.map((flight) => {
                const lockedByBusy = isBusy && pendingAction !== "status";
                return (
                  <li
                    key={flight.id}
                    className={`flight-item ${flight.id === selectedId ? "flight-item--selected" : ""} ${lockedByBusy ? "flight-item--disabled" : ""}`}
                    onClick={() => handleSelect(flight.id)}
                  >
                    <span className="flight-item__name">{flight.name}</span>
                    <span className="flight-item__desc">{flight.description}</span>
                    {pendingId === flight.id && pendingAction === "status" ? (
                      <span className="badge badge--updating">updating…</span>
                    ) : (
                      <span className={`badge badge--${flight.status}`}>{show(flight.status)}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="panel">
          <h2>Details</h2>

          {detailStatus === "idle" && <p className="state">Select a flight to see details.</p>}

          {detailStatus === "loading" && <p className="state state--loading">Loading details…</p>}

          {detailStatus === "error" && (
            <div className="state state--error">
              <p>Failed to load details: {detailError}</p>
              <button className="btn" onClick={handleDetailRetry}>Try again</button>
            </div>
          )}

          {detailStatus === "success" && details && (
            <>
              <dl className="details">
                <dt>Flight</dt><dd>{show(details.name)}</dd>
                <dt>Route</dt><dd>{show(details.description)}</dd>
                <dt>Airline</dt><dd>{show(details.airline)}</dd>
                <dt>Destination</dt><dd>{show(details.destination)}</dd>
                <dt>Terminal / Gate</dt><dd>{show(details.terminal)} / {show(details.gate)}</dd>
                <dt>Departure</dt>
                <dd>{details.departureTime ? details.departureTime.replace("T", " ") : "—"}</dd>
                <dt>Aircraft</dt><dd>{show(details.aircraft)}</dd>
                <dt>Passengers</dt><dd>{show(details.passengers)}</dd>
                <dt>Status</dt><dd>{show(details.status)}</dd>
              </dl>

              <div className="status-actions">
                <span className="status-actions__label">
                  {isStatusUpdatingHere ? "Updating status…" : "Change status:"}
                </span>
                {STATUS_ACTIONS.filter((a) => a.value !== details.status).map((action) => (
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

              <div className="details__actions">
                <button
                  className="btn"
                  onClick={() => {
                    setActionError("");
                    setFormMode("edit");
                  }}
                  disabled={isBusy || formMode === "edit"}
                >
                  Edit
                </button>
                <button className="btn btn--danger" onClick={handleRemove} disabled={isBusy}>
                  {pendingAction === "delete" ? "Removing…" : "Remove"}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;