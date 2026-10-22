// The Today screen's data: the student's next class, and what's on this week.
//
// The class plan comes from `student_class_plan`
// (lexicon-web/supabase/migrations/0026_student_class_plan.sql), homework from
// `student_homework` and `student_submissions`. All three are views already
// scoped to the signed-in student, so nothing here filters by who is asking.
//
// Everything here goes by the plan's dates (`scheduled_on`), not by the
// register: the next class is the first one dated today or later, and a class
// dated in the past counts as having happened. The register isn't reliably
// taken yet, so "first untaught lesson" pointed at Lesson One for a group well
// into the course.

import { liveClassOf } from "@/features/lessons/data/live-class";
import { byNewest } from "@/features/lessons/data/next-lesson";
import type { ClassRecord } from "@/features/lessons/types/class-record";
import type { LessonProgress } from "@/features/lessons/types/lesson-progress";
import type { HomeworkRecord } from "@/features/today/types/homework-record";
import type { HomeworkStatus } from "@/features/today/types/homework-status";
import type { PlanRecord } from "@/features/today/types/plan-record";
import type { PlannedClass } from "@/features/today/types/planned-class";
import type { SubmissionRecord } from "@/features/today/types/submission-record";
import type { TodayData } from "@/features/today/types/today-data";
import type { WeekHomework } from "@/features/today/types/week-homework";
import { splitTitle } from "@/lib/lesson-title";
import { supabase } from "@/lib/supabase";

/** The blocks a student answers (lexicon-web's EXERCISE_BLOCK_ORDER). */
const EXERCISE_TYPES = new Set([
  "finish-sentence",
  "choose-description",
  "find-mistake",
  "long-answer",
]);

export function toDateKey(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/** A Postgres `date` as a local calendar day — `new Date("2026-10-01")` would
 *  be UTC midnight, which is the day before anywhere in Brazil. */
export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

function weekOf(today: Date): { start: string; end: string } {
  const monday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: toDateKey(monday), end: toDateKey(sunday) };
}

/** Earliest day first; undated last. */
function byDay(a: PlannedClass, b: PlannedClass): number {
  if (a.scheduledOn !== b.scheduledOn) {
    if (!a.scheduledOn) return 1;
    if (!b.scheduledOn) return -1;
    return a.scheduledOn < b.scheduledOn ? -1 : 1;
  }
  return (a.startsAt ?? "").localeCompare(b.startsAt ?? "");
}

function toPlannedClass(record: PlanRecord): PlannedClass {
  return {
    groupId: record.group_id,
    lessonId: record.lesson_id,
    ...splitTitle(record.title ?? ""),
    unit: record.unit ?? "",
    position: record.position ?? 0,
    scheduledOn: record.scheduled_on,
    startsAt: record.starts_at ? record.starts_at.slice(0, 5) : null,
    teacherFirstName: record.teacher_first_name,
    canDo: record.can_do,
    grammarFocus: Array.isArray(record.grammar_focus)
      ? record.grammar_focus.filter(
          (item): item is string =>
            typeof item === "string" && item.trim() !== "",
        )
      : [],
  };
}

function questionIds(document: HomeworkRecord["document"]): string[] {
  return (document?.slides ?? [])
    .flatMap((slide) => slide.blocks ?? [])
    .filter((block) => block.type && EXERCISE_TYPES.has(block.type) && block.id)
    .map((block) => block.id!);
}

function isAnswered(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  return typeof value === "string" ? value.trim() !== "" : true;
}

/** The homework of these lessons, with how far the student has got in each.
 *  Also what the lesson page lists under its live class. */
export async function listHomework(lessonIds: string[]): Promise<WeekHomework[]> {
  if (lessonIds.length === 0) return [];

  const { data, error } = await supabase
    .from("student_homework")
    .select("id, title, lesson_id, lesson_title, homework_type, document")
    .in("lesson_id", lessonIds);
  if (error) throw new Error(error.message);

  const homework = (data ?? []) as HomeworkRecord[];
  if (homework.length === 0) return [];

  const { data: submissionData, error: submissionError } = await supabase
    .from("student_submissions")
    .select("homework_id, status, answers, score, graded_at")
    .in(
      "homework_id",
      homework.map((h) => h.id),
    );
  if (submissionError) throw new Error(submissionError.message);

  const submissions = new Map(
    ((submissionData ?? []) as SubmissionRecord[]).map((s) => [
      s.homework_id,
      s,
    ]),
  );
  // In the order the lessons were passed in, which is the order they're taught.
  const rank = (lessonId: string) => lessonIds.indexOf(lessonId);

  return homework
    .sort(
      (a, b) =>
        rank(a.lesson_id) - rank(b.lesson_id) ||
        (a.title ?? "").localeCompare(b.title ?? ""),
    )
    .map((h) => {
      const submission = submissions.get(h.id);
      const ids = questionIds(h.document);
      const answers = submission?.answers ?? {};
      const status: HomeworkStatus =
        submission?.status === "graded" || submission?.status === "submitted"
          ? submission.status
          : submission
            ? "in_progress"
            : "todo";

      return {
        id: h.id,
        title: h.title?.trim() || "Homework",
        lessonId: h.lesson_id,
        type: h.homework_type === "now-you-can" ? "now-you-can" : "activities",
        lessonName: splitTitle(h.lesson_title ?? "").name,
        total: ids.length,
        answered: ids.filter((id) => isAnswered(answers[id])).length,
        status,
        score: status === "graded" ? (submission?.score ?? null) : null,
        gradedAt: status === "graded" ? (submission?.graded_at ?? null) : null,
      };
    });
}

/** Where the student stands in a class on their plan — the same steps, read
 *  the same way, as on its lesson page. */
async function fetchProgress(lesson: PlannedClass): Promise<LessonProgress> {
  const [classes, homework] = await Promise.all([
    supabase
      .from("student_classes")
      .select("class_id, group_id, lesson_id, class_date, starts_at, held, present, excused")
      .eq("lesson_id", lesson.lessonId)
      .eq("group_id", lesson.groupId),
    listHomework([lesson.lessonId]),
  ]);
  if (classes.error) throw new Error(classes.error.message);

  return {
    liveClass: liveClassOf(((classes.data ?? []) as ClassRecord[]).sort(byNewest), {
      scheduled_on: lesson.scheduledOn,
      starts_at: lesson.startsAt,
    }),
    homework,
  };
}

export async function fetchToday(now = new Date()): Promise<TodayData> {
  const { data, error } = await supabase
    .from("student_class_plan")
    .select(
      "group_id, lesson_id, title, unit, position, scheduled_on, starts_at, teacher_first_name, can_do, grammar_focus",
    );
  if (error) throw new Error(error.message);

  const plan = ((data ?? []) as PlanRecord[]).map(toPlannedClass).sort(byDay);
  const todayKey = toDateKey(now);

  const next =
    plan.find((row) => row.scheduledOn && row.scheduledOn >= todayKey) ?? null;

  const { start, end } = weekOf(now);
  const classes = plan.filter(
    (row) =>
      row.scheduledOn && row.scheduledOn >= start && row.scheduledOn <= end,
  );

  // Homework for the classes that have already happened this week, plus the
  // last class before it — that one's homework is what's due now. A lesson
  // later this week hasn't been given yet, so its homework isn't either.
  const past = plan.filter((row) => row.scheduledOn && row.scheduledOn < start);
  const lessonIds = [
    ...new Set(
      [
        ...past.slice(-1),
        ...classes.filter((row) => row.scheduledOn! <= todayKey),
      ].map((row) => row.lessonId),
    ),
  ];

  const [homework, nextProgress] = await Promise.all([
    listHomework(lessonIds),
    next ? fetchProgress(next) : null,
  ]);

  return {
    hasPlan: plan.length > 0,
    next,
    nextProgress,
    week: { start, end, classes, homework },
  };
}
