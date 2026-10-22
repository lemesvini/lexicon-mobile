import type { ExerciseBlock } from "@/features/homework/types/exercise-block";
import type { MaterialBlock } from "@/features/material/types/material-block";

/** Any block of the class's deck: what the material has, and the exercises the
 *  teacher went through on the projector. */
export type DeckBlock = MaterialBlock | ExerciseBlock;
