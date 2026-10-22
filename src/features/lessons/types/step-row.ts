import type { StepMarkerState } from "@/features/lessons/types/step-marker-state";

/** One of a lesson's steps — its live class, or one of its homework — as its
 *  page and the Today card show it. */
export type StepRow = {
  key: string;
  /** "Class with Teacher Vinicius", "Activities". */
  title: string;
  /** The title in a word or two, for the Today card: "Aula", "Activities". */
  label: string;
  detail: string;
  marker: StepMarkerState;
  /** A homework's row opens it; the live class's opens nothing. */
  homeworkId?: string;
  /** A "Now you can" is checked in gold once done. */
  gold?: boolean;
};
