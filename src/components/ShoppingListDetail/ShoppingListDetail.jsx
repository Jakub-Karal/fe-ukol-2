import { useState } from "react";
import Tabs from "./Tabs";
import ItemsTab from "./ItemsTab";
import MembersTab from "./MembersTab";
import SettingsTab from "./SettingsTab";

function ShoppingListDetail({ initialData, currentUser, onBack }) {

  const [list, setList] = useState(initialData);
  const [activeTab, setActiveTab] = useState("items");
  const [showDone, setShowDone] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [newMemberName, setNewMemberName] = useState("");

  const isOwner = currentUser.id === list.owner.id;

  // ---------- POLOŽKY ----------

  const handleAddItem = () => {
    if (newItem.trim() === "") return;

    const newItemObj = {
      id: Date.now(),
      name: newItem.trim(),
      done: false,
    };

    setList({
      ...list,
      items: [...list.items, newItemObj],
    });

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

  const filteredItems = list.items.filter((item) =>
    showDone ? true : !item.done
  );

  // ---------- ČLENOVÉ ----------

  // použití:
  //  - MembersTab: bez argumentu → vezme jméno z newMemberName (stav rodiče)
  //  - SettingsTab: volá s name → použije se ten
  const handleAddMember = (nameFromSettings) => {
    if (!isOwner) return;

    const name = (nameFromSettings ?? newMemberName).trim();
    if (!name) return;

    const newMember = {
      id: Date.now(),
      name,
    };

    setList({
      ...list,
      members: [...list.members, newMember],
    });

    setNewMemberName("");
  };

  const handleRemoveMember = (memberId) => {
    if (!isOwner) return;

    const updatedMembers = list.members.filter((m) => m.id !== memberId);

    setList({
      ...list,
      members: updatedMembers,
    });
  };

  const handleLeaveList = () => {
    const updatedMembers = list.members.filter(
      (m) => m.id !== currentUser.id
    );

    setList({
      ...list,
      members: updatedMembers,
    });
  };

  // předání vlastnictví jinému členovi
  const handleTransferOwnership = (memberId) => {
    if (!isOwner) return;
    if (!memberId) return;

    const target = list.members.find((m) => m.id === memberId);
    if (!target) return;

    // nový seznam členů: všichni kromě nového vlastníka + původní vlastník jako člen
    const remainingMembers = list.members.filter((m) => m.id !== memberId);
    const updatedMembers = [...remainingMembers, list.owner];

    setList({
      ...list,
      owner: target,
      members: updatedMembers,
    });
  };

  // ---------- NÁZEV SEZNAMU ----------

  const handleRenameList = (newName) => {
    if (!isOwner) return;
    const name = newName.trim();
    if (!name) return;

    setList({
      ...list,
      name,
    });
  };

  // ---------- RENDER ----------

  return (
    <div>
      {/* Hlavička – Návrat / nákupní seznam / název */}
      <header style={{ marginBottom: 20 }}>
<button
  style={{
    border: "none",
    background: "none",
    cursor: "pointer",
  }}
  onClick={onBack}
>
  ← Návrat
</button>


        <div style={{ marginTop: 12 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: "normal",
              color: "#555",
              marginBottom: 4,
            }}
          >
            nákupní seznam :
          </div>
          <h1 style={{ margin: 0 }}>{list.name}</h1>
        </div>
      </header>

      <Tabs activeTab={activeTab} onChangeTab={setActiveTab} />

      {activeTab === "items" && (
        <ItemsTab
          items={filteredItems}
          allItems={list.items}
          showDone={showDone}
          onShowDoneChange={setShowDone}
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
          onTransferOwnership={handleTransferOwnership}
        />
      )}

      {activeTab === "settings" && (
        <SettingsTab
          list={list}
          isOwner={isOwner}
          onRenameList={handleRenameList}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
        />
      )}
    </div>
  );
}

export default ShoppingListDetail;
