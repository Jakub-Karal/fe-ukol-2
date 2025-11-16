import { useState } from "react";

function SettingsTab({ list, isOwner, onRenameList, onAddMember, onRemoveMember }) {
  const [newName, setNewName] = useState(list.name);
  const [newMember, setNewMember] = useState("");

  return (
    <div style={{ padding: 10 }}>
      <h3>Nastavení</h3>

      {/* Název seznamu */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, marginBottom: 6 }}>Název seznamu:</div>

        <input
          type="text"
          value={newName}
          disabled={!isOwner}
          onChange={(e) => setNewName(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            fontSize: 16,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />

        {isOwner && (
          <button
            onClick={() => onRenameList(newName)}
            style={{
              marginTop: 10,
              padding: "8px 16px",
              background: "#0066ff",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Uložit nový název
          </button>
        )}
      </div>

      {/* Členové seznamu */}
      <h4>Členové seznamu</h4>

      {list.members.map((member) => (
        <div
          key={member.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "6px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <span>{member.name}</span>

          {isOwner && (
            <button
              onClick={() => onRemoveMember(member.id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Odebrat
            </button>
          )}
        </div>
      ))}

      {/* Přidání člena */}
      {isOwner && (
        <div style={{ marginTop: 15 }}>
          <input
            type="text"
            placeholder="Jméno nového člena"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={() => {
              if (!newMember.trim()) return;
              onAddMember(newMember.trim());
              setNewMember("");
            }}
            style={{
              marginTop: 10,
              padding: "8px 16px",
              background: "#008000",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Přidat člena
          </button>
        </div>
      )}
    </div>
  );
}

export default SettingsTab;
