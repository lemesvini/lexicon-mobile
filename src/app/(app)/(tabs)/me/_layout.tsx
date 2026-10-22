import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

import { colors } from "@/theme/colors";

export default function MeLayout() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const titleColor = colors[scheme].secondaryForeground;

  return (
    <Stack>
      {/* No bar: the screen opens on the student's own name instead. */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
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
