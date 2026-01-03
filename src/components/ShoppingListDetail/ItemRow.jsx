import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

function ItemRow({ item, onToggleDone, onRemoveItem }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 5,
      }}
    >
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onToggleDone(item.id)}
      />

      <span
        style={{
          flex: 1,
          textDecoration: item.done ? "line-through" : "none",
          color: item.done ? theme.disabled : theme.text,
        }}
      >
        {item.name}
      </span>

      <button onClick={() => onRemoveItem(item.id)}>{t("common.delete")}</button>
    </li>
  );
}

export default ItemRow;
