import { syncDailyPractice } from "@/features/notifications/daily-practice";
import { registerPushToken } from "@/features/notifications/data/push-token";

/** What the permission is for, once it's given: this device's push token on
 *  the server, and the week of practice reminders on the phone. */
export async function startNotifications() {
  await Promise.allSettled([registerPushToken(), syncDailyPractice()]);
}
