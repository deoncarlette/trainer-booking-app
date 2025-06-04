// src/utils/theme.js

export function applyTheme(mode = null) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const stored = localStorage.getItem("theme");

  const theme = mode || stored || "system";
  document.documentElement.classList.remove("light", "dark", "adaptive");

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (theme === "light") {
    document.documentElement.classList.add("light");
  } else {
    // system mode (adaptive)
    document.documentElement.classList.add(prefersDark ? "dark" : "light");
  }
}

// Call this once on app start
export function applySavedTheme() {
  applyTheme(); // uses localStorage or system
}

// Call this when user toggles
export function toggleTheme() {
  const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem("theme", next);
  applyTheme(next);
}