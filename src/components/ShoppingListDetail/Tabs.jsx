import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

function Tabs({ activeTab, onChangeTab }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const tabs = [
    { id: "items", label: t("tabs.items") },
    { id: "members", label: t("tabs.members") },
    { id: "settings", label: t("tabs.settings") },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        borderBottom: `1px solid ${theme.borderMedium}`,
        marginBottom: 20,
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChangeTab(tab.id)}
          style={{
            padding: "8px 12px",
            border: "none",
            borderBottom:
              activeTab === tab.id
                ? `2px solid ${theme.text}`
                : "2px solid transparent",
            background: "none",
            cursor: "pointer",
            fontWeight: activeTab === tab.id ? "bold" : "normal",
            color: theme.text,
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
