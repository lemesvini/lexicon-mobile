import type { LiveClass } from "@/features/lessons/types/live-class";
import type { WeekHomework } from "@/features/today/types/week-homework";

/** Where the student stands in a lesson: its live class, then its homework —
 *  the steps its page lists. */
export type LessonProgress = {
  liveClass: LiveClass;
  homework: WeekHomework[];
};
