import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

/** The web build has neither push nor scheduled notifications. */
export const notificationsSupported = Platform.OS === "ios" || Platform.OS === "android";

/**
 * Android's notification channels — what the student sees, and can switch off
 * one by one, under the app's notification settings. lexicon-web's `send-push`
 * names them by id, and Android drops a notification for a channel the phone
 * doesn't have, so the ids never change.
 */
export const CHANNELS = {
  practice: "practice",
  activity: "activity",
  classes: "classes",
} as const;

/**
 * Shows a notification that arrives while the app is open, too — a correction
 * landing mid-practice is still worth the banner. Called once, at launch.
 */
export function configureNotifications() {
  if (!notificationsSupported) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/** Creates the channels. Has to come before the permission request and the
 *  push token: Android 13 won't ask for permission with no channel to ask for. */
export async function ensureChannels() {
  if (Platform.OS !== "android") return;
  await Promise.all([
    Notifications.setNotificationChannelAsync(CHANNELS.practice, {
      name: "Prática diária",
      description: "O lembrete de praticar um pouco todo dia.",
      importance: Notifications.AndroidImportance.DEFAULT,
    }),
    Notifications.setNotificationChannelAsync(CHANNELS.activity, {
      name: "Correções e relatórios",
      description: "Quando o professor corrige uma atividade ou escreve um relatório.",
      importance: Notifications.AndroidImportance.HIGH,
    }),
    Notifications.setNotificationChannelAsync(CHANNELS.classes, {
      name: "Lembretes de aula",
      description: "Uma hora antes de cada aula da sua turma.",
      importance: Notifications.AndroidImportance.HIGH,
    }),
  ]);
}
