import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const themes = {
  light: {
    background: "#ffffff",
    text: "#000000",
    textMuted: "#555555",
    border: "#dddddd",
    borderLight: "#eeeeee",
    borderMedium: "#cccccc",
    primary: "#0066ff",
    danger: "#aa0000",
    success: "#008000",
    warning: "#ff9900",
    disabled: "#888888",
    overlay: "rgba(0,0,0,0.3)",
    shadow: "rgba(0,0,0,0.12)",
  },
  dark: {
    background: "#1a1a1a",
    text: "#ffffff",
    textMuted: "#aaaaaa",
    border: "#333333",
    borderLight: "#2a2a2a",
    borderMedium: "#444444",
    primary: "#4d94ff",
    danger: "#ff4444",
    success: "#44ff44",
    warning: "#ffaa44",
    disabled: "#666666",
    overlay: "rgba(0,0,0,0.7)",
    shadow: "rgba(0,0,0,0.4)",
  },
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("theme-mode") || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = { mode, theme: themes[mode], toggleMode };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
