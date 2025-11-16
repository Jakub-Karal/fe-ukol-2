function ItemsFilter({
  showDone,
  onShowDoneChange,
  searchTerm,
  onSearchTermChange,
}) {
  return (
    <div
      style={{
        marginBottom: 10,
        display: "flex",
        gap: 20,
        alignItems: "center",
      }}
    >
      <label>
        <input
          type="checkbox"
          checked={showDone}
          onChange={(e) => onShowDoneChange(e.target.checked)}
        />{" "}
        Zobrazit včetně vyřešených
      </label>

      <input
        type="text"
        placeholder="Hledat položku"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
    </div>
  );
}

export default ItemsFilter;
