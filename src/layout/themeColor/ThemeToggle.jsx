// ThemeToggle.js
import React, { useEffect } from "react";
import { useTheme } from "./ThemeContext";
import { Switch } from "antd";

const ThemeToggle = () => {
  const { themeMode, setThemeMode } = useTheme();

  useEffect(() => {
    const storedThemeMode = localStorage.getItem("theme");
    if (storedThemeMode) {
      setThemeMode(storedThemeMode);
    } else {
      localStorage.setItem("theme", "light");
      setThemeMode("light");
    }
  }, [setThemeMode]);

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    localStorage.setItem("theme", mode);
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ marginRight: 8 }}>
        {themeMode === "light" ? "Light" : "dark"}
      </span>
      <Switch
        checked={themeMode === "dark"}
        onChange={() =>
          handleThemeChange(themeMode === "dark" ? "light" : "dark")
        }
        checkedChildren="Dark"
        unCheckedChildren="Light"
      />
    </div>
  );
};

export default ThemeToggle;
