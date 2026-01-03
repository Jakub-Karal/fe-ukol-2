import ItemsFilter from "./ItemsFilter";
import ItemsList from "./ItemsList";
import ItemsChart from "./ItemsChart";
import { useTranslation } from "react-i18next";

function ItemsTab({
  items,
  allItems,
  showDone,
  onShowDoneChange,
  newItem,
  onNewItemChange,
  onAddItem,
  onToggleDone,
  onRemoveItem,
}) {
  const { t } = useTranslation();

  return (
    <div>
      <ItemsFilter showDone={showDone} onShowDoneChange={onShowDoneChange} />

      <ItemsChart items={allItems} />

      <ItemsList
        items={items}
        onToggleDone={onToggleDone}
        onRemoveItem={onRemoveItem}
      />

      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder={t("items.newItem")}
          value={newItem}
          onChange={(e) => onNewItemChange(e.target.value)}
        />
        <button onClick={onAddItem}>{t("common.add")}</button>
      </div>
    </div>
  );
}

export default ItemsTab;
