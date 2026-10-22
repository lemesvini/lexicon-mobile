import type { CardOutcome } from "@/features/practice/types/card-outcome";
import type { ListeningCard } from "@/features/practice/types/listening-card";
import type { PracticeCard } from "@/features/practice/types/practice-card";
import type { ReadingCard } from "@/features/practice/types/reading-card";
import type { ReadingQuestion } from "@/features/practice/types/reading-question";
import type { Skill } from "@/features/practice/types/skill";
import type { SpeakingCard } from "@/features/practice/types/speaking-card";
import type { WritingCard } from "@/features/practice/types/writing-card";
import { supabase } from "@/lib/supabase";

/** Where listening sentences are stored — lexicon-web 0032. */
const AUDIO_BUCKET = "practice-audio";

type Row = Record<string, unknown> & { content: Record<string, unknown> | null };

/**
 * Every card of a skill the student can practise now — the view already holds
 * back those from lessons their group hasn't had (lexicon-web 0031) — in the
 * course's order: activity by activity, card by card.
 */
async function fetchRows(skill: Skill): Promise<Row[]> {
  const { data, error } = await supabase
    .from("student_practice_cards")
    .select(
      "activity_id, activity_title, card_id, prompt, answer, example, lesson_id, lesson_title, box, due_on, content",
    )
    .eq("skill", skill)
    .order("position", { ascending: true })
    .order("activity_id", { ascending: true })
    .order("card_position", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Row[];
}

function toCard(row: Row): PracticeCard {
  return {
    activityId: row.activity_id as string,
    activityTitle: (row.activity_title as string | null) ?? "",
    cardId: row.card_id as string,
    lessonId: (row.lesson_id as string | null) ?? null,
    lessonTitle: (row.lesson_title as string | null) ?? null,
    box: (row.box as number | null) ?? null,
    dueOn: (row.due_on as string | null) ?? null,
  };
}

export async function fetchSpeakingCards(): Promise<SpeakingCard[]> {
  return (await fetchRows("speaking")).map((row) => ({
    ...toCard(row),
    prompt: row.prompt as string,
    answer: row.answer as string,
    example: (row.example as string | null) ?? null,
  }));
}

/** A card's own extra words for the bank, as the Studio wrote them. */
function distractorsOf(row: Row): string[] {
  const words = row.content?.distractors;
  return Array.isArray(words)
    ? words.filter((word): word is string => typeof word === "string" && !!word.trim())
    : [];
}

export async function fetchWritingCards(): Promise<WritingCard[]> {
  return (await fetchRows("writing")).map((row) => ({
    ...toCard(row),
    prompt: row.prompt as string,
    answer: row.answer as string,
    distractors: distractorsOf(row),
  }));
}

const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

/** A question as the Studio stored it, if it is complete enough to ask: a
 *  prompt, at least two options, and an answer among them. Drafts are skipped. */
function toQuestion(raw: unknown, index: number): ReadingQuestion[] {
  if (!raw || typeof raw !== "object") return [];
  const q = raw as Record<string, unknown>;
  const prompt = typeof q.prompt === "string" ? q.prompt.trim() : "";
  // Blank options dropped, the answer following the one it pointed at.
  const kept = strings(q.options)
    .map((option, at) => ({ option: option.trim(), at }))
    .filter(({ option }) => option);
  const answer = kept.findIndex(({ at }) => at === q.answer);
  if (!prompt || kept.length < 2 || answer === -1) return [];
  return [
    {
      id: typeof q.id === "string" ? q.id : String(index),
      prompt,
      options: kept.map(({ option }) => option),
      answer,
    },
  ];
}

export async function fetchReadingCards(): Promise<ReadingCard[]> {
  return (await fetchRows("reading")).flatMap((row) => {
    const content = row.content ?? {};
    const questions = (Array.isArray(content.questions) ? content.questions : []).flatMap(toQuestion);
    // A text with nothing to ask isn't practice yet.
    if (questions.length === 0) return [];
    return [
      {
        ...toCard(row),
        title: String(content.title ?? ""),
        level: typeof content.level === "string" ? content.level : null,
        blurb: typeof content.blurb === "string" && content.blurb.trim() ? content.blurb : null,
        paragraphs: strings(content.paragraphs).filter((p) => p.trim()),
        questions,
      },
    ];
  });
}

export async function fetchListeningCards(): Promise<ListeningCard[]> {
  return (await fetchRows("listening")).map((row) => {
    const content = row.content ?? {};
    return {
      ...toCard(row),
      text: String(content.text ?? ""),
      translation: typeof content.translation === "string" ? content.translation : null,
      audioUrl: supabase.storage.from(AUDIO_BUCKET).getPublicUrl(String(content.audioPath ?? "")).data
        .publicUrl,
      distractors: distractorsOf(row),
    };
  });
}

/** Records how a card went. The server moves it between boxes and decides
 *  when it is due back. */
export async function reviewCard(card: PracticeCard, outcome: CardOutcome): Promise<void> {
  const { error } = await supabase.rpc("review_practice_card", {
    p_activity_id: card.activityId,
    p_card_id: card.cardId,
    p_rating: outcome.rating,
    p_score: outcome.score === null ? null : Math.round(outcome.score * 100) / 100,
  });

  if (error) throw new Error(error.message);
}
