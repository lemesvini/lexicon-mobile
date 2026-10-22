import { useCallback, useEffect, useState } from "react";

import { markPracticedToday } from "@/features/notifications/daily-practice";
import { reviewCard } from "@/features/practice/data/practice-cards";
import { SESSION_SIZE, buildSession } from "@/features/practice/session";
import type { CardOutcome } from "@/features/practice/types/card-outcome";
import type { PracticeCard } from "@/features/practice/types/practice-card";
import type { PracticeSessionState } from "@/features/practice/types/practice-session-state";
import { toDateKey } from "@/features/today/data/week";

/**
 * One sitting of practice: the cards due, one at a time, whatever the skill.
 *
 * Each card's outcome goes to the server as soon as it is given, without
 * holding up the next card — a sitting closed halfway keeps what was done. A
 * card the student got wrong comes round once more at the end, so the sitting
 * finishes on having got it.
 *
 * `load` fetches every card of the skill the student can practise; keep it a
 * stable function (a module-level one), or it loads again on every render.
 * `size` caps the sitting; `retry` false keeps a missed card from coming round
 * again in it — a whole text, re-read straight after, would be a chore.
 */
export function usePracticeSession<T extends PracticeCard>(
  load: () => Promise<T[]>,
  size: number = SESSION_SIZE,
  retry: boolean = true,
) {
  const [state, setState] = useState<PracticeSessionState<T>>({ status: "loading" });
  /** Every card loaded, not just this sitting's — listening borrows words
   *  from the others. */
  const [pool, setPool] = useState<T[]>([]);
  /** The sitting's cards, growing as missed ones are sent round again. */
  const [queue, setQueue] = useState<T[]>([]);
  const [index, setIndex] = useState(0);
  /** The last outcome per card, for the summary. */
  const [outcomes, setOutcomes] = useState<Record<string, CardOutcome>>({});
  const [failedSaves, setFailedSaves] = useState(0);

  useEffect(() => {
    let cancelled = false;
    load()
      .then((cards) => {
        if (cancelled) return;
        const session = buildSession(cards, toDateKey(new Date()), size);
        setPool(cards);
        if (session.length === 0) {
          setState({ status: "empty" });
          return;
        }
        setQueue(session);
        setState({ status: "ready", cards: session });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({ status: "error", message: error instanceof Error ? error.message : String(error) });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [load, size]);

  const current = queue[index] ?? null;
  const done = state.status === "ready" && index >= queue.length;

  // A finished sitting is the day's practice: no reminder tonight.
  useEffect(() => {
    if (done) markPracticedToday();
  }, [done]);

  /** Records the current card's outcome and moves on. */
  const answer = useCallback(
    (outcome: CardOutcome) => {
      const card = queue[index];
      if (!card) return;

      // Nothing retries: the card simply comes back on its old schedule.
      reviewCard(card, outcome).catch(() => setFailedSaves((count) => count + 1));

      const key = `${card.activityId}:${card.cardId}`;
      const secondGo = queue
        .slice(0, index)
        .some((c) => c.activityId === card.activityId && c.cardId === card.cardId);
      if (retry && outcome.rating === "forgot" && !secondGo) {
        setQueue((cards) => [...cards, card]);
      }
      setOutcomes((all) => ({ ...all, [key]: { rating: outcome.rating, score: outcome.score } }));
      setIndex((i) => i + 1);
    },
    [queue, index, retry],
  );

  return {
    state,
    pool,
    current,
    /** 0-based place in the sitting. */
    index,
    total: queue.length,
    done,
    outcomes: Object.values(outcomes),
    failedSaves,
    answer,
  };
}
