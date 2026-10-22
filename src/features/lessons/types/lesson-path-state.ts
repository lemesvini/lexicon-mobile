import type { LessonPath } from "@/features/lessons/types/lesson-path";

export type LessonPathState =
  | { status: "loading" }
  | { status: "ready"; data: LessonPath }
  | { status: "error"; message: string };
