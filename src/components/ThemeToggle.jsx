import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { toggleTheme } from "../utils/theme";
import {theme} from "../utils/classnames";


export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const handleClick = () => {
    toggleTheme();
    setIsDark((prev) => !prev);
  };

  return (
    <button
      onClick={handleClick}
      className={theme.toggleButton}
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun size={20} className={theme.light} /> : <Moon size={20} className={theme.dark} />}
    </button>
  );
}