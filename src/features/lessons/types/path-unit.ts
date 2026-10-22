import type { PathLesson } from "@/features/lessons/types/path-lesson";

/** A unit of the module: its banner, and the stretch of path under it. */
export type PathUnit = {
  /** "Unit Two". */
  name: string;
  /** "Welcome a Visitor", from the unit's checkpoint, or null when it has none
   *  that names it. */
  title: string | null;
  lessons: PathLesson[];
};
