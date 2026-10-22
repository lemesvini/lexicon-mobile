import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

import { useNotificationsSetup } from "@/features/notifications/use-notifications-setup";
import { colors } from "@/theme/colors";
import { useSheetOptions } from "@/theme/sheet";

export default function AppLayout() {
  const sheetOptions = useSheetOptions();
  useNotificationsSetup();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(modals)/change-password" options={sheetOptions} />
      <Stack.Screen name="(modals)/report/[reportId]" options={sheetOptions} />
      <Stack.Screen name="(modals)/context-note" options={sheetOptions} />
      {/* Above the tabs rather than in the Path tab's stack: a screen pushed
          inside a native tab keeps the tab bar, and a lesson is read without
          it. */}
      <Stack.Screen
        name="lesson/[lessonId]"
        options={{
          headerShown: true,
          // Over the lesson's green hero, which runs up to the top of the screen.
          headerTransparent: true,
          scrollEdgeEffects: { top: "hidden" },
          title: "",
          headerBackButtonDisplayMode: "minimal",
          // The button's glass follows the system's scheme, not the green
          // under it, so the tint the tabs' buttons use.
          headerTintColor: colors[scheme].primary,
        }}
      />
      {/* A modal, not a form sheet: it slides up the same way, and it may hold
          a stack of its own — which is what its bottom toolbar needs. */}
      <Stack.Screen name="steps/[lessonId]" options={{ presentation: "modal" }} />
      {/* A homework, in the same kind of modal as the material. */}
      <Stack.Screen name="assignment/[homeworkId]" options={{ presentation: "modal" }} />
      {/* The class's deck, in the same kind of modal again. */}
      <Stack.Screen name="slides/[lessonId]" options={{ presentation: "modal" }} />
      {/* Practice › Speaking: a sitting of cards, without the tab bar. */}
      <Stack.Screen name="speaking" options={{ presentation: "modal" }} />
      {/* Practice › Listening, the same way. */}
      <Stack.Screen name="listening" options={{ presentation: "modal" }} />
      {/* Practice › Writing, the same way. */}
      <Stack.Screen name="writing" options={{ presentation: "modal" }} />
      {/* Practice › Reading, the same way. */}
      <Stack.Screen name="reading" options={{ presentation: "modal" }} />
    </Stack>
  );
}
