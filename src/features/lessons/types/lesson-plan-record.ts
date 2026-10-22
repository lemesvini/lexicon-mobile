/** A row of the `student_class_plan` view for one lesson, as the lesson page
 *  reads it. One per group the student is in that has the lesson. */
export type LessonPlanRecord = {
  group_id: string;
  title: string | null;
  unit: string | null;
  can_do: string | null;
  teacher_first_name: string | null;
  scheduled_on: string | null;
  starts_at: string | null;
};
