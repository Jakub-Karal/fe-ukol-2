// src/mocks/mockShoppingApi.js

import { INITIAL_DATA, STORAGE_KEY, nextNumericId } from "./mockData";

// ================================
// Nastavení simulace
// ================================

// umělá latence (ms)
const MIN_DELAY = 200;
const MAX_DELAY = 600;

// šance na chybu (0 až 1). Žádné chyby = 0.0
const ERROR_RATE = Number(process.env.REACT_APP_MOCK_API_ERROR_RATE) || 0;

// ================================
// Utility: delay + simulace sítě
// ================================

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateNetwork() {
  const ms = Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
  await delay(ms);

  if (Math.random() < ERROR_RATE) {
    throw new Error("Simulovaná síťová chyba (mock).");
  }
}

// ================================
// Helper: bezpečná kopie objektu
// ================================

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

// ================================
// Mock "DB" v localStorage
// ================================

function readDb() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return clone(INITIAL_DATA);

  try {
    return JSON.parse(raw);
  } catch {
    return clone(INITIAL_DATA);
  }
}

function writeDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function findList(db, listId) {
  const id = Number(listId);
  const list = db.lists.find((l) => l.id === id);
  if (!list) throw new Error(`List "${listId}" not found`);
  return list;
}

// ================================
// API funkce (kontrakt pro UI)
// ================================

export async function getLists() {
  await simulateNetwork();
  const db = readDb();
  return clone(db.lists);
}

export async function getListDetail(listId) {
  await simulateNetwork();
  const db = readDb();
  const list = findList(db, listId);
  return clone(list);
}

export async function createList(payload) {
  await simulateNetwork();

  const db = readDb();
  const name = (payload?.name ?? "").trim();
  if (!name) throw new Error("List name is required");

  const newId = nextNumericId(db.lists);

  const owner = payload?.owner ?? { id: 1, name: "Alena" };
  const members = payload?.members ?? [owner];

  const newList = {
    id: newId,
    name,
    owner,
    members,
    items: payload?.items ?? [],
    archived: false,
  };

  db.lists.unshift(newList);
  writeDb(db);

  return clone(newList);
}

export async function updateList(listId, payload) {
  await simulateNetwork();

  const db = readDb();
  const list = findList(db, listId);

  if (payload?.name !== undefined) {
    const name = String(payload.name).trim();
    if (!name) throw new Error("List name cannot be empty");
    list.name = name;
  }

  if (payload?.archived !== undefined) {
    list.archived = Boolean(payload.archived);
  }

  if (payload?.owner !== undefined) list.owner = payload.owner;
  if (payload?.members !== undefined) list.members = payload.members;
  if (payload?.items !== undefined) list.items = payload.items;

  writeDb(db);
  return clone(list);
}

export async function deleteList(listId) {
  await simulateNetwork();

  const db = readDb();
  const id = Number(listId);

  const before = db.lists.length;
  db.lists = db.lists.filter((l) => l.id !== id);

  if (db.lists.length === before) {
    throw new Error(`List "${listId}" not found`);
  }

  writeDb(db);
  return { ok: true };
}

// ================================
// Item CRUD (pokud UI používá)
// ================================

export async function createItem(listId, payload) {
  await simulateNetwork();

  const db = readDb();
  const list = findList(db, listId);

  const name = (payload?.name ?? "").trim();
  if (!name) throw new Error("Item name is required");

  const newId = nextNumericId(list.items);

  const newItem = {
    id: newId,
    name,
    done: Boolean(payload?.done),
  };

  list.items.unshift(newItem);
  writeDb(db);

  return clone(newItem);
}

export async function updateItem(listId, itemId, payload) {
  await simulateNetwork();

  const db = readDb();
  const list = findList(db, listId);

  const iid = Number(itemId);
  const item = list.items.find((i) => i.id === iid);
  if (!item) throw new Error(`Item "${itemId}" not found`);

  if (payload?.name !== undefined) {
    const name = String(payload.name).trim();
    if (!name) throw new Error("Item name cannot be empty");
    item.name = name;
  }

  if (payload?.done !== undefined) item.done = Boolean(payload.done);

  writeDb(db);
  return clone(item);
}

export async function deleteItem(listId, itemId) {
  await simulateNetwork();

  const db = readDb();
  const list = findList(db, listId);

  const iid = Number(itemId);
  const before = list.items.length;
  list.items = list.items.filter((i) => i.id !== iid);

  if (list.items.length === before) {
    throw new Error(`Item "${itemId}" not found`);
  }

  writeDb(db);
  return { ok: true };
}
