import type { AssignmentSubmission } from "@/features/homework/types/assignment-submission";
import type { ExerciseItem } from "@/features/homework/types/exercise-item";
import type { HomeworkType } from "@/features/today/types/homework-type";

/** A homework as the student opens it. */
export type Assignment = {
  id: string;
  type: HomeworkType;
  /** What the student reads first, when the teacher wrote any. */
  instructions: string | null;
  items: ExerciseItem[];
  /** A homework never opened before has an empty one, in progress. */
  submission: AssignmentSubmission;
};
