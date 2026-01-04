import { useEffect, useMemo, useState } from "react";
import { getLists, createList, deleteList } from "../../api";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

import ShoppingListTile from "./ShoppingListTile";
import NewListModal from "./NewListModal";

function ShoppingListsOverview({ currentUser, onOpenList }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [status, setStatus] = useState("pending"); // "pending" | "ready" | "error"
  const [error, setError] = useState(null); // string | null
  const [lists, setLists] = useState([]); // array

  const [showArchived, setShowArchived] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      setStatus("pending");
      setError(null);

      try {
        const data = await getLists();
        if (!alive) return;

        setLists(Array.isArray(data) ? data : []);
        setStatus("ready");
      } catch (e) {
        if (!alive) return;

        setError(e?.message ?? t("overview.error"));
        setStatus("error");
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [t]);

  const visibleLists = useMemo(() => {
    return showArchived ? lists : lists.filter((l) => !l.archived);
  }, [lists, showArchived]);

  // Vypočítat celkové statistiky položek - podle stavu showArchived
  const totalStats = useMemo(() => {
    const relevantLists = showArchived ? lists : lists.filter((l) => !l.archived);
    let totalItems = 0;
    let completedItems = 0;

    relevantLists.forEach((list) => {
      const items = list.items || [];
      totalItems += items.length;
      completedItems += items.filter((i) => i.done).length;
    });

    const pendingItems = totalItems - completedItems;
    const completedPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    const pendingPercentage = totalItems > 0 ? (pendingItems / totalItems) * 100 : 0;

    return {
      totalItems,
      completedItems,
      pendingItems,
      completedPercentage,
      pendingPercentage,
    };
  }, [lists, showArchived]);

  const handleDeleteClick = async (list) => {
    const ok = window.confirm(
      t("overview.deleteConfirm", { name: list.name })
    );
    if (!ok) return;

    setError(null);
    try {
      await deleteList(list.id);
      setLists((prev) => prev.filter((l) => l.id !== list.id));
      setStatus("ready");
    } catch (e) {
      setError(e?.message ?? t("overview.error"));
      setStatus("error");
    }
  };

  const handleCreateList = async (name) => {
    setError(null);
    try {
      const created = await createList({ name });
      setLists((prev) => [created, ...prev]);
      setIsModalOpen(false);
      setStatus("ready");
    } catch (e) {
      setError(e?.message ?? t("overview.error"));
      setStatus("error");
    }
  };

  if (status === "pending") return <p>{t("common.loading")}</p>;

  return (
    <div>
      <h1 style={{ color: theme.text }}>{t("overview.title")}</h1>

      {status === "error" && <p style={{ color: theme.danger }}>{t("common.error")}: {error}</p>}

      {/* Horizontální progress bar pro celkové statistiky */}
      {totalStats.totalItems > 0 && (
        <div
          style={{
            marginTop: 20,
            marginBottom: 30,
            maxWidth: 600,
            margin: "20px auto 30px auto",
          }}
        >
          <h3
            style={{
              marginBottom: 12,
              color: theme.text,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Souhrn položek ze všech seznamů
          </h3>

          <div
            style={{
              display: "flex",
              width: "100%",
              height: 40,
              borderRadius: 8,
              overflow: "hidden",
              border: `1px solid ${theme.border}`,
            }}
          >
            {/* Zelená část - splněné položky */}
            {totalStats.completedPercentage > 0 && (
              <div
                style={{
                  width: `${totalStats.completedPercentage}%`,
                  backgroundColor: theme.success,
                  transition: "width 0.3s ease",
                }}
              />
            )}

            {/* Oranžová část - nevyřešené položky */}
            {totalStats.pendingPercentage > 0 && (
              <div
                style={{
                  width: `${totalStats.pendingPercentage}%`,
                  backgroundColor: theme.warning,
                  transition: "width 0.3s ease",
                }}
              />
            )}
          </div>

          {/* Legenda pod progress barem */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 24,
              marginTop: 12,
              fontSize: 13,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: theme.success,
                  borderRadius: 3,
                }}
              />
              <span style={{ color: theme.text }}>
                {t("charts.completed")}: {totalStats.completedItems}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: theme.warning,
                  borderRadius: 3,
                }}
              />
              <span style={{ color: theme.text }}>
                {t("charts.pending")}: {totalStats.pendingItems}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: theme.text, fontWeight: "bold" }}>
                Celkem: {totalStats.totalItems}
              </span>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />{" "}
          {t("overview.showArchived")}
        </label>

        <button onClick={() => setIsModalOpen(true)}>{t("overview.newList")}</button>
      </div>

      {visibleLists.length === 0 ? (
        <p>{t("overview.noLists")}</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 12,
          }}
        >
          {visibleLists.map((list) => (
            <ShoppingListTile
              key={list.id}
              list={list}
              isOwner={list.owner?.id === currentUser?.id}
              onOpen={() => onOpenList(list.id)}
              onDelete={() => handleDeleteClick(list)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <NewListModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateList}
        />
      )}
    </div>
  );
}

export default ShoppingListsOverview;
