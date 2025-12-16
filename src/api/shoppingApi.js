// src/api/shoppingApi.js

import * as mockApi from "../mocks/mockShoppingApi";

// ================================
// Přepínač mock / real API podle .env
// true  = mock API (odevzdání)
// false = real API (zatím není)
// ================================

const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === "true";

function notImplemented(fnName) {
  return async () => {
    throw new Error(`${fnName}: Real API není implementováno (USE_MOCK_API=false).`);
  };
}

const realApi = {
  getLists: notImplemented("getLists"),
  getListDetail: notImplemented("getListDetail"),
  createList: notImplemented("createList"),
  updateList: notImplemented("updateList"),
  deleteList: notImplemented("deleteList"),
  createItem: notImplemented("createItem"),
  updateItem: notImplemented("updateItem"),
  deleteItem: notImplemented("deleteItem"),
  addMember: notImplemented("addMember"),
  removeMember: notImplemented("removeMember"),
};

const api = USE_MOCK_API ? mockApi : realApi;

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
