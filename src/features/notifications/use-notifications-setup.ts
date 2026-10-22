import { useEffect } from "react";
import { AppState } from "react-native";
import { router, type Href } from "expo-router";
import * as Notifications from "expo-notifications";

import { syncDailyPractice } from "@/features/notifications/daily-practice";
import { registerPushToken } from "@/features/notifications/data/push-token";
import { getPermission, requestPermission } from "@/features/notifications/permissions";
import { ensureChannels, notificationsSupported } from "@/features/notifications/setup";

// expo-sqlite's localStorage, installed in src/lib/supabase.ts. Android lets
// the app ask again after a "no", and asking at every launch would be a nag:
// after the first time, the Me tab's switches are where it's turned on.
const ASKED_KEY = "lexicon.notifications-asked";

function askedBefore(): boolean {
  try {
    return localStorage.getItem(ASKED_KEY) === "yes";
  } catch {
    return false;
  }
}

function rememberAsked() {
  try {
    localStorage.setItem(ASKED_KEY, "yes");
  } catch {
    // Asked again next launch, at worst.
  }
}

/** Opens what a tapped notification points at — its `data.url`, an app route. */
function open(response: Notifications.NotificationResponse) {
  Notifications.clearLastNotificationResponse();
  if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;
  const url = response.notification.request.content.data?.url;
  if (typeof url === "string" && url.startsWith("/")) router.push(url as Href);
}

async function setUp() {
  await ensureChannels();
  let permission = await getPermission();
  if (permission === "undetermined" && !askedBefore()) {
    rememberAsked();
    permission = await requestPermission();
  }
  if (permission !== "granted") return;
  await Promise.allSettled([registerPushToken(), syncDailyPractice()]);
}

/**
 * Everything notifications need while a student is signed in: the permission
 * (asked once, on the first visit), this device's push token on the server,
 * the week of practice reminders, and opening the screen a tapped notification
 * is about — including the one that launched the app.
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

    setUp().catch(() => {});

    // The OS can roll the token; Expo's follows it.
    const tokens = Notifications.addPushTokenListener(() => {
      registerPushToken().catch(() => {});
    });
    // Tops the week of reminders back up.
    const foreground = AppState.addEventListener("change", (state) => {
      if (state === "active") syncDailyPractice().catch(() => {});
    });

    return () => {
      taps.remove();
      tokens.remove();
      foreground.remove();
    };
  }, []);
}
