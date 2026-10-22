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

// The Path tab's nodes. Not tokens of the web's palette, so not in global.css:
// they exist only on the path. A lesson behind the group takes its type's
// colour; the current one and those ahead look the same whatever their type.
// Every face has its own edge — the button's depth — dark enough against the
// face to read as one. A checkpoint is the deepest of the greens, never gold:
// gold on the path means a lesson done in full.
export const pathColors = {
  light: {
    lesson: { face: "#1f5240", edge: "#0c2a1f", content: "#f1ece4" },
    conversation: { face: "#3f8268", edge: "#22553f", content: "#f1ece4" },
    checkpoint: { face: "#14352a", edge: "#061a12", content: "#f1ece4" },
    current: { face: "#61b495", edge: "#367d61", content: "#14352a" },
    upcoming: { face: "#fcf8f5", edge: "#d3cfc5", content: "#566c63", border: "#dbd9d2" },
    // A class the student missed: a warm terracotta, not `destructive` — it is
    // a note on their record, not an error.
    missed: { text: "#b0584c", background: "#f6e6e1", border: "#ebcdc5" },
  },
  dark: {
    lesson: { face: "#2a6a54", edge: "#123b2d", content: "#f1ece4" },
    conversation: { face: "#4f9a7e", edge: "#2b6650", content: "#f1ece4" },
    checkpoint: { face: "#1d4d3c", edge: "#0a2a1f", content: "#f1ece4" },
    current: { face: "#61b495", edge: "#367d61", content: "#0e1412" },
    upcoming: { face: "#141b18", edge: "#070b0a", content: "#8aaba0", border: "#27302d" },
    missed: { text: "#e0968a", background: "#2a1d1b", border: "#46302c" },
  },
} as const;

// A homework's answers, by how they stand: untouched, picked, and — once graded
// — right or wrong. Each a chunky button like the path's nodes: a face, its
// border, and the edge under it that gives it depth. Wrong is the path's soft
// terracotta, never an alarm red.
export const exerciseColors = {
  light: {
    idle: { face: "#fcf8f5", border: "#dbd9d2", edge: "#cfccc3", text: "#0e1412" },
    chosen: { face: "#e3f4ec", border: "#61b495", edge: "#3e8f70", text: "#14352a" },
    correct: { face: "#e6f7ee", border: "#10b981", edge: "#0b8a60", text: "#065f46" },
    incorrect: { face: "#f6e6e1", border: "#e3b3a8", edge: "#c98475", text: "#b0584c" },
  },
  dark: {
    idle: { face: "#141b18", border: "#27302d", edge: "#0a0f0d", text: "#f1ece4" },
    chosen: { face: "#183a2e", border: "#61b495", edge: "#2f7a5d", text: "#f1ece4" },
    correct: { face: "#0f3327", border: "#10b981", edge: "#06614a", text: "#a7f3d0" },
    incorrect: { face: "#2a1d1b", border: "#7a463d", edge: "#4a2a25", text: "#e0968a" },
  },
} as const;

// The Practice tab's skill cards: each skill's icon sits on its own soft tint,
// and every card is a chunky face on a darker edge, like the exercise answers.
export const practiceColors = {
  light: {
    card: { face: "#fcf8f5", border: "#e6e2da", edge: "#dcd7cc" },
    // A speaking card's back, in English. Opaque: the deck under it would show
    // through a see-through mint.
    back: { face: "#dcefe6", border: "#c3e3d4" },
    listening: { tint: "#dde6f0", icon: "#2f4a73" },
    speaking: { tint: "#f0dcd5", icon: "#9a4a3c" },
    reading: { tint: "#d8eee4", icon: "#1f5240" },
    writing: { tint: "#f3e3bb", icon: "#7a5410" },
    // How a speaking card went: the exercise answers' green, the path's gold
    // and its soft terracotta — never an alarm red.
    remembered: { text: "#065f46", background: "#e6f7ee" },
    almost: { text: "#8a5e16", background: "#f7ebcf" },
    forgot: { text: "#b0584c", background: "#f6e6e1" },
  },
  dark: {
    card: { face: "#141b18", border: "#27302d", edge: "#0a0f0d" },
    back: { face: "#132a22", border: "#1f4436" },
    listening: { tint: "#1c2735", icon: "#9fb8d9" },
    speaking: { tint: "#2a1d1b", icon: "#e0968a" },
    reading: { tint: "#14352a", icon: "#8cc7b2" },
    writing: { tint: "#2e2614", icon: "#e7c27a" },
    remembered: { text: "#a7f3d0", background: "#0f3327" },
    almost: { text: "#e7c27a", background: "#2e2614" },
    forgot: { text: "#e0968a", background: "#2a1d1b" },
  },
} as const;

// A gold coin with a star, the mark of a "Now you can" done and of a lesson on
// the path done in full. One set for both themes: it is
// metal, not surface, so it reads as gold on a light card and a dark one alike.
// The rim runs light to dark from the top left, the face the other way round —
// the bevel — and a pale shine across it keeps it from reading as flat orange.
export const goldColors = {
  rim: { light: "#ffe9a8", mid: "#f6c04e", dark: "#c98516" },
  face: { dark: "#e3961c", light: "#fcc955" },
  edge: "#b7740f",
  shine: "#fff6d6",
  icon: "#ffffff",
  iconShadow: "#a8650c",
} as const;

// The confetti at the end of a practice sitting: the coin's golds, the path's
// greens, and the skills' own blue and terracotta — the app's colours, thrown.
// One set for both themes: bright enough on a light card and a dark one.
export const confettiColors = [
  goldColors.rim.mid,
  goldColors.face.light,
  "#61b495",
  "#3f8268",
  "#e0968a",
  "#7aa2d6",
  "#f3e3bb",
] as const;

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
