import type { HomeworkStatus } from "@/features/today/types/homework-status";
import type { HomeworkType } from "@/features/today/types/homework-type";

export type WeekHomework = {
  id: string;
  title: string;
  lessonId: string;
  /** The step it stands for in its lesson. */
  type: HomeworkType;
  lessonName: string;
  /** Questions to answer — prose blocks don't count. */
  total: number;
  answered: number;
  status: HomeworkStatus;
  /** 0–10, only once it has been graded. */
  score: number | null;
  /** When it was graded, as an ISO timestamp; null until then. */
  gradedAt: string | null;
};
