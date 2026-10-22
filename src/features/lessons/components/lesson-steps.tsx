import { Pressable, Text, View, useColorScheme } from "react-native";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";

import StepMarker from "@/features/lessons/components/step-marker";
import { stepRows } from "@/features/lessons/step-rows";
import type { LessonDetail } from "@/features/lessons/types/lesson-detail";
import { haptics } from "@/lib/haptics";
import { colors, pathColors } from "@/theme/colors";

type Props = {
  lesson: LessonDetail;
};

/** The lesson's steps, top to bottom: its live class, then each homework. The
 *  line between two runs in green once the step above it is done. */
export default function LessonSteps({ lesson }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const missed = pathColors[scheme].missed;
  const rows = stepRows(lesson.liveClass, lesson.teacherFirstName, lesson.homework);

  return (
    <View className="rounded-3xl border border-border bg-card px-4 py-4">
      {rows.map((row, index) => {
        const last = index === rows.length - 1;
        const { homeworkId } = row;
        return (
          <Pressable
            key={row.key}
            disabled={!homeworkId}
            onPress={() => {
              if (!homeworkId) return;
              haptics.tap();
              router.push({ pathname: "/assignment/[homeworkId]", params: { homeworkId } });
            }}
            accessibilityRole={homeworkId ? "button" : undefined}
            className="flex-row gap-3.5 active:opacity-70"
          >
            <View className="items-center">
              <StepMarker state={row.marker} gold={row.gold} />
              {last ? null : (
                <View
                  className={`my-1 w-0.5 flex-1 rounded-full ${row.marker === "done" ? "bg-primary" : "bg-border"}`}
                />
              )}
            </View>
            <View className={`flex-1 gap-0.5 ${last ? "" : "pb-4"}`}>
              <Text className="font-sans text-base font-bold text-foreground">{row.title}</Text>
              <Text
                style={row.marker === "missed" ? { color: missed.text } : undefined}
                className="font-sans text-sm text-muted-foreground"
              >
                {row.detail}
              </Text>
            </View>
            {homeworkId ? (
              <View className="justify-center pb-4">
                <ChevronRight color={colors[scheme].mutedForeground} size={18} />
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
