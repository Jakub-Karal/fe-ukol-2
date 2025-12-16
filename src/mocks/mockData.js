// src/mocks/mockData.js

// ================================
// Počáteční mock data aplikace
// ================================

export const INITIAL_DATA = {
  lists: [
    {
      id: "list-1",
      name: "Nákup na týden",
      archived: false,
      members: [
        { id: "u-1", name: "Adam" },
        { id: "u-2", name: "Eva" },
      ],
      items: [
        { id: "i-1", name: "Mléko", amount: "2", done: false },
        { id: "i-2", name: "Chléb", amount: "1", done: true },
      ],
    },
    {
      id: "list-2",
      name: "Drogerie",
      archived: false,
      members: [{ id: "u-1", name: "Adam" }],
      items: [
        { id: "i-3", name: "Mýdlo", amount: "1", done: false },
      ],
    },
  ],
};

// ================================
// Klíč pro uložení mock DB
// ================================

export const STORAGE_KEY = "shopping-app-mock-db";

// ================================
// Helper pro generování ID
// ================================
// Použije se při vytváření seznamů,
// položek a členů v mock API
// ================================

export function makeId(prefix = "id") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(16).slice(2)}`;
}
