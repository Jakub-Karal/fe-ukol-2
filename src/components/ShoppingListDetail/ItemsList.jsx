import ItemRow from "./ItemRow";

function ItemsList({ items, onToggleDone, onRemoveItem }) {
  if (items.length === 0) {
    return <p>Žádné položky k zobrazení.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {items.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          onToggleDone={onToggleDone}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </ul>
  );
}

export default ItemsList;
