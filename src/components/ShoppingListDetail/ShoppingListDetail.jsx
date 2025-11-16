import { useState } from "react";
import Tabs from "./Tabs";
import ItemsTab from "./ItemsTab";
import MembersTab from "./MembersTab";
import SettingsTab from "./SettingsTab";

function ShoppingListDetail({ initialData, currentUser }) {
  const [list, setList] = useState(initialData);
  const [activeTab, setActiveTab] = useState("items");
  const [showDone, setShowDone] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItem, setNewItem] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [editedName, setEditedName] = useState(list.name);

  const isOwner = currentUser.id === list.owner.id;

  // --- položky ---
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

  const filteredItems = list.items
    .filter((item) => (showDone ? true : !item.done))
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // --- členové ---
  const handleAddMember = () => {
    if (!isOwner) return;
    if (newMemberName.trim() === "") return;

    const newMember = {
      id: Date.now(),
      name: newMemberName,
    };

    setList({ ...list, members: [...list.members, newMember] });
    setNewMemberName("");
  };

  const handleRemoveMember = (memberId) => {
    if (!isOwner) return;
    const members = list.members.filter((m) => m.id !== memberId);
    setList({ ...list, members });
  };

  const handleLeaveList = () => {
    const members = list.members.filter((m) => m.id !== currentUser.id);
    setList({ ...list, members });
  };

  // --- název seznamu (Settings) ---
  const handleSaveName = () => {
    if (!isOwner) return;
    if (editedName.trim() === "") return;
    setList({ ...list, name: editedName });
  };

return (
  <div>

      {/* hlavička podle wireframu */}
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

      <Tabs activeTab={activeTab} onChangeTab={setActiveTab} />

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

      {activeTab === "members" && (
        <MembersTab
          owner={list.owner}
          members={list.members}
          currentUser={currentUser}
          isOwner={isOwner}
          newMemberName={newMemberName}
          onNewMemberNameChange={setNewMemberName}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onLeaveList={handleLeaveList}
        />
      )}

      {activeTab === "settings" && (
        <SettingsTab
          listName={list.name}
          editedName={editedName}
          onEditedNameChange={setEditedName}
          onSaveName={handleSaveName}
          isOwner={isOwner}
        />
      )}
    </div>
  );
}

export default ShoppingListDetail;
