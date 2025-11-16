import ItemsFilter from "./ItemsFilter";
import ItemsList from "./ItemsList";

function ItemsTab({
  items,
  allItems,
  showDone,
  onShowDoneChange,
  newItem,
  onNewItemChange,
  onAddItem,
  onToggleDone,
  onRemoveItem,
}) {
  return (
    <div>
      <ItemsFilter showDone={showDone} onShowDoneChange={onShowDoneChange} />

      <ItemsList items={items} onToggleDone={onToggleDone} onRemoveItem={onRemoveItem} />

      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="Nová položka"
          value={newItem}
          onChange={(e) => onNewItemChange(e.target.value)}
        />
        <button onClick={onAddItem}>Přidat</button>
      </div>
    </div>
  );
}

export default ItemsTab;
