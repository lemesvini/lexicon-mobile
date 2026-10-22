import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

import { fetchInbox, markAllRead } from "@/features/notifications/data/inbox";
import type { InboxState } from "@/features/notifications/types/inbox-state";

/**
 * Loads on focus. Opening the list reads everything in it: the server marks
 * them read straight away, while the list keeps showing which were new until
 * it's left. Keeps the last good data on screen while it reloads.
 */
export function useInbox() {
  const [state, setState] = useState<InboxState>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const request = useRef(0);

  const load = useCallback(async () => {
    const id = ++request.current;
    try {
      const items = await fetchInbox();
      if (id !== request.current) return;
      setState({ status: "ready", items });
      if (items.some((item) => item.unread)) markAllRead().catch(() => {});
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
