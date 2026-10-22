import type { CardRating } from "@/features/practice/types/card-rating";

// The schedule itself is the server's: `review_practice_card` in lexicon-web's
// supabase/migrations/0031_practice.sql moves a card between boxes and sets the
// day it is due back. The app only names the ratings — in each skill's words.

/** Speaking: whether the student remembered how to say it. */
export const RATING_LABELS: Record<CardRating, string> = {
  forgot: "Não lembrei",
  almost: "Quase",
  remembered: "Lembrei",
};

/** Reading: how many of a text's questions were right — all, most, or fewer. */
export const READING_LABELS: Record<CardRating, string> = {
  forgot: "Revisar",
  almost: "Quase",
  remembered: "Tudo certo",
};

/** Listening and writing: whether the sentence was put together right. */
export const SENTENCE_LABELS: Record<CardRating, string> = {
  forgot: "Errei",
  almost: "Quase",
  remembered: "Acertei",
};
