import type { CardRating } from "@/features/practice/types/card-rating";

/** How a card went, as far as its schedule is concerned. */
export type CardOutcome = {
  rating: CardRating;
  /** How much of it was right, 0–1; null when the student rated it
   *  themselves, or gave up. */
  score: number | null;
};
