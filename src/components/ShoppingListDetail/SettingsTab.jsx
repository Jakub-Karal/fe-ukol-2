import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

function SettingsTab({ list, isOwner, onRenameList, onAddMember, onRemoveMember }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [newName, setNewName] = useState(list.name);
  const [newMember, setNewMember] = useState("");

  return (
    <div style={{ padding: 10 }}>
      <h3 style={{ color: theme.text }}>{t("settings.title")}</h3>

      {/* Název seznamu */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, marginBottom: 6, color: theme.text }}>{t("settings.listName")}:</div>

        <input
          type="text"
          value={newName}
          disabled={!isOwner}
          onChange={(e) => setNewName(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            fontSize: 16,
            border: `1px solid ${theme.borderMedium}`,
            borderRadius: 6,
            background: theme.background,
            color: theme.text,
          }}
        />

        {isOwner && (
          <button
            onClick={() => onRenameList(newName)}
            style={{
              marginTop: 10,
              padding: "8px 16px",
              background: theme.primary,
              color: theme.background,
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {t("settings.saveNewName")}
          </button>
        )}
      </div>

      {/* Členové seznamu */}
      <h4 style={{ color: theme.text }}>{t("settings.membersTitle")}</h4>

      {list.members.map((member) => (
        <div
          key={member.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "6px 0",
            borderBottom: `1px solid ${theme.borderLight}`,
          }}
        >
          <span style={{ color: theme.text }}>{member.name}</span>

          {isOwner && (
            <button
              onClick={() => onRemoveMember(member.id)}
              style={{
                background: theme.danger,
                color: theme.background,
                border: "none",
                borderRadius: 6,
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              {t("members.remove")}
            </button>
          )}
        </div>
      ))}

      {/* Přidání člena */}
      {isOwner && (
        <div style={{ marginTop: 15 }}>
          <input
            type="text"
            placeholder={t("settings.addMemberPlaceholder")}
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: `1px solid ${theme.borderMedium}`,
              background: theme.background,
              color: theme.text,
            }}
          />
          <button
            onClick={() => {
              if (!newMember.trim()) return;
              onAddMember(newMember.trim());
              setNewMember("");
            }}
            style={{
              marginTop: 10,
              padding: "8px 16px",
              background: theme.success,
              color: theme.background,
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {t("settings.addMemberButton")}
          </button>
        </div>
      )}
    </div>
  );
}

export default SettingsTab;
