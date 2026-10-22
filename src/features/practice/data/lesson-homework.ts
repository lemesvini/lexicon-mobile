// The Practice tab's "From your lessons": the homework of the classes the
// student has had, and where each one stands.
//
// The same reading of the plan as the Today screen (features/today/data/
// week.ts): a class dated today or before has happened, and its homework has
// been given. A homework is due at the next class after its lesson.

import type { LessonHomework } from "@/features/practice/types/lesson-homework";
import type { LessonHomeworkList } from "@/features/practice/types/lesson-homework-list";
import { listHomework, toDateKey } from "@/features/today/data/week";
import { splitTitle } from "@/lib/lesson-title";
import { supabase } from "@/lib/supabase";

/** How many grades to show when nothing is pending. */
const LATEST_GRADES = 3;

type PlanRow = {
  lesson_id: string;
  title: string | null;
  position: number | null;
  scheduled_on: string | null;
  teacher_first_name: string | null;
  lesson_type: string | null;
};

/** Earliest first, by date then by place in the plan; undated last. */
function byDay(a: PlanRow, b: PlanRow): number {
  if (a.scheduled_on !== b.scheduled_on) {
    if (!a.scheduled_on) return 1;
    if (!b.scheduled_on) return -1;
    return a.scheduled_on < b.scheduled_on ? -1 : 1;
  }
  return (a.position ?? 0) - (b.position ?? 0);
}

export async function fetchLessonHomework(now = new Date()): Promise<LessonHomeworkList> {
  const { data, error } = await supabase
    .from("student_class_plan")
    .select("lesson_id, title, position, scheduled_on, teacher_first_name, lesson_type");
  if (error) throw new Error(error.message);

  const plan = ((data ?? []) as PlanRow[]).sort(byDay);
  const today = toDateKey(now);

  // Numbered as the path numbers them: lessons and checkpoints count, a
  // conversation class doesn't.
  let counted = 0;
  const lessons = new Map(
    plan.map((row) => {
      const { label, name } = splitTitle(row.title ?? "");
      const number = row.lesson_type === "conversation" ? null : ++counted;
      // Due at the next class dated after this one.
      const dueOn =
        row.scheduled_on === null
          ? null
          : (plan.find((later) => later.scheduled_on !== null && later.scheduled_on > row.scheduled_on!)
              ?.scheduled_on ?? null);
      return [row.lesson_id, { number, label: label ?? name, dueOn, row }] as const;
    }),
  );

  const given = plan.filter((row) => row.scheduled_on !== null && row.scheduled_on <= today);
  const homework = await listHomework([...new Set(given.map((row) => row.lesson_id))]);

  const items: LessonHomework[] = homework.map((entry) => {
    const lesson = lessons.get(entry.lessonId);
    return {
      id: entry.id,
      lessonId: entry.lessonId,
      lessonNumber: lesson?.number ?? null,
      lessonLabel: lesson?.label ?? entry.lessonName,
      type: entry.type,
      status: entry.status,
      total: entry.total,
      answered: entry.answered,
      score: entry.score,
      dueOn: lesson?.dueOn ?? null,
      gradedOn: entry.gradedAt ? toDateKey(new Date(entry.gradedAt)) : null,
      teacherFirstName: lesson?.row.teacher_first_name ?? null,
    };
  });

  // What still needs the student first, soonest due first; then what is with
  // the teacher, the latest lesson first.
  const toDo = items.filter((item) => item.status === "todo" || item.status === "in_progress");
  const waiting = items.filter((item) => item.status === "submitted").reverse();
  if (toDo.length + waiting.length > 0) {
    return { mode: "pending", items: [...toDo, ...waiting], todo: toDo.length };
  }

  const graded = items
    .filter((item) => item.status === "graded")
    .sort((a, b) => (b.gradedOn ?? "").localeCompare(a.gradedOn ?? ""))
    .slice(0, LATEST_GRADES);
  return graded.length > 0 ? { mode: "graded", items: graded } : { mode: "empty" };
}
