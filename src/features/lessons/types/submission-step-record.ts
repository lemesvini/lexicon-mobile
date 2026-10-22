/** A row of `student_submissions`, with only what a lesson's steps need:
 *  whether the homework has been handed in. */
export type SubmissionStepRecord = {
  homework_id: string;
  status: string | null;
};
