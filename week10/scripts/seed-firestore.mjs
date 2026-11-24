// One-time upload of the 40 seed flights to the Firestore collection "flights".
// Firestore rules allow writes only for signed-in users, so the script logs in first with an email/password account from your Firebase project.

import { readFileSync } from "node:fs";
import { initialDataSample } from "../src/api/initial-data-sample.js";
import { toFirestoreFields } from "../src/api/firestoreFormat.js";


function readEnv(file) {
  const env = {};
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = readEnv(new URL("../.env.local", import.meta.url));
const apiKey = env.VITE_FIREBASE_API_KEY;
const projectId = env.VITE_FIREBASE_PROJECT_ID;
const email = process.env.SEED_EMAIL;
const password = process.env.SEED_PASSWORD;

if (!apiKey || !projectId) {
  console.error("VITE_FIREBASE_API_KEY or VITE_FIREBASE_PROJECT_ID is missing in .env.local");
  process.exit(1);
}
if (!email || !password) {
  console.error("Usage: SEED_EMAIL=you@example.com SEED_PASSWORD=secret node scripts/seed-firestore.mjs");
  process.exit(1);
}

async function request(url, options) {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${response.status} ${body.error?.message ?? response.statusText}`);
  }
  return body;
}

const { idToken } = await request(
  `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  },
);
console.log(`Signed in as ${email}`);


const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

for (const { id, ...flight } of initialDataSample) {
  await request(`${base}/flights/${id}?key=${apiKey}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ fields: toFirestoreFields(flight) }),
  });
  console.log(`  ✓ flights/${id}  ${flight.name}  ${flight.departureTime}`);
}

console.log(`Done: ${initialDataSample.length} flights uploaded to project "${projectId}".`);