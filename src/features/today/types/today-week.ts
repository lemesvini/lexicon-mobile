import type { PlannedClass } from "@/features/today/types/planned-class";
import type { WeekHomework } from "@/features/today/types/week-homework";

export type TodayWeek = {
  /** Monday, "YYYY-MM-DD". */
  start: string;
  /** Sunday, "YYYY-MM-DD". */
  end: string;
  classes: PlannedClass[];
  homework: WeekHomework[];
};
