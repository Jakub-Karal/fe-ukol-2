import ItemRow from "./ItemRow";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

function ItemsList({ items, onToggleDone, onRemoveItem }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (items.length === 0) {
    return <p style={{ color: theme.textMuted }}>{t("items.noItems")}</p>;
  }

return (
  <div
    style={{
      borderTop: `1px solid ${theme.border}`,
      borderBottom: `1px solid ${theme.border}`,
      padding: "8px 0",
      marginTop: 8,
      marginBottom: 8,
      minHeight: 200,
    }}
  >
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          onToggleDone={onToggleDone}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </ul>
  </div>
);
}

export default ItemsList;
