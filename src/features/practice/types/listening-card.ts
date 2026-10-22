import type { PracticeCard } from "@/features/practice/types/practice-card";

/** A sentence to hear and rebuild from its words. */
export type ListeningCard = PracticeCard & {
  /** The sentence, in English. */
  text: string;
  /** In Portuguese, shown once answered. */
  translation: string | null;
  /** The sentence spoken. */
  audioUrl: string;
  /** Words not in the sentence that the Studio chose to mix in; empty when it
   *  left that to the app. */
  distractors: string[];
};
