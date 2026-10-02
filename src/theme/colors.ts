import { DarkTheme, DefaultTheme, type Theme } from "expo-router";

// Hex twins of the tokens in src/global.css, for places that take a color
// value instead of a className (navigation theme, native headers and tabs).
export const colors = {
  light: {
    background: "#f6f0eb",
    foreground: "#0e1412",
    card: "#fcf8f5",
    cardForeground: "#0e1412",
    popover: "#ffffff",
    popoverForeground: "#0e1412",
    primary: "#14352a",
    primaryForeground: "#ffffff",
    secondary: "#e9e6dc",
    secondaryForeground: "#14352a",
    muted: "#ede9de",
    mutedForeground: "#566c63",
    accent: "#c8ebdb",
    accentForeground: "#14352a",
    destructive: "#7f1d1d",
    destructiveForeground: "#ffffff",
    border: "#dbd9d2",
    input: "#b4b2a7",
    ring: "#61b495",
    primaryText: "#f1ece4",
  },
  dark: {
    background: "#0e1412",
    foreground: "#f1ece4",
    card: "#141b18",
    cardForeground: "#f1ece4",
    popover: "#141b18",
    popoverForeground: "#f1ece4",
    primary: "#61b495",
    primaryForeground: "#0e1412",
    secondary: "#14352a",
    secondaryForeground: "#f1ece4",
    muted: "#1a2522",
    mutedForeground: "#8aaba0",
    accent: "#14352a",
    accentForeground: "#f1ece4",
    destructive: "#ef4444",
    destructiveForeground: "#ffffff",
    border: "#1a2522",
    input: "#27302d",
    ring: "#61b495",
    primaryText: "#f1ece4",
  },
} as const;

export type ColorScheme = keyof typeof colors;

export const navigationThemes: Record<ColorScheme, Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      primary: colors.light.primary,
      background: colors.light.background,
      card: colors.light.background,
      text: colors.light.foreground,
      border: colors.light.border,
      notification: colors.light.destructive,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      primary: colors.dark.primary,
      background: colors.dark.background,
      card: colors.dark.background,
      text: colors.dark.foreground,
      border: colors.dark.border,
      notification: colors.dark.destructive,
    },
  },
};
