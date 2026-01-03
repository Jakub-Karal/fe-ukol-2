import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === "cs" ? "en" : "cs";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      style={{
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 1001,
        padding: "8px 12px",
        borderRadius: 8,
        border: `1px solid ${theme.border}`,
        background: theme.background,
        color: theme.text,
        cursor: "pointer",
        fontSize: 12,
        fontWeight: "bold",
        boxShadow: `0 2px 8px ${theme.shadow}`,
      }}
    >
      {i18n.language === "cs" ? "EN" : "CS"}
    </button>
  );
}

export default LanguageSwitcher;
