import { Text, View } from "react-native";

import type { LessonDetail } from "@/features/lessons/types/lesson-detail";

type Props = {
  /** Null while it loads: the green is there already, the words come after. */
  lesson: LessonDetail | null;
  /** The transparent header over the top of it. */
  headerHeight: number;
};

/** How far the green runs on above the top, for the bounce of a pull down. */
const OVERSCROLL = 600;

/** The lesson's green top: which lesson, its name, and what it lets the student
 *  do. */
export default function LessonHero({ lesson, headerHeight }: Props) {
  const eyebrow = lesson ? [lesson.label, lesson.unit].filter(Boolean).join(" · ") : "";

  return (
    <View style={{ paddingTop: headerHeight + 12 }} className="bg-primary px-5 pb-12">
      <View style={{ top: -OVERSCROLL, height: OVERSCROLL }} className="absolute left-0 right-0 bg-primary" />
      {lesson ? (
        <View className="gap-2">
          {eyebrow ? (
            <Text className="font-sans text-xs font-bold uppercase tracking-widest text-primary-text/80">
              {eyebrow}
            </Text>
          ) : null}
          <Text className="font-display text-5xl leading-[52px] text-primary-text">{lesson.name}</Text>
          {lesson.canDo ? (
            <Text className="mt-1 font-sans text-xl font-semibold leading-snug text-primary-text/95">
              {lesson.canDo}
            </Text>
          ) : null}
        </View>
      ) : (
        <View className="h-36" />
      )}
    </View>
  );
}
