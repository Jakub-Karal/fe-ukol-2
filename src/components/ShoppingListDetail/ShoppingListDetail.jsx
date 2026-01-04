import { useEffect, useState, useCallback } from "react";
import Tabs from "./Tabs";
import ItemsTab from "./ItemsTab";
import MembersTab from "./MembersTab";
import SettingsTab from "./SettingsTab";
import {
  getListDetail,
  createItem,
  updateItem,
  deleteItem,
  addMember,
  removeMember,
  updateList,
} from "../../api/shoppingApi";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

function ShoppingListDetail({ initialData, currentUser, onBack }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [list, setList] = useState(null);

  const [status, setStatus] = useState("pending"); // pending | ready | error
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("items");
  const [showDone, setShowDone] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [newMemberName, setNewMemberName] = useState("");

  const [actionError, setActionError] = useState(null);

  const isOwner = list ? currentUser.id === list.owner.id : false;

  // ================================
  // Načtení detailu (API)
  // ================================
  const loadDetail = useCallback(async () => {
    setStatus("pending");
    setError(null);

    try {
      const data = await getListDetail(initialData.id);
      setList(data);
      setStatus("ready");
    } catch (e) {
      setError(e?.message ?? t("common.error"));
      setStatus("error");
    }
  }, [initialData.id, t]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  // ================================
  // Helper pro akce (mutace) s try/catch
  // ================================
  const runAction = async (fn) => {
    setActionError(null);
    try {
      await fn();
    } catch (e) {
      setActionError(e?.message ?? t("common.error"));
    }
  };

  // ================================
  // ITEMS – API
  // ================================
  const handleAddItem = async () => {
    const name = newItem.trim();
    if (!name || !list) return;

    await runAction(async () => {
      await createItem(list.id, { name });
      setNewItem("");
      await loadDetail();
    });
  };

  const handleToggleDone = async (itemId) => {
    if (!list) return;

    const item = list.items.find((i) => i.id === itemId);
    if (!item) return;

    await runAction(async () => {
      await updateItem(list.id, itemId, { done: !item.done });
      await loadDetail();
    });
  };

  const handleRemoveItem = async (itemId) => {
    if (!list) return;

    await runAction(async () => {
      await deleteItem(list.id, itemId);
      await loadDetail();
    });
  };

  const filteredItems = list
    ? list.items.filter((i) => (showDone ? true : !i.done))
    : [];

  // ================================
  // MEMBERS – API
  // ================================
  const handleAddMember = async (nameFromSettings) => {
    if (!isOwner || !list) return;

    const name = (nameFromSettings ?? newMemberName).trim();
    if (!name) return;

    await runAction(async () => {
      await addMember(list.id, { name });
      setNewMemberName("");
      await loadDetail();
    });
  };

  const handleRemoveMember = async (memberId) => {
    if (!isOwner || !list) return;

    await runAction(async () => {
      await removeMember(list.id, memberId);
      await loadDetail();
    });
  };

  const handleLeaveList = async () => {
    if (!list) return;

    await runAction(async () => {
      await removeMember(list.id, currentUser.id);
      onBack();
    });
  };

  const handleTransferOwnership = async (memberId) => {
    if (!isOwner || !list) return;

    const target = list.members.find((m) => m.id === memberId);
    if (!target) return;

    const updatedMembers = list.members.filter((m) => m.id !== memberId);

    await runAction(async () => {
      await updateList(list.id, {
        owner: target,
        members: [...updatedMembers, list.owner],
      });
      await loadDetail();
    });
  };

  // ================================
  // NÁZEV SEZNAMU – API
  // ================================
  const handleRenameList = async (newName) => {
    if (!isOwner || !list) return;

    const name = newName.trim();
    if (!name) return;

    await runAction(async () => {
      await updateList(list.id, { name });
      await loadDetail();
    });
  };

  // ================================
  // Render – pending / error / ready
  // ================================
  if (status === "pending") {
    return <div style={{ padding: 16 }}>{t("detail.loadingDetail")}</div>;
  }

  if (status === "error") {
    return (
      <div style={{ padding: 16 }}>
        <button onClick={onBack}>← {t("common.back")}</button>
        <div style={{ marginTop: 12 }}>{t("common.error")}: {error}</div>
        <button onClick={loadDetail} style={{ marginTop: 8 }}>
          {t("common.tryAgain")}
        </button>
      </div>
    );
  }

  if (!list) return null;

  return (
    <div>
      <header style={{ marginBottom: 20 }}>
        <button
          style={{ border: "none", background: "none", cursor: "pointer" }}
          onClick={onBack}
        >
          ← {t("common.back")}
        </button>

        <div style={{ marginTop: 12 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: "normal",
              color: theme.textMuted,
              marginBottom: 4,
            }}
          >
            {t("detail.shoppingList")}
          </div>
          <h1 style={{ margin: 0, color: theme.text }}>{list.name}</h1>
        </div>
      </header>

      {actionError && (
        <div style={{ marginBottom: 12, color: theme.danger }}>
          {t("detail.actionError", { error: actionError })}
        </div>
      )}

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
