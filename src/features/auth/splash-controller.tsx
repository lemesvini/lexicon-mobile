import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

import { useAuth } from "@/features/auth/auth-provider";

/** Hides the splash once the stored session has been read, so a signed-in
 *  student never sees the sign-in screen flash past. */
export function SplashController() {
  const { status } = useAuth();

  useEffect(() => {
    if (status !== "loading") SplashScreen.hide();
  }, [status]);

  return null;
}
