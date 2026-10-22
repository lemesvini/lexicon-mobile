import type { HomeworkStatus } from "@/features/today/types/homework-status";

/** One homework from a lesson the student has had, as the Practice tab lists it. */
export type LessonHomework = {
  id: string;
  lessonId: string;
  /** Its place on the path, as the path numbers it; null for a conversation
   *  class, which shows an icon instead. */
  lessonNumber: number | null;
  /** "Lesson Eight", or the lesson's name when its title has no label. */
  lessonLabel: string;
  type: "activities" | "now-you-can";
  status: HomeworkStatus;
  /** Questions to answer, and how many are. */
  total: number;
  answered: number;
  /** 0–10, once graded. */
  score: number | null;
  /** The day of the next class after the lesson — when it is due; null when
   *  none is planned. */
  dueOn: string | null;
  /** "YYYY-MM-DD", once graded. */
  gradedOn: string | null;
  teacherFirstName: string | null;
};
