/** A row of the `student_submissions` view, as PostgREST returns it. */
export type SubmissionRecord = {
  homework_id: string;
  status: string | null;
  answers: Record<string, unknown> | null;
  score: number | null;
};
