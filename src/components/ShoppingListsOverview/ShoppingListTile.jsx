function ShoppingListTile({ list, isOwner, onOpen, onDelete }) {
  return (
    <div
      onClick={onOpen}
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 12,
        paddingTop: 20, // trochu větší horní padding kvůli tlačítku
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        cursor: "pointer",
        position: "relative",
        background: "#fff",
      }}
    >
      {/* název posunutý níž, aby nebyl u tlačítka Smazat */}
      <h3 style={{ marginTop: 16, marginBottom: 8 }}>{list.name}</h3>

      <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>
        Vlastník: {list.owner.name}
      </div>

      {list.archived && (
        <div
          style={{
            fontSize: 11,
            color: "#a00",
          }}
        >
          Archivovaný
        </div>
      )}

      {isOwner && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // aby klik na Smazat neotevřel detail
            onDelete();
          }}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            fontSize: 11,
          }}
        >
          Smazat
        </button>
      )}
    </div>
  );
}

export default ShoppingListTile;
