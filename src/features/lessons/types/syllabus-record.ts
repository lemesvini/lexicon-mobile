import type { LessonType } from "@/features/lessons/types/lesson-type";

/** A row of the `student_syllabus` view, as PostgREST returns it: every lesson
 *  in the student's module, whether or not it can be opened yet. */
export type SyllabusRecord = {
  id: string;
  title: string | null;
  unit: string | null;
  module: string | null;
  /** The module-wide sequence. `position` restarts in every unit, so this is
   *  what to sort by. 0 or null means not placed yet. */
  course_order: number | null;
  available: boolean;
  lesson_type: LessonType;
};
