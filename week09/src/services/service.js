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


export function getFlights(params) {
  return getItemsList(buildFlightsQuery(params));
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