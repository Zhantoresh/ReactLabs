import { SORT_OPTIONS, STATUSES, TERMINALS } from "../utils/flights.js";

// Controlled inputs: values come from the URL (via the page),
// every change is sent back up with onChange(key, value).
export default function FlightFilters({ search, status, terminal, sort, onChange, onReset }) {
  const hasFilters = search || status || terminal;

  return (
    <div className="filters">
      <label className="filters__field filters__field--wide">
        Search
        <input
          type="search"
          value={search}
          placeholder="Flight, city or airline…"
          onChange={(event) => onChange("search", event.target.value)}
        />
      </label>

      <label className="filters__field">
        Status
        <select value={status} onChange={(event) => onChange("status", event.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      <label className="filters__field">
        Terminal
        <select value={terminal} onChange={(event) => onChange("terminal", event.target.value)}>
          <option value="">All terminals</option>
          {TERMINALS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      <label className="filters__field">
        Sort by
        <select value={sort} onChange={(event) => onChange("sort", event.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <button className="btn btn--ghost filters__reset" onClick={onReset} disabled={!hasFilters}>
        Reset filters
      </button>
    </div>
  );
}