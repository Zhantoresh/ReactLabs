import { NotFoundError, OfflineError } from "../services/service.js";

export function toRejectValue(err) {
  let kind = "error";
  if (err instanceof OfflineError) kind = "offline";
  else if (err instanceof NotFoundError) kind = "notfound";
  return { message: err?.message ?? "Something went wrong", kind };
}


export async function withRetry(request, retries = 1, delayMs = 800) {
  try {
    return await request();
  } catch (err) {
    if (retries <= 0 || err instanceof OfflineError || err instanceof NotFoundError) throw err;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return withRetry(request, retries - 1, delayMs);
  }
}


export const STALE_AFTER_MS = 60 * 1000;