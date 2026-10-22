import type { PracticeCard } from "@/features/practice/types/practice-card";
import type { ReadingQuestion } from "@/features/practice/types/reading-question";

/** A text to read, and the questions asked on it after. One card to the spaced
 *  repetition: its questions decide, together, when it comes back. */
export type ReadingCard = PracticeCard & {
  title: string;
  /** CEFR level: "A1". */
  level: string | null;
  /** One line in Portuguese on what it is about. */
  blurb: string | null;
  paragraphs: string[];
  /** Only the complete ones: a prompt, two options or more, an answer among them. */
  questions: ReadingQuestion[];
};
