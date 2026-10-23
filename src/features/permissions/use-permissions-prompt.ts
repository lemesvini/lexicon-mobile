import { useEffect } from "react";
import { Platform } from "react-native";
import { router } from "expo-router";

import { useAuth } from "@/features/auth/auth-provider";
import { getPermission } from "@/features/notifications/permissions";
import { getMicrophonePermission } from "@/features/practice/microphone";

// expo-sqlite's localStorage, installed in src/lib/supabase.ts. Shown once: a
// sheet at every launch would be a nag. After that, speaking asks for the
// microphone when it's tapped, and the Me tab's switches for notifications.
const PROMPTED_KEY = "lexicon.permissions-prompted";

function promptedBefore(): boolean {
  try {
    return localStorage.getItem(PROMPTED_KEY) === "yes";
  } catch {
    return false;
  }
}

function rememberPrompted() {
  try {
    localStorage.setItem(PROMPTED_KEY, "yes");
  } catch {
    // Shown again next launch, at worst.
  }
}

/**
 * Opens the permissions sheet over the Today screen on the first visit, while
 * the system hasn't been asked about the microphone or the notifications yet.
 * Waits for the change-password sheet, when the account still needs one.
 */
export function usePermissionsPrompt() {
  const { mustChangePassword } = useAuth();

  useEffect(() => {
    if (Platform.OS === "web" || mustChangePassword || promptedBefore()) return;

    let cancelled = false;
    Promise.all([getMicrophonePermission(), getPermission()])
      .then((statuses) => {
        if (cancelled || !statuses.includes("undetermined")) return;
        rememberPrompted();
        router.push("/permissions");
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [mustChangePassword]);
}
