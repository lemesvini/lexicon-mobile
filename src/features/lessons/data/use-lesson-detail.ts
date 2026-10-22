import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

import { fetchLessonDetail } from "@/features/lessons/data/lesson-detail";
import type { LessonDetailState } from "@/features/lessons/types/lesson-detail-state";

/** Loads on focus, so coming back from a homework shows it handed in. Keeps
 *  the last good lesson on screen while it reloads. */
export function useLessonDetail(lessonId: string) {
  const [state, setState] = useState<LessonDetailState>({ status: "loading" });
  const request = useRef(0);

  const load = useCallback(async () => {
    const id = ++request.current;
    try {
      const data = await fetchLessonDetail(lessonId);
      if (id !== request.current) return;
      setState(data ? { status: "ready", data } : { status: "missing" });
    } catch (error) {
      if (id !== request.current) return;
      // A failed reload keeps what was already showing.
      setState((current) =>
        current.status === "ready"
          ? current
          : { status: "error", message: error instanceof Error ? error.message : String(error) },
      );
    }
  }, [lessonId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return { state, reload: load };
}
