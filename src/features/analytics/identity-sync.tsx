import { usePostHog } from "posthog-react-native";
import { useEffect, useRef } from "react";

import { useAuth } from "@/features/auth/auth-provider";

/**
 * Ties events, replays and errors to the signed-in student (by their Supabase
 * user id, plus their module to segment by — never name or email) and starts a
 * fresh anonymous person after they sign out, so a shared phone doesn't mix two
 * students.
 */
export function IdentitySync() {
  const posthog = usePostHog();
  const { status, session, student } = useAuth();
  const userId = status === "signed-in" ? (session?.user.id ?? null) : null;
  // Arrives after the access check, which may be after the session itself.
  const moduleName = student?.moduleName ?? null;
  const identified = useRef<string | null>(null);

  useEffect(() => {
    if (userId) {
      posthog.identify(userId, moduleName ? { module: moduleName } : undefined);
      identified.current = userId;
    } else if (status === "signed-out" && identified.current) {
      posthog.reset();
      identified.current = null;
    }
  }, [posthog, userId, moduleName, status]);

  return null;
}
