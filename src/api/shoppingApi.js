// src/api/shoppingApi.js

// ================================
// Import implementací
// ================================

import * as mockApi from "../mocks/mockShoppingApi";

// ================================
// Přepínač mock / real API podle .env
// ================================

const USE_MOCK_API =
  process.env.REACT_APP_USE_MOCK_API === "true";

// import * as realApi from "./realShoppingApi"; // připraveno do budoucna

// ================================
// Výběr aktivní implementace
// ================================

const api = USE_MOCK_API
  ? mockApi
  : (() => {
      throw new Error("Real API není implementováno");
    })();

// ================================
// Export jednotného rozhraní
// ================================

export const {
  getLists,
  getListDetail,
  createList,
  updateList,
  deleteList,
  createItem,
  updateItem,
  deleteItem,
  addMember,
  removeMember,
} = api;
