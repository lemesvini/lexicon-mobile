import { useCallback, useEffect, useState } from "react";
import { AppState, Linking } from "react-native";

import { getPermission, requestPermission } from "@/features/notifications/permissions";
import { startNotifications } from "@/features/notifications/start";
import type { AppPermission } from "@/features/permissions/types/app-permission";
import type { PermissionsState } from "@/features/permissions/types/permissions-state";
import { getMicrophonePermission, requestMicrophonePermission } from "@/features/practice/microphone";
import { haptics } from "@/lib/haptics";

async function readAll(): Promise<PermissionsState> {
  const [microphone, notifications] = await Promise.all([
    getMicrophonePermission(),
    getPermission(),
  ]);
  return { microphone, notifications };
}

/**
 * The permissions sheet's state: where the microphone and the notifications
 * stand, a way to ask for each, and the system settings for one already
 * refused. Re-reads when the app comes back to the foreground — the student
 * may be returning from those settings.
 */
export function usePermissions() {
  const [state, setState] = useState<PermissionsState>({ microphone: null, notifications: null });

  const refresh = useCallback(async () => {
    const next = await readAll();
    setState(next);
    // Turned on in the settings: start what the permission is for straight
    // away, rather than on the next launch.
    if (next.notifications === "granted") await startNotifications();
  }, []);

  useEffect(() => {
    readAll().then(setState).catch(() => {});
    const foreground = AppState.addEventListener("change", (status) => {
      if (status === "active") refresh().catch(() => {});
    });
    return () => foreground.remove();
  }, [refresh]);

  async function allow(permission: AppPermission) {
    if (state[permission] === "blocked") {
      void Linking.openSettings();
      return;
    }
    const status =
      permission === "microphone" ? await requestMicrophonePermission() : await requestPermission();
    setState((current) => ({ ...current, [permission]: status }));
    if (status !== "granted") return;
    haptics.success();
    if (permission === "notifications") startNotifications().catch(() => {});
  }

  return { ...state, allow };
}
