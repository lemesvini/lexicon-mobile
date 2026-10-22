import type { LessonHomeworkList } from "@/features/practice/types/lesson-homework-list";

export type LessonHomeworkState =
  | { status: "loading" }
  | { status: "ready"; list: LessonHomeworkList }
  | { status: "error"; message: string };
