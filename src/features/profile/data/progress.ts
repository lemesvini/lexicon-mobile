// The Me tab's progress card: attendance and checkpoints from the Path tab's
// own data, and the teacher's unit reports from `student_reports`
// (lexicon-web 0035) — scoped to the signed-in student by the view.

import { fetchLessonPath } from "@/features/lessons/data/lesson-path";
import type { Progress } from "@/features/profile/types/progress";
import type { ProgressReport } from "@/features/profile/types/progress-report";
import type { ReportRecord } from "@/features/profile/types/report-record";
import { supabase } from "@/lib/supabase";

const REPORT_COLUMNS = "id, module_id, module, unit, observations, test_score, updated_at";

function reportOf(record: ReportRecord): ProgressReport {
  return {
    id: record.id,
    moduleName: record.module ?? "",
    unit: record.unit,
    observations: record.observations?.trim() ?? "",
    testScore: record.test_score === null ? null : Number(record.test_score),
    updatedAt: record.updated_at,
  };
}

export async function fetchProgress(): Promise<Progress> {
  const [path, reports] = await Promise.all([
    fetchLessonPath(),
    supabase.from("student_reports").select(REPORT_COLUMNS).order("unit"),
  ]);
  if (reports.error) throw new Error(reports.error.message);

  const lessons = path.units.flatMap((unit) => unit.lessons);
  const checkpoints = lessons.filter((lesson) => lesson.type === "checkpoint");
  const currentUnit =
    path.units.find((unit) => unit.lessons.some((lesson) => lesson.id === path.currentId)) ??
    path.units.at(-1);

  return {
    moduleName: path.moduleName,
    unitName: currentUnit?.name || null,
    attended: path.attended,
    checkpoints: {
      done: checkpoints.filter((lesson) => lesson.status === "done").length,
      total: checkpoints.length,
    },
    reports: ((reports.data ?? []) as ReportRecord[]).map(reportOf),
  };
}

/** One report, or null when it isn't the student's (or no longer exists). */
export async function fetchReport(id: string): Promise<ProgressReport | null> {
  const { data, error } = await supabase
    .from("student_reports")
    .select(REPORT_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? reportOf(data as ReportRecord) : null;
}
