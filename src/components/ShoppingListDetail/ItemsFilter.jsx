function ItemsFilter({ showDone, onShowDoneChange }) {
  return (
    <div
      style={{
        marginBottom: 10,
        display: "flex",
        alignItems: "center",
      }}
    >
      <label>
        <input
          type="checkbox"
          checked={showDone}
          onChange={(e) => onShowDoneChange(e.target.checked)}
        />{" "}
        Zobrazit i vyřešené
      </label>
    </div>
  );
}

export default ItemsFilter;
