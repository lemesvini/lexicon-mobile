// A homework as the student answers it, and the two writes they make.
//
// `student_homework` gives the document with its answer key stripped (lexicon-web
// 0005), and answers only for a homework published to the student.
// `student_submissions` gives their own work, with the marking held back until
// it is graded. The writes are the database's own functions, which check both
// that the homework is theirs and that it hasn't been handed in — the same calls
// the web makes (lexicon-web/src/lib/student-content.ts).

import type { AnswerValue } from "@/features/homework/types/answer-value";
import type { Assignment } from "@/features/homework/types/assignment";
import type { AssignmentSubmission } from "@/features/homework/types/assignment-submission";
import type { ExerciseItem } from "@/features/homework/types/exercise-item";
import type { MaterialBlock } from "@/features/material/types/material-block";
import type { ExerciseBlock } from "@/features/homework/types/exercise-block";
import { supabase } from "@/lib/supabase";

/** The blocks a student answers — lexicon-web's EXERCISE_BLOCK_ORDER. */
const EXERCISES = new Set(["finish-sentence", "choose-description", "find-mistake", "long-answer"]);

type Document = {
  context?: string;
  slides?: { blocks?: (MaterialBlock | ExerciseBlock)[] }[];
};

type SubmissionRecord = {
  status: string | null;
  answers: Record<string, AnswerValue> | null;
  marks: Record<string, boolean> | null;
  answer_key: Record<string, AnswerValue> | null;
  score: number | null;
  feedback: string | null;
  block_notes: Record<string, string> | null;
};

export function isExercise(block: MaterialBlock | ExerciseBlock): block is ExerciseBlock {
  return EXERCISES.has(block.type);
}

/**
 * The homework's slides flattened into its pages, the questions numbered among
 * themselves — lexicon-web's `exerciseItems`. A question without an id cannot
 * hold an answer, so it is read rather than answered.
 */
export function exerciseItems(document: Document | null): ExerciseItem[] {
  const blocks = (document?.slides ?? [])
    .flatMap((slide) => slide.blocks ?? [])
    .filter((block) => block.audience !== "teacher");
  let number = 0;
  return blocks.map((block): ExerciseItem =>
    isExercise(block) && block.id
      ? { answerable: true, block, id: block.id, number: ++number }
      : { answerable: false, block: block as MaterialBlock },
  );
}

/** A written answer of only spaces is not an answer. */
export function isAnswered(value: AnswerValue | undefined): boolean {
  if (value === undefined) return false;
  return typeof value === "string" ? value.trim() !== "" : true;
}

function toSubmission(record: SubmissionRecord | null): AssignmentSubmission {
  return {
    status:
      record?.status === "submitted" || record?.status === "graded" ? record.status : "in_progress",
    answers: record?.answers ?? {},
    marks: record?.marks ?? {},
    answerKey: record?.answer_key ?? {},
    score: record?.score ?? null,
    feedback: record?.feedback?.trim() || null,
    blockNotes: record?.block_notes ?? {},
  };
}

export async function fetchAssignment(homeworkId: string): Promise<Assignment | null> {
  const [homework, submission] = await Promise.all([
    supabase
      .from("student_homework")
      .select("id, homework_type, document")
      .eq("id", homeworkId)
      .maybeSingle(),
    supabase
      .from("student_submissions")
      .select("status, answers, marks, answer_key, score, feedback, block_notes")
      .eq("homework_id", homeworkId)
      .maybeSingle(),
  ]);
  if (homework.error) throw new Error(homework.error.message);
  if (submission.error) throw new Error(submission.error.message);
  if (!homework.data) return null;

  const document = homework.data.document as Document | null;
  return {
    id: homeworkId,
    type: homework.data.homework_type === "now-you-can" ? "now-you-can" : "activities",
    instructions: document?.context?.trim() || null,
    items: exerciseItems(document),
    submission: toSubmission(submission.data as SubmissionRecord | null),
  };
}

/** Work in progress. Refused once it has been handed in. */
export async function saveAnswers(homeworkId: string, answers: Record<string, AnswerValue>) {
  const { error } = await supabase.rpc("save_homework_answers", {
    p_homework_id: homeworkId,
    p_answers: answers,
  });
  if (error) throw new Error(error.message);
}

/** Hands it in: the server locks the answers and marks what it can. */
export async function submitAnswers(homeworkId: string, answers: Record<string, AnswerValue>) {
  const { error } = await supabase.rpc("submit_homework", {
    p_homework_id: homeworkId,
    p_answers: answers,
  });
  if (error) throw new Error(error.message);
}
