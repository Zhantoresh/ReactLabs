import { useState } from "react";
import { Link, useNavigate } from "react-router";
import FlightForm from "../components/FlightForm.jsx";
import StateMessage from "../components/StateMessage.jsx";
import { useCreateFlight } from "../hooks/useFlightMutations.js";


export default function NewFlightPage() {
  const navigate = useNavigate();
  const createMutation = useCreateFlight();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(values) {
    setSaving(true);
    setError("");
    try {
      const { flight, warning } = await createMutation.mutateAsync(values);
      navigate(`/flights/${flight.id}`, {
        replace: true,
        state: { notice: warning || `Flight ${flight.name} was created.` },
      });
    } catch (err) {
      setError(`Create failed: ${err.message}`);
      setSaving(false);
    }
  }

  return (
    <section className="page">
      <div className="details-nav">
        <Link to="/flights" className="btn btn--ghost btn--small">
          ← All flights
        </Link>
      </div>

      <h1>New flight</h1>
      {error && <StateMessage type="error" title={error} />}

      <FlightForm
        title="Flight details"
        submitLabel="Create"
        saving={saving}
        onSubmit={handleCreate}
        onCancel={() => navigate("/flights")}
      />
    </section>
  );
}