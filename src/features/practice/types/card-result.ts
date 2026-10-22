import type { CardOutcome } from "@/features/practice/types/card-outcome";
import type { MatchedWord } from "@/features/practice/types/matched-word";

/** How one go at a speaking card turned out. */
export type CardResult = CardOutcome & {
  /** The answer's words, marked heard or not; null without recognition. */
  words: MatchedWord[] | null;
  /** What the recognizer heard. */
  heard: string | null;
};
