import { overlap } from "@/features/practice/match";
import type { CardOutcome } from "@/features/practice/types/card-outcome";
import type { WordChip } from "@/features/practice/types/word-chip";

// A sentence as words to tap, Duolingo's way — heard (listening) or read in
// Portuguese (writing): the sentence's own
// words, a few that aren't in it, all shuffled. Checking ignores capitals and
// punctuation — "Could" and "could", "is?" and "is" — since the bank shows
// words, not the sentence's typography.

/** How many words that aren't in the sentence join the bank. */
const EXTRA_WORDS = 3;

/** When there aren't enough other sentences to borrow from. */
const FALLBACK_WORDS = ["the", "a", "is", "to", "you", "it", "on", "at", "do", "my", "are", "in"];

/** A word as it is compared: lower case, no punctuation round it. */
export function plainWord(word: string): string {
  return word
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/^[^\p{L}\p{N}']+|[^\p{L}\p{N}']+$/gu, "");
}

/** The sentence's words as they are shown on the chips: punctuation off the
 *  ends, capitals kept — "Could", "you", "is". */
export function sentenceWords(text: string): string[] {
  return text
    .split(/\s+/)
    .map((word) => word.replace(/^[^\p{L}\p{N}']+|[^\p{L}\p{N}']+$/gu, ""))
    .filter(Boolean);
}

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/**
 * The bank for one sentence: its words plus a few others, shuffled. The others
 * are the Studio's own (`distractors`) when it chose some; otherwise borrowed
 * from `others`, the student's other sentences — words of the same course, so
 * they look like they might belong.
 */
export function buildBank(sentence: string, distractors: string[], others: string[]): WordChip[] {
  const words = sentenceWords(sentence);
  const own = new Set(words.map(plainWord));

  const chosen = distractors.map((word) => word.trim()).filter((word) => !own.has(plainWord(word)));
  let extras = chosen;
  if (extras.length === 0) {
    // Plain word → how it is shown: lower case, as it would sit mid-sentence,
    // except "I" and its contractions.
    const borrowed = new Map<string, string>();
    for (const other of others) {
      for (const word of sentenceWords(other)) {
        const plain = plainWord(word);
        if (plain && !own.has(plain) && !borrowed.has(plain)) {
          borrowed.set(plain, /^I($|')/.test(word) ? word : word.toLowerCase());
        }
      }
    }
    const candidates =
      borrowed.size >= EXTRA_WORDS
        ? [...borrowed.values()]
        : FALLBACK_WORDS.filter((word) => !own.has(word));
    extras = shuffle(candidates).slice(0, EXTRA_WORDS);
  }

  return shuffle([...words, ...extras]).map((text, index) => ({ id: `${index}:${text}`, text }));
}

/**
 * How the rebuilt sentence did: every word in place is right; most of them in
 * order, almost; otherwise, wrong.
 */
export function checkSentence(text: string, chosen: WordChip[]): CardOutcome {
  const target = sentenceWords(text).map(plainWord);
  const given = chosen.map((chip) => plainWord(chip.text));
  if (target.length === given.length && target.every((word, i) => word === given[i])) {
    return { rating: "remembered", score: 1 };
  }
  // Extra words cost as much as missing ones: the longer of the two is the
  // measure, so tapping every chip can't pass.
  const score = (overlap(target, given) * target.length) / Math.max(target.length, given.length);
  return { rating: score >= 0.75 ? "almost" : "forgot", score };
}
