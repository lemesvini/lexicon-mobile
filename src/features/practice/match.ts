import type { CardRating } from "@/features/practice/types/card-rating";
import type { MatchedWord } from "@/features/practice/types/matched-word";
import type { WordMatch } from "@/features/practice/types/word-match";

// What the recognizer heard against the card's answer, word by word.
//
// Both sides are brought to the same plain form first — lower case, no
// punctuation, contractions spelled out, small numbers as words — so "I'm" and
// "I am", or "2" and "two", count as the same thing said. Then the words are
// lined up in order (the longest common subsequence): a word said in the wrong
// place doesn't count, an extra "uh" in between doesn't hurt.

/** At least this much of the answer heard: remembered. */
const REMEMBERED = 0.9;
/** At least this much: almost. Below it, forgotten. */
const ALMOST = 0.6;

const CONTRACTIONS: [RegExp, string][] = [
  [/\bcan't\b/g, "can not"],
  [/\bcannot\b/g, "can not"],
  [/\bwon't\b/g, "will not"],
  [/\bshan't\b/g, "shall not"],
  [/n't\b/g, " not"],
  [/'re\b/g, " are"],
  [/'m\b/g, " am"],
  [/'ll\b/g, " will"],
  [/'ve\b/g, " have"],
  [/'d\b/g, " would"],
  // Possessive or "is", the same on both sides either way.
  [/'s\b/g, " is"],
];

const NUMBERS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen", "twenty",
];

/** A sentence as the words that count. */
export function wordsOf(text: string): string[] {
  let plain = text.toLowerCase().replace(/[’‘`]/g, "'");
  for (const [pattern, replacement] of CONTRACTIONS) plain = plain.replace(pattern, replacement);
  return plain
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/'/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => (/^\d+$/.test(word) && Number(word) <= 20 ? NUMBERS[Number(word)]! : word));
}

/** Which of `target`'s words appear, in order, in `heard`. */
function align(target: string[], heard: string[]): boolean[] {
  // lengths[i][j]: the longest common run of target[i..] and heard[j..].
  const lengths = Array.from({ length: target.length + 1 }, () =>
    new Array<number>(heard.length + 1).fill(0),
  );
  for (let i = target.length - 1; i >= 0; i--) {
    for (let j = heard.length - 1; j >= 0; j--) {
      lengths[i]![j] =
        target[i] === heard[j]
          ? lengths[i + 1]![j + 1]! + 1
          : Math.max(lengths[i + 1]![j]!, lengths[i]![j + 1]!);
    }
  }

  const matched = new Array<boolean>(target.length).fill(false);
  let i = 0;
  let j = 0;
  while (i < target.length && j < heard.length) {
    if (target[i] === heard[j]) {
      matched[i] = true;
      i++;
      j++;
    } else if (lengths[i + 1]![j]! >= lengths[i]![j + 1]!) {
      i++;
    } else {
      j++;
    }
  }
  return matched;
}

/**
 * How much of `answer` is in what was heard. The recognizer offers a few
 * guesses at what was said; the one closest to the answer is the one that
 * counts — a student who said it right shouldn't lose to the recognizer's
 * first guess.
 *
 * The words come back as the answer spells them, so the card can show which
 * were heard.
 */
export function matchAnswer(answer: string, alternatives: string[]): WordMatch & { heard: string } {
  // The answer's own words, kept as written for showing, alongside their plain
  // form for comparing. A word that becomes two ("I'm" → "i am") is heard only
  // when both halves are.
  const shown = answer.trim().split(/\s+/).filter(Boolean);
  const pieces = shown.map((word) => wordsOf(word));
  const target = pieces.flat();

  let best: { score: number; words: MatchedWord[]; heard: string } = {
    score: 0,
    words: shown.map((text) => ({ text, matched: false })),
    heard: alternatives[0] ?? "",
  };
  if (target.length === 0) return { ...best, score: 1 };

  for (const heard of alternatives) {
    const flags = align(target, wordsOf(heard));
    const score = flags.filter(Boolean).length / target.length;
    // Strictly better only: on a tie, the recognizer's likelier guess stays.
    if (score <= best.score) continue;

    let at = 0;
    const words = shown.map((text, index) => {
      const count = pieces[index]!.length;
      const matched = count === 0 || flags.slice(at, at + count).every(Boolean);
      at += count;
      return { text, matched };
    });
    best = { score, words, heard };
  }

  return best;
}

/** How much of `target` appears, in order, in `given` (both already plain
 *  words): 0–1. */
export function overlap(target: string[], given: string[]): number {
  if (target.length === 0) return 1;
  return align(target, given).filter(Boolean).length / target.length;
}

export function ratingFor(score: number): CardRating {
  if (score >= REMEMBERED) return "remembered";
  if (score >= ALMOST) return "almost";
  return "forgot";
}
