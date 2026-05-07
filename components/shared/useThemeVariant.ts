"use client";

import { useState, useEffect } from "react";

export function useThemeVariant(): "light" | "dark" {
  const [variant, setVariant] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    setVariant(mql.matches ? "dark" : "light");

    const handler = (e: MediaQueryListEvent) => {
      setVariant(e.matches ? "dark" : "light");
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return variant;
}