import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

import { fetchProgress } from "@/features/profile/data/progress";
import type { ProgressState } from "@/features/profile/types/progress-state";

/** Loads on focus, like the Path tab, and keeps the last good card on screen
 *  while it reloads. */
export function useProgress() {
  const [state, setState] = useState<ProgressState>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const request = useRef(0);

  const load = useCallback(async () => {
    const id = ++request.current;
    try {
      const data = await fetchProgress();
      if (id === request.current) setState({ status: "ready", data });
    } catch (error) {
      if (id !== request.current) return;
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
