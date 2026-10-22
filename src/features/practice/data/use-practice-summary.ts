import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

import { SESSION_SIZE, buildSession } from "@/features/practice/session";
import type { PracticeCard } from "@/features/practice/types/practice-card";
import { toDateKey } from "@/features/today/data/week";

/**
 * How many cards a sitting would hold right now, for the Practice tab's card;
 * null until known. Reloads on focus, so coming back from a sitting shows
 * fewer. `load` must be stable — a module-level fetch.
 */
export function useDueCount(load: () => Promise<PracticeCard[]>, size: number = SESSION_SIZE) {
  const [due, setDue] = useState<number | null>(null);
  const request = useRef(0);

  useFocusEffect(
    useCallback(() => {
      const id = ++request.current;
      load()
        .then((cards) => {
          if (id === request.current) setDue(buildSession(cards, toDateKey(new Date()), size).length);
        })
        // A failed reload keeps what was showing.
        .catch(() => {});
    }, [load, size]),
  );

  return due;
}
