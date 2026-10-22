import type { PlannedClass } from "@/features/today/types/planned-class";
import type { TodayWeek } from "@/features/today/types/today-week";

export type TodayData = {
  /** Whether the student is in a group with a plan at all — tells "no plan
   *  yet" apart from "every class in it is in the past". */
  hasPlan: boolean;
  next: PlannedClass | null;
  week: TodayWeek;
};
