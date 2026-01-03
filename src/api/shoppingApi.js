// src/api/shoppingApi.js

import * as mockApi from "../mocks/mockShoppingApi";

// ================================
// Přepínač mock / real API podle .env
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

// ================================
// Export jednotného rozhraní
// ================================

export const getLists = api.getLists;
export const getListDetail = api.getListDetail;
export const createList = api.createList;
export const updateList = api.updateList;
export const deleteList = api.deleteList;

export const createItem = api.createItem;
export const updateItem = api.updateItem;
export const deleteItem = api.deleteItem;

export const addMember = api.addMember;
export const removeMember = api.removeMember;
