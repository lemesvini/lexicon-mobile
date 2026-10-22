import type { ExerciseBlock } from "@/features/homework/types/exercise-block";
import type { MaterialBlock } from "@/features/material/types/material-block";

/** One page of a homework: a question, or a block to read on the way. */
export type ExerciseItem =
  | { answerable: true; block: ExerciseBlock; id: string; /** 1-based among questions. */ number: number }
  | { answerable: false; block: MaterialBlock };
