// The Path tab's data: every lesson of the student's course, in teaching order,
// with the group's next class marked, split into units.
//
// Five views, all scoped to the signed-in student (lexicon-web 0029 and
// before), so nothing here filters by who is asking — and so the five go out
// together:
//
//   student_class_plan   the group's plan: its lessons in `position` order
//   student_syllabus     every lesson of the module, for a student in no group
//   student_classes      the group's classes: which happened, the student's mark
//   student_homework     the homework of each lesson, for the ring's steps
//   student_submissions  which of it has been handed in
//
// The sequence is the group's plan when there is one, as the teacher's group
// page has it (`courseLessons` in lexicon-web), and the module's curriculum
// order otherwise. A student in more than one active group is shown the group
// that met most recently.

import { attendancePercent, attendanceTally } from "@/features/lessons/data/attendance";
import { byNewest, suggestNextLesson } from "@/features/lessons/data/next-lesson";
import type { ClassRecord } from "@/features/lessons/types/class-record";
import type { HomeworkStepRecord } from "@/features/lessons/types/homework-step-record";
import type { LessonPath } from "@/features/lessons/types/lesson-path";
import type { LessonStep } from "@/features/lessons/types/lesson-step";
import type { LessonType } from "@/features/lessons/types/lesson-type";
import type { PathLesson } from "@/features/lessons/types/path-lesson";
import type { PathUnit } from "@/features/lessons/types/path-unit";
import type { PlanLessonRecord } from "@/features/lessons/types/plan-lesson-record";
import type { SubmissionStepRecord } from "@/features/lessons/types/submission-step-record";
import type { SyllabusRecord } from "@/features/lessons/types/syllabus-record";
import { splitTitle } from "@/lib/lesson-title";
import { supabase } from "@/lib/supabase";

/** "Checkpoint — Welcome a Visitor" → "Welcome a Visitor". A checkpoint named
 *  otherwise ("First Checkpoint") doesn't name its unit. */
const CHECKPOINT_TITLE = /checkpoint\s*[—–-]\s*(.+)$/i;

/** A lesson of the sequence, from either source, before it is placed. */
function entryOf(
  record: Pick<SyllabusRecord, "title" | "unit" | "module" | "available" | "lesson_type">,
  id: string,
  scheduledOn: string | null = null,
  startsAt: string | null = null,
) {
  return {
    id,
    name: splitTitle(record.title ?? "").name,
    unit: record.unit?.trim() ?? "",
    module: record.module ?? null,
    type: record.lesson_type,
    available: record.available,
    scheduledOn,
    startsAt: startsAt ? startsAt.slice(0, 5) : null,
  };
}

/** Curriculum order, unplaced last — lexicon-web's `byCourseOrder`. */
function byCourseOrder(a: SyllabusRecord, b: SyllabusRecord): number {
  const rank = (order: number | null) =>
    order && order > 0 ? order : Number.MAX_SAFE_INTEGER;
  return (
    rank(a.course_order) - rank(b.course_order) ||
    (a.title ?? "").localeCompare(b.title ?? "")
  );
}

/** The group whose path to show: the one that met most recently, or the first
 *  one in the plan when none has met yet. */
function pickGroup(
  plan: PlanLessonRecord[],
  classes: ClassRecord[],
): string | null {
  const groups = new Set(plan.map((row) => row.group_id));
  const latest = classes.find((entry) => entry.held && groups.has(entry.group_id));
  return latest?.group_id ?? plan[0]?.group_id ?? null;
}

function isHandedIn(status: string | null | undefined): boolean {
  return status === "submitted" || status === "graded";
}

export async function fetchLessonPath(): Promise<LessonPath> {
  const [plan, syllabus, classes, homework, submissions] = await Promise.all([
    supabase
      .from("student_class_plan")
      .select(
        "group_id, lesson_id, title, unit, module, position, scheduled_on, starts_at, available, lesson_type",
      ),
    supabase
      .from("student_syllabus")
      .select("id, title, unit, module, course_order, available, lesson_type"),
    supabase
      .from("student_classes")
      .select("class_id, group_id, lesson_id, class_date, starts_at, held, present, excused"),
    supabase.from("student_homework").select("id, lesson_id, homework_type"),
    supabase.from("student_submissions").select("homework_id, status"),
  ]);
  for (const result of [plan, syllabus, classes, homework, submissions]) {
    if (result.error) throw new Error(result.error.message);
  }

  const allClasses = ((classes.data ?? []) as ClassRecord[]).sort(byNewest);
  const planRows = (plan.data ?? []) as PlanLessonRecord[];
  const groupId = pickGroup(planRows, allClasses);

  // The sequence, as the group is taught it — or the module, without a group.
  const sequence = groupId
    ? planRows
        .filter((row) => row.group_id === groupId)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        .map((row) => entryOf(row, row.lesson_id, row.scheduled_on, row.starts_at))
    : ((syllabus.data ?? []) as SyllabusRecord[])
        .sort(byCourseOrder)
        .map((row) => entryOf(row, row.id));

  const groupClasses = allClasses.filter((entry) => entry.group_id === groupId);
  const currentId = suggestNextLesson(
    sequence.map((entry) => entry.id),
    groupClasses,
  );
  // Null once the course is done, and then every lesson is behind the group.
  const currentIndex = currentId
    ? sequence.findIndex((entry) => entry.id === currentId)
    : sequence.length;

  // The ring: the live class, then each homework of the lesson.
  const attended = new Set(
    groupClasses
      .filter((entry) => entry.held && entry.present && entry.lesson_id)
      .map((entry) => entry.lesson_id!),
  );
  // The latest class of each lesson the student was marked absent from — the
  // classes are newest first, so the first one seen. Whether the class happened
  // for anybody else doesn't matter: they weren't there.
  const absentOn = new Map<string, string>();
  for (const entry of groupClasses) {
    if (entry.present === false && entry.lesson_id && !absentOn.has(entry.lesson_id)) {
      absentOn.set(entry.lesson_id, entry.class_date);
    }
  }
  const handedIn = new Set(
    ((submissions.data ?? []) as SubmissionStepRecord[])
      .filter((entry) => isHandedIn(entry.status))
      .map((entry) => entry.homework_id),
  );
  const homeworkByLesson = new Map<string, LessonStep[]>();
  const withNowYouCan = new Set<string>();
  for (const entry of (homework.data ?? []) as HomeworkStepRecord[]) {
    const steps = homeworkByLesson.get(entry.lesson_id) ?? [];
    steps.push({ kind: "homework", done: handedIn.has(entry.id) });
    homeworkByLesson.set(entry.lesson_id, steps);
    if (entry.homework_type === "now-you-can") withNowYouCan.add(entry.lesson_id);
  }

  // Lessons and checkpoints are numbered through the module; a conversation
  // shows an icon instead.
  let counted = 0;
  const numberOf = (type: LessonType) => (type === "conversation" ? null : ++counted);

  const units: PathUnit[] = [];
  sequence.forEach((entry, index) => {
    const status =
      index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming";
    const lesson: PathLesson = {
      id: entry.id,
      type: entry.type,
      status,
      number: numberOf(entry.type),
      name: entry.name,
      scheduledOn: entry.scheduledOn,
      startsAt: entry.startsAt,
      // Missed only once the group is past it, and only if no class of it has
      // had them since.
      missedOn:
        status === "done" && !attended.has(entry.id) ? (absentOn.get(entry.id) ?? null) : null,
      available: entry.available,
      nowYouCan: withNowYouCan.has(entry.id),
      steps: [
        { kind: "class", done: attended.has(entry.id) },
        ...(homeworkByLesson.get(entry.id) ?? []),
      ],
    };

    // Units in the order the sequence first reaches them.
    let unit = units.at(-1);
    if (!unit || unit.name !== entry.unit) {
      unit = { name: entry.unit, title: null, lessons: [] };
      units.push(unit);
    }
    unit.lessons.push(lesson);
    if (entry.type === "checkpoint" && !unit.title) {
      unit.title = CHECKPOINT_TITLE.exec(entry.name)?.[1]?.trim() ?? null;
    }
  });

  return {
    moduleName: sequence[0]?.module ?? null,
    units,
    currentId,
    attendance: attendancePercent(groupClasses),
    attended: attendanceTally(groupClasses),
  };
}
