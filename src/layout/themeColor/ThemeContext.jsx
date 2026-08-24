import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import tinycolor from "tinycolor2";
import { generateTheme } from "./generateTheme";

const ThemeContext = createContext(null);

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";

  const storedTheme = localStorage.getItem("theme");

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return "light";
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(getInitialTheme);
  const [forcedThemeMode, setForcedThemeMode] = useState(null);
  const activeThemeMode = forcedThemeMode || themeMode;

  const [themeData, setThemeData] = useState({
    primary_color: "#0070ff",
    secondary_color: "#71c0ff",
    typography: "#000000",
    logo: "",
  });

  useEffect(() => {
    const root = document.documentElement;
    const primary = tinycolor(themeData.primary_color).toRgb();
    const secondary = tinycolor(themeData.secondary_color).toRgb();
    const typography = tinycolor(themeData.typography).toRgb();
    const isLight = activeThemeMode === "light";

    root.classList.toggle("dark", !isLight);
    root.dataset.theme = activeThemeMode;
    root.style.colorScheme = isLight ? "light" : "dark";

    root.style.setProperty(
      "--primary-color",
      `rgb(${primary.r} ${primary.g} ${primary.b})`,
    );
    root.style.setProperty(
      "--secondary-color",
      `rgb(${secondary.r} ${secondary.g} ${secondary.b})`,
    );
    root.style.setProperty(
      "--typography-color",
      `rgb(${typography.r} ${typography.g} ${typography.b})`,
    );
    root.style.setProperty(
      "--bg-primary-color",
      isLight ? "rgb(248 250 252)" : "rgb(2 6 23)",
    );
    root.style.setProperty(
      "--bg-secondary-color",
      isLight ? "rgb(255 255 255)" : "rgb(15 23 42)",
    );
    root.style.setProperty(
      "--bg-third-color",
      isLight ? "rgb(241 245 249)" : "rgb(30 41 59)",
    );
    root.style.setProperty(
      "--text-primary-color",
      isLight ? "rgb(15 23 42)" : "rgb(248 250 252)",
    );
    root.style.setProperty(
      "--border-primary-color",
      isLight ? "rgb(226 232 240)" : "rgb(51 65 85)",
    );
  }, [themeData, activeThemeMode]);

  useEffect(() => {
    localStorage.setItem("theme", themeMode);
  }, [themeMode]);

  const antdTheme = useMemo(
    () => generateTheme({ ...themeData, mode: activeThemeMode }),
    [themeData, activeThemeMode],
  );

  const toggleTheme = useCallback(() => {
    setThemeMode((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const contextValue = useMemo(
    () => ({
      themeMode: activeThemeMode,
      themeData,
      antdTheme,
      setThemeData,
      setThemeMode,
      setForcedThemeMode,
      toggleTheme,
    }),
    [activeThemeMode, themeData, antdTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};
