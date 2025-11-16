import { useState } from "react";
import Tabs from "./Tabs";
import ItemsTab from "./ItemsTab";

function ShoppingListDetail({ initialData, currentUser }) {
  const [list, setList] = useState(initialData);
  const [activeTab, setActiveTab] = useState("items");
  const [showDone, setShowDone] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItem, setNewItem] = useState("");

  // položky
  const handleAddItem = () => {
    if (newItem.trim() === "") return;

    const newItemObj = {
      id: Date.now(),
      name: newItem,
      done: false,
    };

    setList({ ...list, items: [...list.items, newItemObj] });
    setNewItem("");
  };

  const handleToggleDone = (id) => {
    const items = list.items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    setList({ ...list, items });
  };

  const handleRemoveItem = (id) => {
    const items = list.items.filter((item) => item.id !== id);
    setList({ ...list, items });
  };

  // filtr
  const filteredItems = list.items
    .filter((item) => (showDone ? true : !item.done))
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      {/* horní lišta podle wireframu */}
      <header
        style={{
          marginBottom: 20,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <button>{"←"} Návrat</button>
        <h1 style={{ margin: 0 }}>Nákupní seznam</h1>
      </header>

      {/* Tabs */}
      <Tabs activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* obsah (zatím jen Items) */}
      {activeTab === "items" && (
        <ItemsTab
          items={filteredItems}
          allItems={list.items}
          showDone={showDone}
          onShowDoneChange={setShowDone}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          newItem={newItem}
          onNewItemChange={setNewItem}
          onAddItem={handleAddItem}
          onToggleDone={handleToggleDone}
          onRemoveItem={handleRemoveItem}
        />
      )}

      {activeTab !== "items" && (
        <p style={{ marginTop: 20 }}>Tento tab doplníme později.</p>
      )}
    </div>
  );
}

export default ShoppingListDetail;
