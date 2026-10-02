import { useEffect } from "react";
import { router, usePathname, useRootNavigationState } from "expo-router";

import { useAuth } from "@/features/auth/auth-provider";

/**
 * Opens the change-password sheet over the app while the account is still on
 * a temporary password. The sheet blocks its own dismissal in that case, and
 * closes itself once the new password is saved.
 */
export function PasswordGate() {
  const { status, mustChangePassword } = useAuth();
  const pathname = usePathname();
  const navigationReady = !!useRootNavigationState()?.key;

  useEffect(() => {
    if (!navigationReady || status !== "signed-in" || !mustChangePassword) return;
    // "/" is the index route, about to redirect to /today; pushing from it
    // would race that redirect.
    if (pathname === "/" || pathname === "/change-password") return;
    router.push("/change-password");
  }, [navigationReady, status, mustChangePassword, pathname]);

  return null;
}
