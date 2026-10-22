import type { LiveClass } from "@/features/lessons/types/live-class";
import type { StepRow } from "@/features/lessons/types/step-row";
import { formatOnDay, formatWhen } from "@/features/today/format";
import type { HomeworkType } from "@/features/today/types/homework-type";
import type { WeekHomework } from "@/features/today/types/week-homework";

/** The step's name, by the homework's type — the Studio's names. */
const HOMEWORK_STEP: Record<HomeworkType, string> = {
  activities: "Activities",
  "now-you-can": "Now you can",
};

function liveClassRow(live: LiveClass, teacher: string | null): StepRow {
  // "Aula com teacher Vinicius"; a student off a plan has no teacher to name.
  const base = {
    key: "class",
    title: teacher ? `Class with Teacher ${teacher}` : "Aula",
    label: "Aula",
  };
  switch (live.status) {
    case "attended":
      return { ...base, marker: "done", detail: `Assistida ${formatOnDay(live.day)}` };
    case "missed":
      return { ...base, marker: "missed", detail: `Você faltou ${formatOnDay(live.day)}` };
    case "taught":
      return { ...base, marker: "empty", detail: `Dada ${formatOnDay(live.day)}` };
    case "scheduled":
      return { ...base, marker: "empty", detail: formatWhen(live.day, live.startsAt) };
    case "unscheduled":
      return { ...base, marker: "empty", detail: "Data a definir" };
  }
}

function homeworkRow(homework: WeekHomework): StepRow {
  const base = {
    key: homework.id,
    title: HOMEWORK_STEP[homework.type],
    label: HOMEWORK_STEP[homework.type],
    homeworkId: homework.id,
    gold: homework.type === "now-you-can",
  };
  switch (homework.status) {
    case "graded":
      return {
        ...base,
        marker: "done",
        detail: homework.score === null ? "Corrigido" : `Corrigido · nota ${homework.score}`,
      };
    case "submitted":
      return { ...base, marker: "done", detail: "Entregue · aguardando correção" };
    case "in_progress":
      return {
        ...base,
        marker: "partial",
        detail: `${homework.answered} de ${homework.total} respondidas`,
      };
    case "todo":
      return {
        ...base,
        marker: "empty",
        detail:
          homework.total === 0
            ? "Para fazer"
            : `${homework.total} ${homework.total === 1 ? "questão" : "questões"}`,
      };
  }
}

/** A lesson's steps, in order: its live class, then each homework. */
export function stepRows(
  liveClass: LiveClass,
  teacher: string | null,
  homework: readonly WeekHomework[],
): StepRow[] {
  return [liveClassRow(liveClass, teacher), ...homework.map(homeworkRow)];
}

/** The step to go on with: the first not yet done, or begun and not handed
 *  in. A missed class is past doing. -1 once there is none left. */
export function currentStep(rows: readonly StepRow[]): number {
  return rows.findIndex((row) => row.marker === "empty" || row.marker === "partial");
}
