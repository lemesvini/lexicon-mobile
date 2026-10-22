import type { LessonHomework } from "@/features/practice/types/lesson-homework";

/**
 * What the Practice tab lists under "From your lessons":
 *
 *   pending  homework to do, or handed in and waiting to be graded
 *   graded   nothing pending — the latest grades instead
 *   empty    no homework from the lessons had so far
 */
export type LessonHomeworkList =
  | { mode: "pending"; items: LessonHomework[]; todo: number }
  | { mode: "graded"; items: LessonHomework[] }
  | { mode: "empty" };
