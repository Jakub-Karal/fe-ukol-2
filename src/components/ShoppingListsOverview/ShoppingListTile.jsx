function ShoppingListTile({ list, isOwner, onOpen, onDelete }) {
  return (
    <div
      onClick={onOpen}
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 12,
        paddingTop: 20,
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        cursor: "pointer",
        position: "relative",
        background: "#fff",
      }}
    >
      <h3 style={{ marginTop: 16, marginBottom: 8 }}>{list.name}</h3>

      <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>
        Vlastník: {list.owner.name}
      </div>

      {list.archived && (
        <div style={{ fontSize: 11, color: "#a00" }}>Archivovaný</div>
      )}

      {/* Smazání – pouze vlastník */}
      {isOwner && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
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
