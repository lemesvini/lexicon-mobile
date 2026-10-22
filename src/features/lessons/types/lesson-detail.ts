import type { LiveClass } from "@/features/lessons/types/live-class";
import type { MaterialStep } from "@/features/lessons/types/material-step";
import type { WeekHomework } from "@/features/today/types/week-homework";

/** Everything the lesson page shows. */
export type LessonDetail = {
  id: string;
  /** "Lesson Eight", from the title's prefix, or null when it has none. */
  label: string | null;
  /** The title without that prefix. */
  name: string;
  /** "Unit Two". */
  unit: string;
  canDo: string | null;
  /** The group's teacher's first name, or null off a plan. */
  teacherFirstName: string | null;
  liveClass: LiveClass;
  /** The lesson's homework, in the order the Today tab lists it. */
  homework: WeekHomework[];
  /** The material's slides. Empty while it isn't published to the student. */
  steps: MaterialStep[];
  /** Whether the class's presentation is published to them. */
  hasPresentation: boolean;
};
