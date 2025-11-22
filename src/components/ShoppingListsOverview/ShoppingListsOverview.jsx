import { useState } from "react";
import ShoppingListTitle from "./ShoppingListTitle";
import NewListModal from "./NewListModal";

function ShoppingListsOverview({
  lists,
  currentUser,
  onOpenList,
  onCreateList,
  onDeleteList,
  onToggleArchive,
}) {
  const [showArchived, setShowArchived] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const visibleLists = showArchived
    ? lists
    : lists.filter((list) => !list.archived);

  const handleDeleteClick = (list) => {
    // potvrzení mazání
    const ok = window.confirm(
      `Opravdu chcete smazat nákupní seznam "${list.name}"?`
    );
    if (!ok) return;

    onDeleteList(list.id);
  };

  const handleCreateList = (name) => {
    onCreateList(name);
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Přehled nákupních seznamů</h1>

      {/* Filtr archivovaných */}
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

      {/* Dlaždice */}
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
            <ShoppingListTitle
              key={list.id}
              list={list}
              isOwner={list.owner.id === currentUser.id}
              onOpen={() => onOpenList(list.id)}
              onDelete={() => handleDeleteClick(list)}
            />
          ))}
        </div>
      )}

      {/* Modální okno pro vytvoření nového seznamu */}
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
