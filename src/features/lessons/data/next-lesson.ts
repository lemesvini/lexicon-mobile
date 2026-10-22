// The group's next lesson — the same answer the teacher's group page gives.
//
// A port of `suggestNextLesson` and `lastHeldClass` in
// lexicon-web/src/features/groups/data/group-classes.ts; keep the two in step.
// The one difference is the input: the web counts who was present at each
// class, and `student_classes` says only whether anybody was (`held`), which is
// all the rule asks.
//
// A class is the group's. A student who missed one is moved on with their class
// all the same: what they are shown next is what is taught next.

import type { ClassRecord } from "@/features/lessons/types/class-record";

/** Newest first: by day, then by hour on a day with more than one class. */
export function byNewest(a: ClassRecord, b: ClassRecord): number {
  if (a.class_date !== b.class_date) return a.class_date < b.class_date ? 1 : -1;
  return (b.starts_at ?? "").localeCompare(a.starts_at ?? "");
}

/**
 * The lesson after the lesson of the most recent class somebody was present
 * at.
 *
 * Only classes whose lesson is in `sequence` count — a class spent on something
 * outside the course says nothing about where in it the group is. Before any
 * such class, the first lesson. After the last lesson, null: the course is done.
 *
 * `classes` must be newest first ({@link byNewest}).
 */
export function suggestNextLesson(
  sequence: readonly string[],
  classes: readonly ClassRecord[],
): string | null {
  const inSequence = new Set(sequence);
  const last = classes.find(
    (entry) => entry.held && !!entry.lesson_id && inSequence.has(entry.lesson_id),
  );
  if (!last?.lesson_id) return sequence[0] ?? null;
  return sequence[sequence.indexOf(last.lesson_id) + 1] ?? null;
}
