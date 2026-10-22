// The student's own context, read from their side — lexicon-web's
// src/features/learn/data/student-context.ts, which this mirrors.
//
// `students.notes` is one free-text field holding two different things: what
// staff keep on a student and the blocks the onboarding form appends (lexicon-web
// 0012). RLS lets a student read their own row, so the filtering has to happen
// here — the app shows the answers they gave, never the teacher's working notes
// about them.

import type { AnswerKind } from "@/features/context/types/answer-kind";
import type { ContextAnswer } from "@/features/context/types/context-answer";
import type { ContextBlock } from "@/features/context/types/context-block";
import { supabase } from "@/lib/supabase";

/** What the database will take (lexicon-web 0021), so the form can say so first. */
export const MAX_TITLE = 120;
export const MAX_BODY = 2000;

/** The marker `buildOnboardingSummary` writes above each block it appends. */
const HEADING = /^---\s*(.+?)\s*---$/;
/** The date at the end of a heading: "(2026-08-30)" from onboarding, or
 *  "(aluno, 2026-10-01)" on a note the student added (lexicon-web 0021). */
const HEADING_DATE = /\((aluno,\s*)?(\d{4}-\d{2}-\d{2})\)$/;

/** The blocks the student wrote themselves. Anything outside a `--- ... ---`
 *  heading is staff-written prose and is dropped, as is any block that isn't a
 *  run of Q:/A: lines. */
export function parseOwnContext(notes: string): ContextBlock[] {
  const blocks: ContextBlock[] = [];
  let current: ContextBlock | null = null;
  let question: string | null = null;

  for (const raw of notes.split("\n")) {
    const line = raw.trim();
    const heading = HEADING.exec(line);

    if (heading) {
      const title = heading[1]!;
      const dated = HEADING_DATE.exec(title);
      current = {
        title,
        date: dated?.[2] ?? null,
        isNote: Boolean(dated?.[1]),
        answers: [],
      };
      blocks.push(current);
      question = null;
      continue;
    }

    if (!current) continue;

    if (line.startsWith("Q:")) {
      question = line.slice(2).trim();
    } else if (line.startsWith("A:") && question) {
      current.answers.push({ question, answer: line.slice(2).trim() });
      question = null;
    } else if (line && !question && current.answers.length > 0) {
      // A wrapped answer: a note of the student's own can run to several
      // paragraphs, all after one `A:`.
      const last = current.answers[current.answers.length - 1]!;
      last.answer = `${last.answer}\n${line}`;
    }
  }

  return blocks.filter((block) => block.answers.length > 0);
}

/** The onboarding's questions, as lexicon-web's
 *  src/features/onboarding/questions.ts asks them. The interests' answer is the
 *  picked chips joined with ", " (`buildOnboardingSummary`). */
const QUESTIONS: Record<string, AnswerKind> = {
  "O que te motiva a estudar inglês?": "motivation",
  Interesses: "interests",
  "Como é uma semana normal para você?": "routine",
};

export function answerKind(entry: ContextAnswer): AnswerKind {
  return QUESTIONS[entry.question] ?? "note";
}

/** The interests, one by one, when this is the interests answer; null for
 *  any other. */
export function interestsOf(entry: ContextAnswer): string[] | null {
  if (answerKind(entry) !== "interests") return null;
  return entry.answer
    .split(",")
    .map((interest) => interest.trim())
    .filter(Boolean);
}

export async function fetchMyContext(): Promise<ContextBlock[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return [];

  const { data, error } = await supabase
    .from("students")
    .select("notes")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return parseOwnContext(data?.notes ?? "");
}

/** Appends a note of the student's own. Through an RPC because a student
 *  cannot write their `students` row (lexicon-web 0021) — and append-only:
 *  there is no edit and no delete. */
export async function addContextNote(title: string, body: string): Promise<void> {
  const { error } = await supabase.rpc("add_student_context_note", {
    note_title: title,
    note_body: body,
  });
  if (error) throw new Error(error.message);
}
