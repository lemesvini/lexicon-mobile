import { ActivityIndicator, ScrollView, Text, View, useColorScheme } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useHeaderHeight } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LessonHero from "@/features/lessons/components/lesson-hero";
import LessonSteps from "@/features/lessons/components/lesson-steps";
import MaterialSteps from "@/features/lessons/components/material-steps";
import { useLessonDetail } from "@/features/lessons/data/use-lesson-detail";
import { haptics } from "@/lib/haptics";
import { colors } from "@/theme/colors";

/** The bottom toolbar, above the home indicator. */
const BOTTOM_TOOLBAR_HEIGHT = 56;

/** A lesson: its green hero, how its live class and homework stand, and the
 *  steps of its material. Every node on the path lands here. */
export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const { state } = useLessonDetail(lessonId);
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const lesson = state.status === "ready" ? state.data : null;

  return (
    <>
      {/* Light over the green, whatever the scheme. */}
      <StatusBar style="light" />
      {lesson?.hasPresentation ? (
        <Stack.Toolbar placement="right">
          {/* The class's slides, as the group saw them. */}
          <Stack.Toolbar.Button
            icon="display"
            accessibilityLabel="Ver a apresentação da aula"
            onPress={() => {
              haptics.tap();
              router.push({ pathname: "/slides/[lessonId]", params: { lessonId: lesson.id } });
            }}
            // The glass behind a header button follows the system's scheme,
            // not the green under it — so the path's tint, not the hero's
            // cream, which vanished on the light glass.
            tintColor={colors[scheme].primary}
          />
        </Stack.Toolbar>
      ) : null}

      <ScrollView
        contentInsetAdjustmentBehavior="never"
        // Clear of the bottom toolbar, which sits over the end of the page.
        contentContainerStyle={{ paddingBottom: insets.bottom + BOTTOM_TOOLBAR_HEIGHT + 24 }}
        className="bg-background"
      >
        <LessonHero lesson={lesson} headerHeight={headerHeight} />

        {/* The sheet over the bottom of the hero. */}
        <View className="-mt-7 gap-7 rounded-t-[28px] bg-background px-4 pt-5">
          {lesson ? (
            <>
              <LessonSteps lesson={lesson} />
              <MaterialSteps lessonId={lesson.id} steps={lesson.steps} />
            </>
          ) : state.status === "loading" ? (
            <ActivityIndicator className="py-10" />
          ) : (
            <Text className="px-1 py-10 text-center font-sans text-sm text-muted-foreground">
              {state.status === "missing"
                ? "Esta aula não está disponível para você."
                : "Não foi possível carregar esta aula. Volte e tente de novo."}
            </Text>
          )}
        </View>
      </ScrollView>
    </>
  );
}
