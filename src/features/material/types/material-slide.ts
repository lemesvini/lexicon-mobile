import type { MaterialBlock } from "@/features/material/types/material-block";

/** One slide of a student's material: a step of the lesson. */
export type MaterialSlide = {
  /** "Vocabulary". */
  stage: string;
  blocks: MaterialBlock[];
};
