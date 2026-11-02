// Shared constants and small helpers for flights (no React, no API here).

export const STATUSES = ["scheduled", "boarding", "delayed", "departed", "cancelled"];

export const TERMINALS = ["T1", "T2", "T3"];

export const SORT_OPTIONS = [
  { value: "departure", label: "Departure: earliest first" },
  { value: "departure-desc", label: "Departure: latest first" },
  { value: "name", label: "Flight number A–Z" },
  { value: "name-desc", label: "Flight number Z–A" },
  { value: "passengers-desc", label: "Most passengers" },
];

export const STATUS_ACTIONS = [
  { value: "boarding", label: "Start boarding" },
  { value: "departed", label: "Mark departed" },
  { value: "delayed", label: "Mark delayed" },
  { value: "cancelled", label: "Cancel flight" },
];

export function show(value) {
  return value === "" || value === undefined || value === null ? "—" : value;
}


export function formatDeparture(value) {
  if (!value) return { date: "—", time: "—" };
  const [datePart, timePart = ""] = String(value).split("T");
  const date = new Date(`${datePart}T00:00`);
  const dateLabel = Number.isNaN(date.getTime())
    ? datePart
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return { date: dateLabel, time: timePart.slice(0, 5) || "—" };
}