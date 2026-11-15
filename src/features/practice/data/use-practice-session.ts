import { useCallback, useEffect, useRef, useState } from "react";

import { track } from "@/features/analytics/posthog";
import { markPracticedToday } from "@/features/notifications/daily-practice";
import { reviewCard } from "@/features/practice/data/practice-cards";
import { SESSION_SIZE, buildSession } from "@/features/practice/session";
import type { CardOutcome } from "@/features/practice/types/card-outcome";
import type { PracticeCard } from "@/features/practice/types/practice-card";
import type { PracticeSessionState } from "@/features/practice/types/practice-session-state";
import type { Skill } from "@/features/practice/types/skill";
import { toDateKey } from "@/features/today/data/week";

function secondsSince(start: number): number {
  return Math.round((Date.now() - start) / 1000);
}

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
 * `skill` names the sitting in analytics: finished or closed halfway.
 */
export function usePracticeSession<T extends PracticeCard>(
  skill: Skill,
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

  // Analytics. The clock starts when the cards are on screen; the latest
  // progress is kept where the unmount can read it.
  const startedAt = useRef<number | null>(null);
  const progress = useRef({ answered: 0, total: 0, done: false });
  useEffect(() => {
    progress.current = { answered: index, total: queue.length, done };
  }, [index, queue.length, done]);

  useEffect(() => {
    if (state.status === "ready") startedAt.current = Date.now();
  }, [state.status]);

  useEffect(() => {
    if (!done || startedAt.current === null) return;
    const last = Object.values(outcomes);
    track("practice_completed", {
      skill,
      cards: last.length,
      remembered: last.filter((o) => o.rating === "remembered").length,
      almost: last.filter((o) => o.rating === "almost").length,
      forgot: last.filter((o) => o.rating === "forgot").length,
      duration_seconds: secondsSince(startedAt.current),
    });
    // Once, when the sitting ends; outcomes are final by then.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, skill]);

  useEffect(
    () => () => {
      const { answered, total, done: finished } = progress.current;
      if (startedAt.current === null || finished) return;
      track("practice_abandoned", {
        skill,
        answered,
        cards_total: total,
        duration_seconds: secondsSince(startedAt.current),
      });
    },
    [skill],
  );

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
