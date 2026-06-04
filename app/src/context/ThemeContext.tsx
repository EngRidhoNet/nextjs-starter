"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

type Theme = "light" | "dark" | "dynamic";

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<Theme>("light");
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("light");

  const updateEffective = useCallback((t: Theme) => {
    if (t === "dynamic") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setEffectiveTheme(prefersDark ? "dark" : "light");
    } else {
      setEffectiveTheme(t);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const initial = stored ?? "light";
    setThemeState(initial);
    updateEffective(initial);
    setMounted(true);
  }, [updateEffective]);

  useEffect(() => {
    if (!mounted || theme !== "dynamic") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setEffectiveTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(effectiveTheme);
  }, [effectiveTheme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    updateEffective(newTheme);
    localStorage.setItem("theme", newTheme);
  }, [updateEffective]);

  const toggleTheme = useCallback(() => {
    setTheme(effectiveTheme === "light" ? "dark" : "light");
  }, [effectiveTheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme, toggleTheme, loading: false }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
