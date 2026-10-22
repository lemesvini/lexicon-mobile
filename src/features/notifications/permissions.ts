import * as Notifications from "expo-notifications";

import { ensureChannels, notificationsSupported } from "@/features/notifications/setup";
import type { PermissionStatus } from "@/features/notifications/types/permission-status";

function statusOf(permissions: Notifications.NotificationPermissionsStatus): PermissionStatus {
  // iOS's provisional ("deliver quietly") counts: the notifications do arrive.
  if (
    permissions.granted ||
    permissions.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return "granted";
  }
  return permissions.canAskAgain ? "undetermined" : "blocked";
}

export async function getPermission(): Promise<PermissionStatus> {
  if (!notificationsSupported) return "blocked";
  return statusOf(await Notifications.getPermissionsAsync());
}

/** Shows the system's prompt, if the system still will. */
export async function requestPermission(): Promise<PermissionStatus> {
  if (!notificationsSupported) return "blocked";
  await ensureChannels();
  return statusOf(await Notifications.requestPermissionsAsync());
}
