// src/mocks/mockShoppingApi.js

import { INITIAL_DATA, STORAGE_KEY, makeId } from "./mockData";

// ================================
// Nastavení simulace
// ================================

// umělá latence (ms)
const MIN_DELAY = 200;
const MAX_DELAY = 600;

// šance na chybu (0 až 1). Dej 0, pokud nechceš náhodné chyby.
const ERROR_RATE = 0.0;

// ================================
// Utility: delay + (volitelně) chyba
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
// Mock "DB" v localStorage
// ================================

function readDb() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(INITIAL_DATA);

  try {
    return JSON.parse(raw);
  } catch {
    // když je localStorage rozbitý, obnov default
    return structuredClone(INITIAL_DATA);
  }
}

function writeDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

// helper: najdi list podle id
function findList(db, listId) {
  const list = db.lists.find((l) => l.id === listId);
  if (!list) throw new Error(`List "${listId}" not found`);
  return list;
}

// ================================
// API funkce (stejné názvy jako kontrakt)
// ================================

// Přehled seznamů (bez těžkých dat, pokud chceš; tady vracíme basic info)
export async function getLists() {
  await simulateNetwork();

  const db = readDb();

  // Vrátíme jen souhrn (id, name, archived) – detail se načte přes getListDetail
  return db.lists.map(({ id, name, archived }) => ({ id, name, archived }));
}

// Detail jednoho seznamu (položky + členové)
export async function getListDetail(listId) {
  await simulateNetwork();

  const db = readDb();
  const list = findList(db, listId);

  // kopie, aby UI nemohlo omylem mutovat "db"
  return structuredClone(list);
}

// Vytvoření seznamu
export async function createList(payload) {
  await simulateNetwork();

  const db = readDb();

  const name = (payload?.name ?? "").trim();
  if (!name) throw new Error("List name is required");

  const newList = {
    id: makeId("list"),
    name,
    archived: false,
    members: payload?.members ?? [],
    items: payload?.items ?? [],
  };

  db.lists.unshift(newList);
  writeDb(db);

  return structuredClone(newList);
}

// Úprava seznamu (např. name, archived)
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

  // pokud chceš umožnit update celých polí
  if (payload?.members !== undefined) list.members = payload.members;
  if (payload?.items !== undefined) list.items = payload.items;

  writeDb(db);
  return structuredClone(list);
}

// Smazání seznamu
export async function deleteList(listId) {
  await simulateNetwork();

  const db = readDb();
  const before = db.lists.length;
  db.lists = db.lists.filter((l) => l.id !== listId);

  if (db.lists.length === before) {
    throw new Error(`List "${listId}" not found`);
  }

  writeDb(db);
  return { ok: true };
}

// ================================
// VOLITELNÉ: Item CRUD (pokud to UI má)
// ================================

export async function createItem(listId, payload) {
  await simulateNetwork();

  const db = readDb();
  const list = findList(db, listId);

  const name = (payload?.name ?? "").trim();
  if (!name) throw new Error("Item name is required");

  const newItem = {
    id: makeId("item"),
    name,
    amount: payload?.amount ?? "",
    done: Boolean(payload?.done),
  };

  list.items.unshift(newItem);
  writeDb(db);

  return structuredClone(newItem);
}

export async function updateItem(listId, itemId, payload) {
  await simulateNetwork();

  const db = readDb();
  const list = findList(db, listId);

  const item = list.items.find((i) => i.id === itemId);
  if (!item) throw new Error(`Item "${itemId}" not found`);

  if (payload?.name !== undefined) {
    const name = String(payload.name).trim();
    if (!name) throw new Error("Item name cannot be empty");
    item.name = name;
  }

  if (payload?.amount !== undefined) item.amount = payload.amount;
  if (payload?.done !== undefined) item.done = Boolean(payload.done);

  writeDb(db);
  return structuredClone(item);
}

export async function deleteItem(listId, itemId) {
  await simulateNetwork();

  const db = readDb();
  const list = findList(db, listId);

  const before = list.items.length;
  list.items = list.items.filter((i) => i.id !== itemId);

  if (list.items.length === before) {
    throw new Error(`Item "${itemId}" not found`);
  }

  writeDb(db);
  return { ok: true };
}

// ================================
// VOLITELNÉ: Members (pokud to UI má)
// ================================

export async function addMember(listId, payload) {
  await simulateNetwork();

  const db = readDb();
  const list = findList(db, listId);

  const name = (payload?.name ?? "").trim();
  if (!name) throw new Error("Member name is required");

  const newMember = { id: makeId("user"), name };
  list.members.push(newMember);

  writeDb(db);
  return structuredClone(newMember);
}

export async function removeMember(listId, memberId) {
  await simulateNetwork();

  const db = readDb();
  const list = findList(db, listId);

  const before = list.members.length;
  list.members = list.members.filter((m) => m.id !== memberId);

  if (list.members.length === before) {
    throw new Error(`Member "${memberId}" not found`);
  }

  writeDb(db);
  return { ok: true };
}
