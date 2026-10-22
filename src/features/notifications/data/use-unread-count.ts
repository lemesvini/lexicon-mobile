import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import * as Notifications from "expo-notifications";

import { fetchUnreadCount } from "@/features/notifications/data/inbox";
import { notificationsSupported } from "@/features/notifications/setup";

/** How many notifications the bell has that haven't been seen: 0 until known.
 *  Counted again on focus — coming back from the list clears it — and when a
 *  push arrives with the app open. */
export function useUnreadCount() {
  const [count, setCount] = useState(0);
  const request = useRef(0);

  const load = useCallback(() => {
    const id = ++request.current;
    fetchUnreadCount()
      .then((next) => {
        if (id === request.current) setCount(next);
      })
      // A failed count keeps what was showing.
      .catch(() => {});
  }, []);

  useFocusEffect(load);

  useEffect(() => {
    if (!notificationsSupported) return;
    const subscription = Notifications.addNotificationReceivedListener(load);
    return () => subscription.remove();
  }, [load]);

  return count;
}
