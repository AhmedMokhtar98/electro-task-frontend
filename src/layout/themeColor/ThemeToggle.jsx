import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeContext";

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

  const toggleTheme = () => {
    const nextMode = themeMode === "dark" ? "light" : "dark";

    setThemeMode(nextMode);
    localStorage.setItem("theme", nextMode);
  };

  const isDark = themeMode === "dark";

  return (
    <button
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="group relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-black/[0.04] text-amber-500 transition-all duration-300 hover:bg-black/[0.08] hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:bg-white/[0.06] dark:text-sky-300 dark:hover:bg-white/[0.1]"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      type="button"
      onClick={toggleTheme}
    >
      <Sun
        aria-hidden="true"
        className={`absolute transition-all duration-500 ease-out ${
          isDark
            ? "-rotate-90 scale-50 opacity-0"
            : "rotate-0 scale-100 opacity-100 group-hover:rotate-12"
        }`}
        size={20}
      />
      <Moon
        aria-hidden="true"
        className={`absolute transition-all duration-500 ease-out ${
          isDark
            ? "rotate-0 scale-100 opacity-100 group-hover:-rotate-12"
            : "rotate-90 scale-50 opacity-0"
        }`}
        size={19}
      />
    </button>
  );
};

export default ThemeToggle;
