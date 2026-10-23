import { useEffect } from "react";
import { AppState } from "react-native";
import { router, type Href } from "expo-router";
import * as Notifications from "expo-notifications";

import { syncDailyPractice } from "@/features/notifications/daily-practice";
import { getPermission } from "@/features/notifications/permissions";
import { ensureChannels, notificationsSupported } from "@/features/notifications/setup";
import { startNotifications } from "@/features/notifications/start";

/** Opens what a tapped notification points at — its `data.url`, an app route. */
function open(response: Notifications.NotificationResponse) {
  Notifications.clearLastNotificationResponse();
  if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;
  const url = response.notification.request.content.data?.url;
  if (typeof url === "string" && url.startsWith("/")) router.push(url as Href);
}

async function setUp() {
  await ensureChannels();
  if ((await getPermission()) !== "granted") return;
  await startNotifications();
}

/**
 * Everything notifications need while a student is signed in: this device's
 * push token on the server, the week of practice reminders, and opening the
 * screen a tapped notification is about — including the one that launched the
 * app. The permission itself is asked in the permissions sheet, which explains
 * it first (see usePermissionsPrompt), and from the Me tab's switches.
 *
 * Lives in the signed-in layout, so it only runs with a session to file the
 * token under, and a tap that launched the app is handled once the screens it
 * may point at exist.
 */
export function useNotificationsSetup() {
  useEffect(() => {
    if (!notificationsSupported) return;

    const launchedBy = Notifications.getLastNotificationResponse();
    if (launchedBy) open(launchedBy);
    const taps = Notifications.addNotificationResponseReceivedListener(open);

    // Registers the token at every launch, which also catches the OS rolling
    // it. Never from addPushTokenListener: getExpoPushTokenAsync fetches the
    // device token, which fires that listener — registering from it loops
    // forever, hundreds of requests a second, until iOS kills the app.
    setUp().catch(() => {});

    // Tops the week of reminders back up.
    const foreground = AppState.addEventListener("change", (state) => {
      if (state === "active") syncDailyPractice().catch(() => {});
    });

    return () => {
      taps.remove();
      foreground.remove();
    };
  }, []);
}
