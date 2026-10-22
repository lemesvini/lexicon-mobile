// The daily nudge to practise, scheduled on the phone itself: it depends on
// nothing the server knows, and it works offline.
//
// Not one repeating notification but one per day, a week ahead, each with its
// own identifier — so a day the student has already practised can be taken
// out on its own. The week is topped up every time the app comes to the
// foreground, which for anybody who uses it is long before it runs out (and for
// anybody who doesn't, a week of reminders is plenty).

import * as Notifications from "expo-notifications";

import { getPermission } from "@/features/notifications/permissions";
import { CHANNELS, notificationsSupported } from "@/features/notifications/setup";
import { toDateKey } from "@/features/today/data/week";

// expo-sqlite's localStorage, installed in src/lib/supabase.ts.
const ENABLED_KEY = "lexicon.daily-practice";
const PRACTICED_KEY = "lexicon.practiced-on";

const ID_PREFIX = "daily-practice-";
const HOUR = 19;
const DAYS_AHEAD = 7;

/** One a day, in turn, so it doesn't read as the same alarm every evening. */
const MESSAGES = [
  { title: "Hora de praticar", body: "Uns minutinhos de prática hoje já fazem diferença." },
  { title: "Seus cards estão esperando", body: "Revise o que você viu nas aulas antes que escape." },
  { title: "Bora praticar?", body: "Speaking, listening, reading ou writing: você escolhe." },
  { title: "Practice makes perfect", body: "Sua prática de hoje leva menos de 5 minutos." },
];

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Kept for this session only.
  }
}

/** On unless the student turned it off. */
export function isDailyPracticeOn(): boolean {
  return read(ENABLED_KEY) !== "off";
}

export async function setDailyPracticeOn(on: boolean) {
  write(ENABLED_KEY, on ? "on" : "off");
  await syncDailyPractice();
}

async function cancelScheduled() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((request) => request.identifier.startsWith(ID_PREFIX))
      .map((request) => Notifications.cancelScheduledNotificationAsync(request.identifier)),
  );
}

/** Lays out the next week of reminders from scratch — or none, if they're off
 *  or the app may not notify. */
export async function syncDailyPractice() {
  if (!notificationsSupported) return;
  await cancelScheduled();
  if (!isDailyPracticeOn() || (await getPermission()) !== "granted") return;

  const now = new Date();
  const practicedToday = read(PRACTICED_KEY) === toDateKey(now);

  for (let day = 0; day < DAYS_AHEAD; day++) {
    const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + day, HOUR, 0);
    if (at <= now || (day === 0 && practicedToday)) continue;

    const message = MESSAGES[at.getDate() % MESSAGES.length]!;
    await Notifications.scheduleNotificationAsync({
      identifier: ID_PREFIX + toDateKey(at),
      content: { ...message, data: { url: "/practice" }, sound: "default" },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: at,
        channelId: CHANNELS.practice,
      },
    });
  }
}

/** A sitting was finished: no reminder tonight. */
export function markPracticedToday() {
  const today = toDateKey(new Date());
  write(PRACTICED_KEY, today);
  if (notificationsSupported) {
    Notifications.cancelScheduledNotificationAsync(ID_PREFIX + today).catch(() => {});
  }
}

/** On sign-out: the next person on this phone hasn't asked for them. */
export async function cancelDailyPractice() {
  if (!notificationsSupported) return;
  await cancelScheduled();
}
