import type { HomeworkStatus } from "@/features/today/types/homework-status";

export type WeekHomework = {
  id: string;
  title: string;
  lessonName: string;
  /** Questions to answer — prose blocks don't count. */
  total: number;
  answered: number;
  status: HomeworkStatus;
  /** 0–10, only once it has been graded. */
  score: number | null;
};
