// The student's attendance, counted as the teacher's register counts it
// (`attendanceByStudent` in lexicon-web/src/features/groups/data/group-classes.ts):
// present out of marked, with excused absences left out — they are recorded,
// not held against the student.

import type { AttendanceTally } from "@/features/lessons/types/attendance-tally";
import type { ClassRecord } from "@/features/lessons/types/class-record";

export function attendanceTally(classes: readonly ClassRecord[]): AttendanceTally {
  let present = 0;
  let marked = 0;
  for (const entry of classes) {
    if (entry.present) {
      present += 1;
      marked += 1;
    } else if (entry.present === false && !entry.excused) {
      marked += 1;
    }
  }
  return { present, marked };
}

/** 0–100, or null before the student has been marked at a single class. */
export function attendancePercent(classes: readonly ClassRecord[]): number | null {
  const { present, marked } = attendanceTally(classes);
  return marked === 0 ? null : (present / marked) * 100;
}
