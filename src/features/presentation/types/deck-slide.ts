import type { DeckBlock } from "@/features/presentation/types/deck-block";

/** One slide of the class's deck, as it was on the wall. */
export type DeckSlide = {
  /** "Warm-up". */
  stage: string;
  blocks: DeckBlock[];
};
