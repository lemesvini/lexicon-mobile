/** The teacher's report on one unit, as the student reads it. */
export type ProgressReport = {
  id: string;
  /** "Book One". */
  moduleName: string;
  /** The unit's number within the module. */
  unit: number;
  /** What happened over the unit; empty when the teacher wrote nothing. */
  observations: string;
  /** 0–10, or null when no test was recorded. */
  testScore: number | null;
  updatedAt: string;
};
