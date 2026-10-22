/** A row of the `student_submissions` view, as PostgREST returns it. */
export type SubmissionRecord = {
  homework_id: string;
  status: string | null;
  answers: Record<string, unknown> | null;
  score: number | null;
  /** When the teacher graded it; null until then. */
  graded_at: string | null;
};
