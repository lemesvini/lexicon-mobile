// This device's Expo push token, kept in `push_tokens` (lexicon-web 0036) for as
// long as the student is signed in on it. Written through the two RPCs: the
// table itself is closed to the app.

import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

import { notificationsSupported } from "@/features/notifications/setup";
import { supabase } from "@/lib/supabase";

// expo-sqlite's localStorage, installed in src/lib/supabase.ts. Remembered so
// sign-out can take the token off the server without asking Expo for it again,
// which needs the network.
const KEY = "lexicon.push-token";

/** Asks Expo for the token and files it under the signed-in student. Needs the
 *  notification permission. */
export async function registerPushToken(): Promise<void> {
  if (!notificationsSupported) return;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });

  const { error } = await supabase.rpc("register_push_token", {
    p_token: token,
    p_platform: Platform.OS,
  });
  if (error) throw new Error(error.message);

  try {
    localStorage.setItem(KEY, token);
  } catch {
    // Sign-out just won't be able to take it off; the next student to sign in
    // on this phone takes it over anyway.
  }
}

/** Stops pushes to this device. Called on sign-out, while the session still
 *  holds. */
export async function unregisterPushToken(): Promise<void> {
  let token: string | null = null;
  try {
    token = localStorage.getItem(KEY);
    localStorage.removeItem(KEY);
  } catch {
    return;
  }
  if (!token) return;

  const { error } = await supabase.rpc("unregister_push_token", { p_token: token });
  if (error) throw new Error(error.message);
}
