// src/mocks/mockData.js

// ================================
// Počáteční mock data aplikace
// Struktura odpovídá současnému UI:
// list: { id, name, owner, members, items, archived }
// ================================

export const INITIAL_DATA = {
  lists: [
    {
      id: 1,
      name: "Nákup na víkend",
      owner: { id: 1, name: "Alena" },
      members: [
        { id: 1, name: "Alena" },
        { id: 2, name: "Pepa" },
      ],
      items: [
        { id: 1, name: "mléko", done: false },
        { id: 2, name: "chléb", done: true },
      ],
      archived: false,
    },
    {
      id: 2,
      name: "Drogerie",
      owner: { id: 1, name: "Alena" },
      members: [
        { id: 1, name: "Alena" },
        { id: 3, name: "Lenka" },
      ],
      items: [
        { id: 3, name: "šampon", done: false },
        { id: 4, name: "mýdlo", done: false },
      ],
      archived: true,
    },
  ],
};

// ================================
// Klíč pro uložení mock DB
// ================================

export const STORAGE_KEY = "shopping-app-mock-db";

// ================================
// Helper pro generování číselných ID
// ================================
// Vrací další volné číslo pro dané pole objektů
// ================================

export function nextNumericId(items) {
  const maxId = items.reduce((max, x) => (x.id > max ? x.id : max), 0);
  return maxId + 1;
}
