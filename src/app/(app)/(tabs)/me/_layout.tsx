import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";

export default function MeLayout() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const titleColor = colors[scheme].secondaryForeground;
  const insets = useSafeAreaInsets();

  return (
    <Stack>
      {/* No bar: the screen opens on the student's own name instead. iOS keeps
          it under the status bar by itself; Android draws behind it. */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          contentStyle: process.env.EXPO_OS === "android" ? { paddingTop: insets.top } : undefined,
        }}
      />
      {/* Pushed inside the tab, as a page of iOS Settings is. */}
      <Stack.Screen
        name="context"
        options={{
          title: "My context",
          headerLargeTitle: true,
          headerLargeTitleStyle: { fontFamily: "Caprasimo", color: titleColor },
          headerTitleStyle: { fontFamily: "Caprasimo", color: titleColor },
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors[scheme].primary,
        }}
      />
    </Stack>
  );
}
