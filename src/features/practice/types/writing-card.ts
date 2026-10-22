import type { PracticeCard } from "@/features/practice/types/practice-card";

/** A sentence shown in Portuguese, to build in English from its words. */
export type WritingCard = PracticeCard & {
  /** In Portuguese — what is shown. */
  prompt: string;
  /** In English — what is built. */
  answer: string;
  /** Words not in the answer that the Studio chose to mix in; empty when it
   *  left that to the app. */
  distractors: string[];
};
