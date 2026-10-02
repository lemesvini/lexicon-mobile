import { Stack } from "expo-router";

import { useSheetOptions } from "@/theme/sheet";

// Keeps the welcome screen under the sign-in sheet, even when /sign-in is
// opened directly.
export const unstable_settings = { initialRouteName: "welcome" };

export default function AuthLayout() {
  const sheetOptions = useSheetOptions();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="sign-in" options={sheetOptions} />
    </Stack>
  );
}
