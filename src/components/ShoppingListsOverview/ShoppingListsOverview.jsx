import { useEffect, useMemo, useState } from "react";
import { getLists, createList, deleteList } from "../../api";

import ShoppingListTile from "./ShoppingListTile";
import NewListModal from "./NewListModal";

function ShoppingListsOverview({ currentUser, onOpenList }) {
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

        setError(e?.message ?? "Nastala chyba při načítání seznamů.");
        setStatus("error");
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const visibleLists = useMemo(() => {
    return showArchived ? lists : lists.filter((l) => !l.archived);
  }, [lists, showArchived]);

  const handleDeleteClick = async (list) => {
    const ok = window.confirm(
      `Opravdu chcete smazat nákupní seznam "${list.name}"?`
    );
    if (!ok) return;

    setError(null);
    try {
      await deleteList(list.id);
      setLists((prev) => prev.filter((l) => l.id !== list.id));
      setStatus("ready");
    } catch (e) {
      setError(e?.message ?? "Mazání se nezdařilo.");
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
      setError(e?.message ?? "Vytvoření seznamu se nezdařilo.");
      setStatus("error");
    }
  };

  if (status === "pending") return <p>Načítám…</p>;

  return (
    <div>
      <h1>Přehled nákupních seznamů</h1>

      {status === "error" && <p style={{ color: "crimson" }}>Chyba: {error}</p>}

      <div
        style={{
          display: "flex",
          alignItems: "center",
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
          Zobrazit včetně archivovaných
        </label>

        <button onClick={() => setIsModalOpen(true)}>+ Nový seznam</button>
      </div>

      {visibleLists.length === 0 ? (
        <p>Žádné nákupní seznamy k zobrazení.</p>
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
