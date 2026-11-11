
import { getItemsList, getItem, createItem, updateItem, deleteItem } from "../api/fakeApi.js";

export const PAGE_SIZE = 8;


export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}


export function buildFlightsQuery(params) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }
  return query.toString();
}


export function getFlights(query) {
  return getItemsList(query);
}


export async function getAllFlights() {
  const result = await getItemsList("limit=1000&sort=departure");
  return result.data;
}

export async function getFlight(id) {
  if (!/^\d+$/.test(String(id))) {
    throw new NotFoundError(`"${id}" is not a valid flight id`);
  }
  try {
    return await getItem(id);
  } catch (err) {
    if (err.message === "Item not found") {
      throw new NotFoundError(`Flight #${id} was not found`);
    }
    throw err;
  }
}


export async function createFlight(values) {
  const { name, description, ...extra } = values;
  const created = await createItem({ name, description });
  try {
    const flight = await updateItem(created.id, extra);
    return { flight, warning: "" };
  } catch (err) {
    return {
      flight: created,
      warning: `Flight was created, but extra fields were not saved (${err.message}). Press Edit to retry.`,
    };
  }
}

export function updateFlight(id, changes) {
  return updateItem(id, changes);
}

export function deleteFlight(id) {
  return deleteItem(id);
}


export async function getAdjacentFlights(id) {
  const flights = await getAllFlights(); // already sorted by departure time
  const index = flights.findIndex((flight) => flight.id === Number(id));
  if (index === -1) return { prev: null, next: null };
  return {
    prev: flights[index - 1] ?? null,
    next: flights[index + 1] ?? null,
  };
}

// ---------- Staff authentication (fake, for the demo) ----------


const SESSION_KEY = "departures-board-week07-session";

export const DEMO_ACCOUNT = { email: "dispatcher@ala.kz", password: "ala2026" };

export async function login(email, password) {
  // simulate a network request
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (email.trim().toLowerCase() !== DEMO_ACCOUNT.email || password !== DEMO_ACCOUNT.password) {
    throw new Error("Wrong email or password");
  }

  const user = { email: DEMO_ACCOUNT.email, name: "ALA Dispatcher" };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}


export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) ?? null;
  } catch {
    return null;
  }
}