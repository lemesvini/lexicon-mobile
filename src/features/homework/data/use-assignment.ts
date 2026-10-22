import { useCallback, useEffect, useRef, useState } from "react";

import { fetchAssignment, saveAnswers, submitAnswers } from "@/features/homework/data/assignment";
import type { AnswerValue } from "@/features/homework/types/answer-value";
import type { AssignmentState } from "@/features/homework/types/assignment-state";
import type { ProgressSignal } from "@/features/material/types/progress-signal";

/** After the last change, before writing — lexicon-web's use-autosave: long
 *  enough that typing an answer is one save, short enough that closing the
 *  viewer a moment after a tap doesn't lose it. */
const DELAY_MS = 800;

/**
 * A homework, the student's answers to it, and the two writes.
 *
 * Answers are saved a moment after they stop changing, and only once the
 * student has changed something — a homework opened and closed untouched writes
 * nothing. A save still waiting when the viewer closes goes out then. Handing
 * in sends every answer with it, so a save in flight can't cost one, and then
 * reloads: the server decides what a handed-in homework looks like.
 */
export function useAssignment(homeworkId: string) {
  const [state, setState] = useState<AssignmentState>({ status: "loading" });
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  // A new one for each save that lands or fails — the ring's cloud.
  const [signal, setSignal] = useState<ProgressSignal | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // What a close has to flush, kept where the cleanup can see it.
  const pending = useRef<Record<string, AnswerValue> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAssignment(homeworkId)
      .then((assignment) => {
        if (cancelled) return;
        if (!assignment) {
          setState({ status: "missing" });
          return;
        }
        setAnswers(assignment.submission.answers);
        setState({ status: "ready", assignment });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({ status: "error", message: error instanceof Error ? error.message : String(error) });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [homeworkId, reloadKey]);

  const answering =
    state.status === "ready" && state.assignment.submission.status === "in_progress";

  useEffect(() => {
    if (!pending.current || !answering) return;
    const snapshot = pending.current;
    const timer = setTimeout(() => {
      pending.current = null;
      saveAnswers(homeworkId, snapshot)
        .then(() => setSignal((last) => ({ kind: "saved", key: (last?.key ?? 0) + 1 })))
        // Nothing retries: the next change tries again, as a student would.
        .catch(() => setSignal((last) => ({ kind: "error", key: (last?.key ?? 0) + 1 })));
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, [answers, answering, homeworkId]);

  // Closing the viewer with a save still waiting sends it.
  useEffect(
    () => () => {
      if (pending.current) void saveAnswers(homeworkId, pending.current).catch(() => {});
    },
    [homeworkId],
  );

  const setAnswer = useCallback(
    (blockId: string, value: AnswerValue) => {
      if (!answering) return;
      setAnswers((current) => {
        const next = { ...current, [blockId]: value };
        pending.current = next;
        return next;
      });
    },
    [answering],
  );

  const submit = useCallback(async () => {
    setSubmitting(true);
    try {
      pending.current = null;
      await submitAnswers(homeworkId, answers);
      setReloadKey((key) => key + 1);
    } finally {
      setSubmitting(false);
    }
  }, [answers, homeworkId]);

  return { state, answers, setAnswer, answering, signal, submit, submitting };
}
