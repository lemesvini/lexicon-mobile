import type { LessonType } from "@/features/lessons/types/lesson-type";

/** A row of the `student_class_plan` view, as the path reads it: one lesson of
 *  a group's plan. Only the columns the path selects. */
export type PlanLessonRecord = {
  group_id: string;
  lesson_id: string;
  title: string | null;
  unit: string | null;
  module: string | null;
  /** The group's teaching order — the sequence the next lesson is counted in. */
  position: number | null;
  scheduled_on: string | null;
  starts_at: string | null;
  available: boolean;
  lesson_type: LessonType;
};
