import type { LessonProgress } from "@/features/lessons/types/lesson-progress";
import type { PlannedClass } from "@/features/today/types/planned-class";
import type { TodayWeek } from "@/features/today/types/today-week";

export type TodayData = {
  /** Whether the student is in a group with a plan at all — tells "no plan
   *  yet" apart from "every class in it is in the past". */
  hasPlan: boolean;
  next: PlannedClass | null;
  /** How far the student is in `next`; null along with it. */
  nextProgress: LessonProgress | null;
  week: TodayWeek;
};
