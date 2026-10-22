import type { AttendanceTally } from "@/features/lessons/types/attendance-tally";
import type { PathUnit } from "@/features/lessons/types/path-unit";

/** Everything the Path tab shows. */
export type LessonPath = {
  /** The module the path is of: the group's, which may be a variant such as
   *  "Book One [intensivo]". Null when the student has no lessons at all. */
  moduleName: string | null;
  units: PathUnit[];
  /** The group's next lesson, or null once the course is done. */
  currentId: string | null;
  /** Present out of marked, 0–100, excused absences left out. Null before the
   *  student has been marked at all. */
  attendance: number | null;
  /** The counts the percentage is of: "11 de 12 aulas". */
  attended: AttendanceTally;
};
