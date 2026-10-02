import "../global.css";

import { Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import { AuthProvider, useAuth } from "@/features/auth/auth-provider";
import { PasswordGate } from "@/features/auth/password-gate";
import { SplashController } from "@/features/auth/splash-controller";
import { navigationThemes } from "@/theme/colors";

// Held until the stored session has been read; SplashController hides it.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <ThemeProvider value={navigationThemes[scheme]}>
      <AuthProvider>
        <SplashController />
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}

/**
 * Screens whose guard is false don't exist. When the session ends, everything
 * under the first guard — the tabs and any open sheet in (app)/(modals) — is
 * removed along with its history, and the student lands on the welcome screen
 * in (auth); signing in does the reverse.
 */
function RootNavigator() {
  const { status } = useAuth();

  if (status === "loading") return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={status === "signed-in"}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={status === "signed-out"}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
      <PasswordGate />
    </>
  );
}
