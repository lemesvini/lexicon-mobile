import { Stack } from "expo-router";

import { useSheetOptions } from "@/theme/sheet";

export default function AppLayout() {
  const sheetOptions = useSheetOptions();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(modals)/profile" options={sheetOptions} />
      <Stack.Screen name="(modals)/change-password" options={sheetOptions} />
    </Stack>
  );
}
