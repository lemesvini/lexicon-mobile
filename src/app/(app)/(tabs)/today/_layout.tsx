import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

import { useAuth } from "@/features/auth/auth-provider";
import { colors } from "@/theme/colors";

export default function TodayLayout() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const titleColor = colors[scheme].secondaryForeground;
  const { firstName } = useAuth();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: firstName ? `Hello, ${firstName}` : "Hello",
          headerLargeTitle: true,
          headerLargeTitleStyle: { fontFamily: "Caprasimo", color: titleColor },
          headerTitleStyle: { fontFamily: "Caprasimo", color: titleColor },
        }}
      />
    </Stack>
  );
}
