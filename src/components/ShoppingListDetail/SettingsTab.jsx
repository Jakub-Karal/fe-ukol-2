function SettingsTab({
  listName,
  editedName,
  onEditedNameChange,
  onSaveName,
  isOwner,
}) {
  return (
    <div>
      <h2>Nastavení</h2>

      <p>
        Aktuální název: <strong>{listName}</strong>
      </p>

      {isOwner ? (
        <div style={{ marginTop: 10 }}>
          <input
            type="text"
            value={editedName}
            onChange={(e) => onEditedNameChange(e.target.value)}
          />
          <button onClick={onSaveName}>Uložit nový název</button>
        </div>
      ) : (
        <p>Tento název může měnit pouze vlastník.</p>
      )}
    </div>
  );
}

export default SettingsTab;
