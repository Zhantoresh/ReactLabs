// Seed data for the fake API (this file is data, not API logic).
// name        -> flight number (the API searches/sorts by name + description)
// description -> short route summary shown in the list
// the other fields are the "extended details" shown for the selected item
export const initialDataSample = [
  { id: 1, name: "KC 801", description: "Astana → Almaty", airline: "Air Astana", destination: "Almaty", gate: "A3", terminal: "T1", departureTime: "2026-10-22T08:15", aircraft: "Airbus A321", passengers: 168, status: "scheduled" },
  { id: 2, name: "SU 1883", description: "Moscow → Astana", airline: "Aeroflot", destination: "Astana", gate: "B7", terminal: "T2", departureTime: "2026-10-22T09:40", aircraft: "Boeing 737-800", passengers: 142, status: "boarding" },
  { id: 3, name: "TK 351", description: "Istanbul → Almaty", airline: "Turkish Airlines", destination: "Almaty", gate: "C2", terminal: "T2", departureTime: "2026-10-22T11:05", aircraft: "Airbus A330", passengers: 255, status: "scheduled" },
  { id: 4, name: "DV 702", description: "Almaty → Shymkent", airline: "SCAT", destination: "Shymkent", gate: "A1", terminal: "T1", departureTime: "2026-10-22T12:30", aircraft: "Boeing 737-700", passengers: 96, status: "delayed" },
  { id: 5, name: "QR 340", description: "Doha → Almaty", airline: "Qatar Airways", destination: "Almaty", gate: "D4", terminal: "T3", departureTime: "2026-10-22T14:50", aircraft: "Boeing 787-8", passengers: 231, status: "scheduled" },
  { id: 6, name: "KC 925", description: "Almaty → Aktau", airline: "Air Astana", destination: "Aktau", gate: "A5", terminal: "T1", departureTime: "2026-10-22T16:20", aircraft: "Embraer E190", passengers: 88, status: "departed" },
];