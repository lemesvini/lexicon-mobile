import "expo-sqlite/localStorage/install";

import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";

import { env } from "@/lib/env";

// Set up as in https://docs.expo.dev/guides/using-supabase/ — the session lives
// in expo-sqlite's localStorage, so the student stays signed in across launches.
export const supabase = createClient(
  env.EXPO_PUBLIC_SUPABASE_URL,
  env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);

// There is no page visibility event on native, so the token refresh timer is
// tied to the app being in the foreground.
AppState.addEventListener("change", (state) => {
  if (state === "active") supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh();
});
