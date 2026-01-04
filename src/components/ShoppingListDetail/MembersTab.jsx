import { useState } from "react";

function MembersTab({
  owner,
  members,
  currentUser,
  isOwner,
  newMemberName,
  onNewMemberNameChange,
  onAddMember,
  onRemoveMember,
  onLeaveList,
  onTransferOwnership,
}) {
  const [selectedMemberId, setSelectedMemberId] = useState(
    members[0]?.id ?? ""
  );

  const isMember = members.some((m) => m.id === currentUser.id);

  const handleTransferClick = () => {
    if (!selectedMemberId) return;
    onTransferOwnership(Number(selectedMemberId));
  };

  return (
    <div>
      <h2>Členové seznamu</h2>

      <p>
        <strong>Vlastník:</strong> {owner.name}
      </p>

      <p>
        <strong>Členové:</strong>
      </p>
      {members.length === 0 ? (
        <p>Žádní členové.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {members.map((member) => (
            <li
              key={member.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              {isOwner && (
                <button onClick={() => onRemoveMember(member.id)}>
                  Odebrat
                </button>
              )}
              <span>• {member.name}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Přidání člena – jen jednoduché zadání jména */}
      {isOwner && (
        <div style={{ marginTop: 16 }}>
          <p style={{ marginBottom: 4 }}>Přidat nového člena:</p>
          <input
            type="text"
            placeholder="Jméno nového člena"
            value={newMemberName}
            onChange={(e) => onNewMemberNameChange(e.target.value)}
          />
          <button onClick={() => onAddMember()}>Přidat člena</button>
        </div>
      )}

      {/* Předání vlastnictví – jen pro vlastníka, pokud má komu předat */}
      {isOwner && members.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ marginBottom: 4 }}>Předat vlastnictví jinému členovi:</p>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
          >
            <option value="">Vyberte člena</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          <button onClick={handleTransferClick} style={{ marginLeft: 8 }}>
            Předat vlastnictví
          </button>
        </div>
      )}

      {/* Tlačítko Odejít – pouze pro běžného člena (není vlastník) */}
      {!isOwner && isMember && (
        <div style={{ marginTop: 20 }}>
          <button onClick={onLeaveList}>Odejít z tohoto seznamu</button>
        </div>
      )}
    </div>
  );
}

export default MembersTab;
