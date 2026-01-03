import { useTranslation } from "react-i18next";

function ItemsFilter({ showDone, onShowDoneChange }) {
  const { t } = useTranslation();

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
        {t("items.showDone")}
      </label>
    </div>
  );
}

export default ItemsFilter;
