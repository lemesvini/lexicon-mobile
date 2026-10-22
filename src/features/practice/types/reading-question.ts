/** A multiple-choice question on a reading text. */
export type ReadingQuestion = {
  id: string;
  prompt: string;
  options: string[];
  /** 0-based index into `options`. */
  answer: number;
};
