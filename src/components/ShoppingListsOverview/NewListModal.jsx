import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

function NewListModal({ onClose, onCreate }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName("");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: theme.overlay,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: theme.background,
          padding: 20,
          borderRadius: 12,
          minWidth: 280,
          color: theme.text,
        }}
      >
        <h2 style={{ color: theme.text }}>{t("overview.newListModal")}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <input
              type="text"
              placeholder={t("overview.listName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <button type="button" onClick={onClose}>
              {t("common.cancel")}
            </button>
            <button type="submit">{t("common.create")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewListModal;
