import type { AnswerValue } from "@/features/homework/types/answer-value";

/** The student's work on a homework, from `student_submissions` — which keeps
 *  the marking, the key, the score and the notes empty until it is graded. */
export type AssignmentSubmission = {
  status: "in_progress" | "submitted" | "graded";
  answers: Record<string, AnswerValue>;
  /** Block id → right or wrong, for the questions marked automatically. */
  marks: Record<string, boolean>;
  /** Block id → the right answer. */
  answerKey: Record<string, AnswerValue>;
  /** 0–10. */
  score: number | null;
  feedback: string | null;
  /** Block id → the teacher's note on that question. */
  blockNotes: Record<string, string>;
};
