import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useNotificationsSetup } from "@/features/notifications/use-notifications-setup";
import { colors } from "@/theme/colors";
import { useSheetOptions } from "@/theme/sheet";

export default function AppLayout() {
  const sheetOptions = useSheetOptions();
  useNotificationsSetup();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const insets = useSafeAreaInsets();
  // The viewers and the practice sittings draw their own top, with no bar. On
  // iOS a modal is a sheet, below the status bar; on Android it fills the
  // screen, so the top is kept clear of the status bar here.
  const viewerOptions = {
    presentation: "modal",
    contentStyle: process.env.EXPO_OS === "android" ? { paddingTop: insets.top } : undefined,
  } as const;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(modals)/change-password" options={sheetOptions} />
      <Stack.Screen name="(modals)/delete-account" options={sheetOptions} />
      <Stack.Screen name="(modals)/report/[reportId]" options={sheetOptions} />
      <Stack.Screen name="(modals)/context-note" options={sheetOptions} />
      <Stack.Screen name="(modals)/permissions" options={sheetOptions} />
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
          // under it, so the tint the tabs' buttons use. Android has no
          // glass: the button sits right on the green, in the hero's cream.
          headerTintColor:
            process.env.EXPO_OS === "android" ? colors[scheme].primaryText : colors[scheme].primary,
        }}
      />
      {/* A modal, not a form sheet: it slides up the same way, and it may hold
          a stack of its own — which is what its bottom toolbar needs. */}
      <Stack.Screen name="steps/[lessonId]" options={viewerOptions} />
      {/* A homework, in the same kind of modal as the material. */}
      <Stack.Screen name="assignment/[homeworkId]" options={viewerOptions} />
      {/* The class's deck, in the same kind of modal again. */}
      <Stack.Screen name="slides/[lessonId]" options={viewerOptions} />
      {/* Practice › Speaking: a sitting of cards, without the tab bar. */}
      <Stack.Screen name="speaking" options={viewerOptions} />
      {/* Practice › Listening, the same way. */}
      <Stack.Screen name="listening" options={viewerOptions} />
      {/* Practice › Writing, the same way. */}
      <Stack.Screen name="writing" options={viewerOptions} />
      {/* Practice › Reading, the same way. */}
      <Stack.Screen name="reading" options={viewerOptions} />
    </Stack>
  );
}
