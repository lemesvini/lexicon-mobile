import type { PracticeCard } from "@/features/practice/types/practice-card";

/** A "como se diz" card: Portuguese on the front, English to say. */
export type SpeakingCard = PracticeCard & {
  /** The front, in Portuguese: "Sala de reunião". */
  prompt: string;
  /** The back, and what to say: "Meeting room". */
  answer: string;
  /** The answer in a sentence, for the back. */
  example: string | null;
};
