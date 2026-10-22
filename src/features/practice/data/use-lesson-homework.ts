import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

import { fetchLessonHomework } from "@/features/practice/data/lesson-homework";
import type { LessonHomeworkState } from "@/features/practice/types/lesson-homework-state";

/** "From your lessons", loaded on focus — coming back after handing a homework
 *  in shows it waiting. A failed reload keeps what was showing. */
export function useLessonHomework() {
  const [state, setState] = useState<LessonHomeworkState>({ status: "loading" });
  const request = useRef(0);

  useFocusEffect(
    useCallback(() => {
      const id = ++request.current;
      fetchLessonHomework()
        .then((list) => {
          if (id === request.current) setState({ status: "ready", list });
        })
        .catch((error: unknown) => {
          if (id !== request.current) return;
          setState((current) =>
            current.status === "ready"
              ? current
              : { status: "error", message: error instanceof Error ? error.message : String(error) },
          );
        });
    }, []),
  );

  return state;
}
