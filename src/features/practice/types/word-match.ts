import type { MatchedWord } from "@/features/practice/types/matched-word";

/** What was heard against what was meant: how much of the answer, 0–1, and
 *  which of its words. */
export type WordMatch = { score: number; words: MatchedWord[] };
