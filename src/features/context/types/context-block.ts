import type { ContextAnswer } from "@/features/context/types/context-answer";

/** One answered block of the student's context. */
export type ContextBlock = {
  /** The heading the block was written under, e.g. "Onboarding (2026-08-30)". */
  title: string;
  /** "YYYY-MM-DD" from the heading, or null when it has none. */
  date: string | null;
  /** A note the student added since onboarding (lexicon-web 0021), rather
   *  than the onboarding's answers. */
  isNote: boolean;
  /** In the order they were asked. */
  answers: ContextAnswer[];
};
