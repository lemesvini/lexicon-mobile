import type { HomeworkBlock } from "@/features/today/types/homework-block";

/** A row of the `student_homework` view, as PostgREST returns it. */
export type HomeworkRecord = {
  id: string;
  title: string | null;
  lesson_id: string;
  lesson_title: string | null;
  homework_type: string | null;
  document: { slides?: { blocks?: HomeworkBlock[] }[] } | null;
};
