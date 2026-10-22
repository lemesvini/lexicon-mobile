import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

import { fetchToday } from "@/features/today/data/week";
import type { TodayState } from "@/features/today/types/today-state";

/** Loads on focus, so coming back to the tab after handing in homework shows
 *  it as done. Keeps the last good data on screen while it reloads. */
export function useToday() {
  const [state, setState] = useState<TodayState>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const request = useRef(0);

  const load = useCallback(async () => {
    const id = ++request.current;
    try {
      const data = await fetchToday();
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
