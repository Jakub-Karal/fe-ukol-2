import { useTheme } from "../../contexts/ThemeContext";

function ThemeToggle() {
  const { mode, toggleMode, theme } = useTheme();

  return (
    <button
      onClick={toggleMode}
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1001,
        padding: "8px 12px",
        borderRadius: 8,
        border: `1px solid ${theme.border}`,
        background: theme.background,
        color: theme.text,
        cursor: "pointer",
        fontSize: 20,
        boxShadow: `0 2px 8px ${theme.shadow}`,
      }}
      title={mode === "light" ? "Přepnout na tmavý režim" : "Přepnout na světlý režim"}
    >
      {mode === "light" ? "🌙" : "☀️"}
    </button>
  );
}

export default ThemeToggle;
