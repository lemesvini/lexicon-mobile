/** A row of `student_homework`, with only what a lesson's steps need: which
 *  lesson it belongs to, and whether it is a "Now you can". */
export type HomeworkStepRecord = {
  id: string;
  lesson_id: string;
  homework_type: string | null;
};
