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
}) {
  const isMember = members.some((m) => m.id === currentUser.id);

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
        <ul>
          {members.map((member) => (
            <li key={member.id}>
              {member.name}{" "}
              {isOwner && (
                <button onClick={() => onRemoveMember(member.id)}>
                  Odebrat
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {isOwner && (
        <div style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="Jméno nového člena"
            value={newMemberName}
            onChange={(e) => onNewMemberNameChange(e.target.value)}
          />
          <button onClick={onAddMember}>Přidat člena</button>
        </div>
      )}

      {!isOwner && isMember && (
        <div style={{ marginTop: 10 }}>
          <button onClick={onLeaveList}>Odejít z tohoto seznamu</button>
        </div>
      )}
    </div>
  );
}

export default MembersTab;
