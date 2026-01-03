import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

function ShoppingListTile({ list, isOwner, onOpen, onDelete }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <div
      onClick={onOpen}
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        padding: 12,
        paddingTop: 20,
        boxShadow: `0 2px 4px ${theme.shadow}`,
        cursor: "pointer",
        position: "relative",
        background: theme.background,
      }}
    >
      <h3 style={{ marginTop: 16, marginBottom: 8, color: theme.text }}>{list.name}</h3>

      <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 4 }}>
        {t("overview.owner")}: {list.owner.name}
      </div>

      {list.archived && (
        <div style={{ fontSize: 11, color: theme.danger }}>{t("overview.archived")}</div>
      )}

      {/* Smazání – pouze vlastník */}
      {isOwner && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            fontSize: 11,
          }}
        >
          {t("common.delete")}
        </button>
      )}
    </div>
  );
}

export default ShoppingListTile;
