export function filterFlights(flights, { search = "", status = "", terminal = "", airline = "" }) {
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
  return items;
}

export function sortFlights(flights, sort = "departure") {
  return [...flights].sort((a, b) => {
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
}


export function paginate(items, page = 1, limit = 8) {
  const total = items.length;
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    total,
    totalPages: Math.ceil(total / limit),
  };
}