import { useEffect, useState } from "react";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import { SORT_OPTIONS, STATUSES, TERMINALS } from "../utils/flights.js";

export default function FlightFilters({ search, status, terminal, sort, onChange, onReset }) {
  const [draft, setDraft] = useState(search); 
  const [urlSearch, setUrlSearch] = useState(search);
  const debouncedDraft = useDebouncedValue(draft, 400);


  if (search !== urlSearch) {
    setUrlSearch(search);
    setDraft(search);
  }


  useEffect(() => {
    if (debouncedDraft !== search) onChange("search", debouncedDraft);
  }, [debouncedDraft]);

  const hasFilters = search || status || terminal;

  return (
    <div className="filters">
      <label className="filters__field filters__field--wide">
        Search
        <input
          type="search"
          value={draft}
          placeholder="Flight, city or airline…"
          onChange={(event) => setDraft(event.target.value)}
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