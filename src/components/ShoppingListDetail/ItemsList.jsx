import ItemRow from "./ItemRow";

function ItemsList({ items, onToggleDone, onRemoveItem }) {
  if (items.length === 0) {
    return <p>Žádné položky k zobrazení.</p>;
  }

return (
  <div
    style={{
      borderTop: "1px solid #ddd",
      borderBottom: "1px solid #ddd",
      padding: "8px 0",
      marginTop: 8,
      marginBottom: 8,
      minHeight: 200,            // ← přidá volné místo, i když je málo položek
    }}
  >
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          onToggleDone={onToggleDone}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </ul>
  </div>
);
}

export default ItemsList;
