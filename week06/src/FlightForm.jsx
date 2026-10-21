import { useState } from "react";

const STATUSES = ["scheduled", "boarding", "delayed", "departed", "cancelled"];

const EMPTY = {
  name: "",
  description: "",
  airline: "",
  destination: "",
  terminal: "",
  gate: "",
  departureTime: "",
  aircraft: "",
  passengers: "",
  status: "scheduled",
};

export default function FlightForm({ title, submitLabel, initialValues, saving, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => {
    const start = { ...EMPTY };
    for (const key in EMPTY) {
      if (initialValues && initialValues[key] !== undefined) {
        start[key] = String(initialValues[key]);
      }
    }
    return start;
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
      passengers: Number(values.passengers) || 0,
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{title}</h2>

      <label>Flight number
        <input name="name" value={values.name} onChange={handleChange} required />
      </label>
      <label>Route
        <input name="description" value={values.description} onChange={handleChange} required />
      </label>
      <label>Airline
        <input name="airline" value={values.airline} onChange={handleChange} required />
      </label>
      <label>Destination
        <input name="destination" value={values.destination} onChange={handleChange} required />
      </label>
      <label>Terminal
        <input name="terminal" value={values.terminal} onChange={handleChange} required />
      </label>
      <label>Gate
        <input name="gate" value={values.gate} onChange={handleChange} required />
      </label>
      <label>Departure
        <input type="datetime-local" name="departureTime" value={values.departureTime} onChange={handleChange} required />
      </label>
      <label>Aircraft
        <input name="aircraft" value={values.aircraft} onChange={handleChange} required />
      </label>
      <label>Passengers
        <input type="number" min="0" name="passengers" value={values.passengers} onChange={handleChange} required />
      </label>
      <label>Status
        <select name="status" value={values.status} onChange={handleChange}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>

      <div className="form__actions">
        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </button>
        <button className="btn btn--ghost" type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}