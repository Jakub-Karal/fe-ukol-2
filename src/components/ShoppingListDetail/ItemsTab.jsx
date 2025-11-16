import ItemsFilter from "./ItemsFilter";
import ItemsList from "./ItemsList";

function ItemsTab({
  items,
  allItems,
  showDone,
  onShowDoneChange,
  searchTerm,
  onSearchTermChange,
  newItem,
  onNewItemChange,
  onAddItem,
  onToggleDone,
  onRemoveItem,
}) {
  return (
    <div>
      <ItemsFilter
        showDone={showDone}
        onShowDoneChange={onShowDoneChange}
        searchTerm={searchTerm}
        onSearchTermChange={onSearchTermChange}
      />

      <ItemsList
        items={items}
        onToggleDone={onToggleDone}
        onRemoveItem={onRemoveItem}
      />

      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="Nová položka"
          value={newItem}
          onChange={(e) => onNewItemChange(e.target.value)}
        />
        <button onClick={onAddItem}>Přidat</button>
      </div>

      <p style={{ marginTop: 10, fontSize: "0.9em", color: "#555" }}>
        Celkem položek: {allItems.length}
      </p>
    </div>
  );
}

export default ItemsTab;
