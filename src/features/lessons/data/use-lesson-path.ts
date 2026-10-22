import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

import { fetchLessonPath } from "@/features/lessons/data/lesson-path";
import type { LessonPathState } from "@/features/lessons/types/lesson-path-state";

/** Loads on focus, so coming back from a lesson or a handed-in homework shows
 *  the ring moved on. Keeps the last good path on screen while it reloads. */
export function useLessonPath() {
  const [state, setState] = useState<LessonPathState>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const request = useRef(0);

  const load = useCallback(async () => {
    const id = ++request.current;
    try {
      const data = await fetchLessonPath();
      if (id === request.current) setState({ status: "ready", data });
    } catch (error) {
      if (id !== request.current) return;
      // A failed reload keeps what was already showing.
      setState((current) =>
        current.status === "ready"
          ? current
          : { status: "error", message: error instanceof Error ? error.message : String(error) },
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return { state, refreshing, refresh };
}
