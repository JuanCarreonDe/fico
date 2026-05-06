"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, accentColor, ...props }: ThemeProviderProps & { accentColor?: string }) {
  React.useEffect(() => {
    if (accentColor) {
      document.documentElement.style.setProperty("--accent", accentColor);
    }
  }, [accentColor]);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
