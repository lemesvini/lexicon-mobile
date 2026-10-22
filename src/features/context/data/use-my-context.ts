import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

import { fetchMyContext } from "@/features/context/data/student-context";
import type { ContextState } from "@/features/context/types/context-state";

/** Loads on focus, so closing the note sheet shows the note just added. */
export function useMyContext() {
  const [state, setState] = useState<ContextState>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const request = useRef(0);

  const load = useCallback(async () => {
    const id = ++request.current;
    try {
      const data = await fetchMyContext();
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
