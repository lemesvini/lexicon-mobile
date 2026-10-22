// One lesson, as its page shows it: what it is, how its live class went for the
// student, its homework, and the steps of its material.
//
// Six reads of views scoped to the signed-in student, all for this one lesson,
// so they go out together. A lesson that is neither on their group's plan nor
// in their module's syllabus comes back as null — not theirs, or not there,
// which the page doesn't tell apart (as on the web).

import { liveClassOf } from "@/features/lessons/data/live-class";
import { byNewest } from "@/features/lessons/data/next-lesson";
import type { ClassRecord } from "@/features/lessons/types/class-record";
import type { LessonDetail } from "@/features/lessons/types/lesson-detail";
import type { LessonPlanRecord } from "@/features/lessons/types/lesson-plan-record";
import type { MaterialRecord } from "@/features/lessons/types/material-record";
import { listHomework } from "@/features/today/data/week";
import { splitTitle } from "@/lib/lesson-title";
import { supabase } from "@/lib/supabase";

export async function fetchLessonDetail(lessonId: string): Promise<LessonDetail | null> {
  const [plan, syllabus, material, presentation, classes, homework] = await Promise.all([
    supabase
      .from("student_class_plan")
      .select("group_id, title, unit, can_do, scheduled_on, starts_at, teacher_first_name")
      .eq("lesson_id", lessonId),
    supabase.from("student_syllabus").select("title, unit").eq("id", lessonId).maybeSingle(),
    supabase.from("student_lessons").select("id, document").eq("id", lessonId).maybeSingle(),
    // Only whether there is one — the deck itself is the viewer's to load.
    supabase.from("student_presentations").select("id").eq("id", lessonId).maybeSingle(),
    supabase
      .from("student_classes")
      .select("class_id, group_id, lesson_id, class_date, starts_at, held, present, excused")
      .eq("lesson_id", lessonId),
    listHomework([lessonId]),
  ]);
  for (const result of [plan, syllabus, material, presentation, classes]) {
    if (result.error) throw new Error(result.error.message);
  }

  const allClasses = ((classes.data ?? []) as ClassRecord[]).sort(byNewest);
  const planRows = (plan.data ?? []) as LessonPlanRecord[];
  // In more than one group with this lesson: the one that has had a class of it.
  const planRow =
    planRows.find((row) => allClasses.some((entry) => entry.group_id === row.group_id)) ??
    planRows[0];

  const title = planRow?.title ?? syllabus.data?.title;
  if (title == null) return null;

  const document = (material.data as MaterialRecord | null)?.document ?? null;
  const { label, name } = splitTitle(title);
  const groupClasses = planRow
    ? allClasses.filter((entry) => entry.group_id === planRow.group_id)
    : allClasses;

  return {
    id: lessonId,
    label,
    name,
    unit: (planRow?.unit ?? syllabus.data?.unit ?? "").trim(),
    canDo: planRow?.can_do?.trim() || document?.minorCanDo?.trim() || null,
    teacherFirstName: planRow?.teacher_first_name ?? null,
    liveClass: liveClassOf(groupClasses, planRow),
    homework,
    steps: (document?.slides ?? []).map((slide, index) => ({
      stage: slide.stage?.trim() || `Etapa ${index + 1}`,
      goal: slide.goal?.trim() || null,
    })),
    hasPresentation: presentation.data !== null,
  };
}
