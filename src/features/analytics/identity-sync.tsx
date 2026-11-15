import { usePostHog } from "posthog-react-native";
import { useEffect, useRef } from "react";

import { useAuth } from "@/features/auth/auth-provider";

/**
 * Ties events, replays and errors to the signed-in student (by their Supabase
 * user id, with their name so the PostHog dashboard shows who they are and
 * their module to segment by — never email) and starts a fresh anonymous
 * person after they sign out, so a shared phone doesn't mix two students.
 */
export function IdentitySync() {
  const posthog = usePostHog();
  const { status, session, student } = useAuth();
  const userId = status === "signed-in" ? (session?.user.id ?? null) : null;
  // Both arrive after the access check, which may be after the session itself.
  const name = student?.fullName || null;
  const moduleName = student?.moduleName ?? null;
  const identified = useRef<string | null>(null);

  useEffect(() => {
    if (userId) {
      posthog.identify(userId, {
        $set: {
          ...(name && { name }),
          ...(moduleName && { module: moduleName }),
        },
      });
      identified.current = userId;
    } else if (status === "signed-out" && identified.current) {
      posthog.reset();
      identified.current = null;
    }
  }, [posthog, userId, name, moduleName, status]);

  return null;
}
