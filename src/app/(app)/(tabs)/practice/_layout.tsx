import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

import { colors } from "@/theme/colors";

export default function PracticeLayout() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const titleColor = colors[scheme].secondaryForeground;

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Practice",
          headerLargeTitle: true,
          headerLargeTitleStyle: { fontFamily: "Caprasimo", color: titleColor },
          headerTitleStyle: { fontFamily: "Caprasimo", color: titleColor },
        }}
      />
    </Stack>
  );
}
