"use client";

import { ThemeProvider } from "next-themes";
import { useEffect } from "react";

export default function CustomThemeProvider({
  children,
}) {
  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    // Set default theme if not exists
    if (!savedTheme) {
      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="theme"
    >
      {children}
    </ThemeProvider>
  );
}