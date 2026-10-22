import type { AttendanceTally } from "@/features/lessons/types/attendance-tally";
import type { ProgressReport } from "@/features/profile/types/progress-report";

/** Everything the Me tab's progress card shows. */
export type Progress = {
  /** The module the student's path is of, or null with no lessons at all. */
  moduleName: string | null;
  /** "Unit Two": the unit of the group's next lesson, or the last one once
   *  the course is done. */
  unitName: string | null;
  attended: AttendanceTally;
  /** The module's checkpoints, and how many the group is past. */
  checkpoints: { done: number; total: number };
  /** Oldest unit first. */
  reports: ProgressReport[];
};
