/** A row of the `student_class_plan` view, as PostgREST returns it. */
export type PlanRecord = {
  group_id: string;
  lesson_id: string;
  title: string | null;
  unit: string | null;
  position: number | null;
  scheduled_on: string | null;
  starts_at: string | null;
  teacher_first_name: string | null;
  can_do: string | null;
  /** A JSON array; the view turns a missing one into `[]`. */
  grammar_focus: unknown;
};
