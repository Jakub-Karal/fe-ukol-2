import { useState } from "react";

function NewListModal({ onClose, onCreate }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName("");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 12,
          minWidth: 280,
        }}
      >
        <h2>Nový nákupní seznam</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <input
              type="text"
              placeholder="Název seznamu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <button type="button" onClick={onClose}>
              Zrušit
            </button>
            <button type="submit">Vytvořit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewListModal;
