import { auth } from "../firebase.js";
import { documentToFlight, toFirestoreFields } from "../api/firestoreFormat.js";


export const PAGE_SIZE = 8;

const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

// https://firestore.googleapis.com/v1/projects/<project>/databases/(default)/documents/flights
export const FLIGHTS_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/flights`;

export class OfflineError extends Error {
  constructor(message = "You are offline and this data has not been saved on this device yet.") {
    super(message);
    this.name = "OfflineError";
  }
}


export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}


function buildUrl(path = "", params = {}) {
  const url = new URL(FLIGHTS_URL + path);
  url.searchParams.set("key", API_KEY);
  for (const [key, value] of Object.entries(params)) {
    for (const item of [].concat(value)) url.searchParams.append(key, item);
  }
  return url.toString();
}


async function request(url, { method = "GET", body, withToken = false } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";

  if (withToken) {
    const user = auth.currentUser;
    if (!user) throw new Error("Log in to change flights.");
    headers.Authorization = `Bearer ${await user.getIdToken()}`;
  }

  let response;
  try {
    response = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    // fetch itself fails only when there is no connection (and, for reads, no cached copy)
    throw method === "GET"
      ? new OfflineError()
      : new OfflineError("No internet connection. Changes can be saved only online.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const status = data.error?.status;
    if (response.status === 404 || status === "NOT_FOUND") throw new NotFoundError("Flight was not found");
    if (response.status === 403) throw new Error("You are not allowed to do this. Log in and try again.");
    throw new Error(data.error?.message || `Server error (${response.status})`);
  }

  const fromCache = response.headers.get("X-SW-From-Cache") === "1";
  const cachedAt = fromCache ? Number(response.headers.get("X-SW-Cached-At")) || null : null;
  return { body: data, cachedAt };
}

// ---------- reading ----------


async function fetchAllDocuments() {
  const flights = [];
  let cachedAt = null;
  let pageToken = "";
  do {
    const { body, cachedAt: pageCachedAt } = await request(
      buildUrl("", { pageSize: 300, ...(pageToken && { pageToken }) }),
    );
    flights.push(...(body.documents ?? []).map(documentToFlight));
    cachedAt = cachedAt ?? pageCachedAt;
    pageToken = body.nextPageToken ?? "";
  } while (pageToken);
  return { flights, cachedAt };
}

function applyListParams(flights, params) {
  const { search, status, terminal, airline, sort = "name" } = params;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  let items = flights;

  if (search) {
    const q = search.toLowerCase();
    items = items.filter((item) =>
      [item.name, item.description, item.airline, item.destination]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q)),
    );
  }
  if (status) items = items.filter((item) => item.status === status);
  if (terminal) items = items.filter((item) => item.terminal === terminal);
  if (airline) items = items.filter((item) => item.airline === airline);

  items = [...items].sort((a, b) => {
    switch (sort) {
      case "name-desc":
        return String(b.name).localeCompare(String(a.name));
      case "departure":
        return String(a.departureTime).localeCompare(String(b.departureTime));
      case "departure-desc":
        return String(b.departureTime).localeCompare(String(a.departureTime));
      case "passengers-desc":
        return (Number(b.passengers) || 0) - (Number(a.passengers) || 0);
      case "name":
      default:
        return String(a.name).localeCompare(String(b.name));
    }
  });

  const total = items.length;
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}


export async function getFlights(params) {
  const { flights, cachedAt } = await fetchAllDocuments();
  return { ...applyListParams(flights, params), cachedAt };
}


export async function getAllFlights() {
  const { flights, cachedAt } = await fetchAllDocuments();
  const sorted = applyListParams(flights, { sort: "departure", limit: flights.length || 1 }).data;
  return { flights: sorted, cachedAt };
}


export async function getFlight(id) {
  if (!/^\d+$/.test(String(id))) {
    throw new NotFoundError(`"${id}" is not a valid flight id`);
  }
  try {
    const { body, cachedAt } = await request(buildUrl(`/${id}`));
    return { flight: documentToFlight(body), cachedAt };
  } catch (err) {
    if (err instanceof NotFoundError) throw new NotFoundError(`Flight #${id} was not found`);
    throw err;
  }
}

// ---------- writing (signed-in users only) ----------


function withoutId(values) {
  const rest = { ...values };
  delete rest.id;
  return rest;
}


export async function createFlight(values) {
  const { flights } = await fetchAllDocuments();
  const nextId = flights.reduce((max, flight) => Math.max(max, flight.id), 0) + 1;

  const { body: document } = await request(buildUrl(`/${nextId}`, { "currentDocument.exists": "false" }), {
    method: "PATCH",
    body: { fields: toFirestoreFields(withoutId(values)) },
    withToken: true,
  });
  return { flight: documentToFlight(document), warning: "" };
}


export async function updateFlight(id, changes) {
  const fields = withoutId(changes);
  const { body: document } = await request(
    buildUrl(`/${id}`, { "updateMask.fieldPaths": Object.keys(fields), "currentDocument.exists": "true" }),
    { method: "PATCH", body: { fields: toFirestoreFields(fields) }, withToken: true },
  );
  return documentToFlight(document);
}

export async function deleteFlight(id) {
  await request(buildUrl(`/${id}`, { "currentDocument.exists": "true" }), {
    method: "DELETE",
    withToken: true,
  });
  return { success: true, id: Number(id) };
}