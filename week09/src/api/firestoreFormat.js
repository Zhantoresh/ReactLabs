// Firestore REST API stores every field with its type:
//   { name: "KC 979", passengers: 195 }
//   <-> { name: { stringValue: "KC 979" }, passengers: { integerValue: "195" } }

function toValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  return { stringValue: String(value) };
}

function fromValue(value) {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("booleanValue" in value) return value.booleanValue;
  if ("timestampValue" in value) return value.timestampValue;
  return null;
}

// { name: "KC 979" } -> { name: { stringValue: "KC 979" } }
export function toFirestoreFields(object) {
  const fields = {};
  for (const [key, value] of Object.entries(object)) {
    fields[key] = toValue(value);
  }
  return fields;
}


export function documentToFlight(document) {
  const flight = { id: Number(document.name.split("/").pop()) };
  for (const [key, value] of Object.entries(document.fields ?? {})) {
    flight[key] = fromValue(value);
  }
  return flight;
}