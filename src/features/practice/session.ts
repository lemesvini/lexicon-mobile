import type { PracticeCard } from "@/features/practice/types/practice-card";

/** How many cards one sitting holds — a few minutes, not a chore. */
export const SESSION_SIZE = 12;

/** Reading's: a text is several cards' worth on its own. */
export const READING_SESSION_SIZE = 2;

/**
 * The cards for one sitting: those coming back first, longest overdue first,
 * then new ones in the course's order — reviewing what was learnt before
 * piling on more.
 */
export function buildSession<T extends PracticeCard>(
  cards: T[],
  today: string,
  size: number = SESSION_SIZE,
): T[] {
  const review = cards
    .filter((card) => card.dueOn !== null && card.dueOn <= today)
    .sort((a, b) => (a.dueOn! < b.dueOn! ? -1 : a.dueOn! > b.dueOn! ? 1 : 0));
  const fresh = cards.filter((card) => card.dueOn === null);
  return [...review, ...fresh].slice(0, size);
}
