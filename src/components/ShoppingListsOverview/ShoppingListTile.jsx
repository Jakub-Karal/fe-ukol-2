import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

function ShoppingListTile({ list, isOwner, onOpen, onDelete }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Vypočítat progress
  const totalItems = list.items?.length || 0;
  const completedItems = list.items?.filter((i) => i.done).length || 0;
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

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

      <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 8 }}>
        {t("overview.owner")}: {list.owner.name}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 8 }}>
        <div
          style={{
            width: "100%",
            height: 8,
            backgroundColor: theme.borderLight,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${completionPercentage}%`,
              height: "100%",
              backgroundColor: theme.success,
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <div
          style={{
            fontSize: 11,
            color: theme.textMuted,
            marginTop: 4,
            textAlign: "center",
          }}
        >
          {completedItems} / {totalItems}
        </div>
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
