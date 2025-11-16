function ItemRow({ item, onToggleDone, onRemoveItem }) {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 5,
      }}
    >
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onToggleDone(item.id)}
      />

      <span
        style={{
          flex: 1,
          textDecoration: item.done ? "line-through" : "none",
          color: item.done ? "#888" : "inherit",
        }}
      >
        {item.name}
      </span>

      <button onClick={() => onRemoveItem(item.id)}>Smazat</button>
    </li>
  );
}

export default ItemRow;
