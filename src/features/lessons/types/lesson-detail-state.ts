import type { LessonDetail } from "@/features/lessons/types/lesson-detail";

export type LessonDetailState =
  | { status: "loading" }
  | { status: "ready"; data: LessonDetail }
  /** Not in their course, or not there at all — the two look the same from
   *  here on purpose, as on the web. */
  | { status: "missing" }
  | { status: "error"; message: string };
