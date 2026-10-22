import { FadeIn } from "react-native-reanimated";

// How a homework's answers come in, kept in one place so every exercise moves
// the same way: a short fade, each a beat after the last. No springs, no
// travel — the page is for reading, and motion should only say "here".

/** The options, the words to tap: one after another, barely staggered. */
export function enterAt(index: number) {
  return FadeIn.duration(220).delay(index * 30);
}

/** A word landing in the sentence's gap. */
export const LAND = FadeIn.duration(180);
