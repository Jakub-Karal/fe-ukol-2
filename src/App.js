import { useState } from "react";
import "./App.css";
import ShoppingListDetail from "./components/ShoppingListDetail/ShoppingListDetail";
import ShoppingListsOverview from "./components/ShoppingListsOverview/ShoppingListsOverview";

// "přihlášený" uživatel – necháme vlastníkem Alenu, aby byly dobře vidět ownerské funkce
const currentUser = {
  id: 1,
  name: "Alena",
};

// Výchozí seznamy aplikace
const initialShoppingLists = [
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
    archived: true, // aby bylo co filtrovat
  },
];

function App() {
  const [lists, setLists] = useState(initialShoppingLists);
  const [selectedListId, setSelectedListId] = useState(null);

  // otevření detailu seznamu
  const handleOpenList = (id) => {
    setSelectedListId(id);
  };

  // návrat z detailu na přehled
  const handleBackToOverview = () => {
    setSelectedListId(null);
  };

  // vytvoření nového seznamu (z modálního okna)
  const handleCreateList = (name) => {
    const newList = {
      id: Date.now(),
      name,
      owner: { ...currentUser },
      members: [{ ...currentUser }], // vlastník je zároveň první člen
      items: [],
      archived: false,
    };

    setLists((prev) => [...prev, newList]);
  };

  // smazání seznamu
  const handleDeleteList = (id) => {
    setLists((prev) => prev.filter((list) => list.id !== id));
  };

  // případné přepínání archivace (zatím nevyužíváme, ale může se hodit)
  const handleToggleArchive = (id) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === id ? { ...list, archived: !list.archived } : list
      )
    );
  };

  const selectedList = lists.find((list) => list.id === selectedListId) || null;

  return (
    <div className="app-root">
      <div className="phone">
        {selectedList ? (
          <ShoppingListDetail
            initialData={selectedList}
            currentUser={currentUser}
            onBack={handleBackToOverview}
          />
        ) : (
          <ShoppingListsOverview
            lists={lists}
            currentUser={currentUser}
            onOpenList={handleOpenList}
            onCreateList={handleCreateList}
            onDeleteList={handleDeleteList}
            onToggleArchive={handleToggleArchive}
          />
        )}
      </div>
    </div>
  );
}

export default App;

