import { Pressable, Text, View, useColorScheme } from "react-native";
import { router } from "expo-router";
import { MessagesSquare } from "lucide-react-native";

import GoldMarker from "@/features/lessons/components/gold-marker";
import StepRing from "@/features/lessons/components/step-ring";
import {
  CURRENT_SIZE,
  NODE_DEPTH as DEPTH,
  NODE_SIZE,
  RING_SIZE,
  isComplete,
  ringSizeOf,
} from "@/features/lessons/path-layout";
import type { PathLesson } from "@/features/lessons/types/path-lesson";
import { haptics } from "@/lib/haptics";
import { colors, pathColors } from "@/theme/colors";

type Props = {
  lesson: PathLesson;
};

const STATUS_LABEL = { done: "concluída", current: "atual", upcoming: "a seguir" } as const;

/** The star on a lesson the student has done all of. */
const BADGE_SIZE = 30;

/** A lesson behind the group in its type's colour; the current one and those
 *  ahead the same whatever their type. */
function palette(scheme: "light" | "dark", lesson: PathLesson) {
  const theme = pathColors[scheme];
  const colours = lesson.status === "done" ? theme[lesson.type] : theme[lesson.status];
  return { ...colours, border: "border" in colours ? colours.border : null };
}

/** One lesson on the path. Every node opens the lesson page, whatever its
 *  state — the page says what is there. */
export default function PathNode({ lesson }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const { face, edge, content, border } = palette(scheme, lesson);
  const current = lesson.status === "current";
  const size = current ? CURRENT_SIZE : NODE_SIZE;
  const ring = ringSizeOf(lesson);
  const complete = isComplete(lesson);
  // The star's centre, on the face's edge at its top right.
  const badgeAt = size / 2 + (size / 2) * Math.SQRT1_2;

  const label =
    lesson.type === "conversation"
      ? `Conversation: ${lesson.name}`
      : // A checkpoint's name already says so: "Checkpoint — Welcome a Visitor".
        `Lesson ${lesson.number}: ${lesson.name}`;

  return (
    <View style={{ width: RING_SIZE, height: RING_SIZE }} className="items-center justify-center">
      {ring ? (
        <View
          style={{ left: (RING_SIZE - ring) / 2, top: (RING_SIZE - ring) / 2 }}
          className="absolute"
        >
          {/* In gold on a lesson with the star: done in full. */}
          <StepRing steps={lesson.steps} size={ring} gold={complete} />
        </View>
      ) : null}

      <Pressable
        onPress={() => {
          haptics.tap();
          router.push({ pathname: "/lesson/[lessonId]", params: { lessonId: lesson.id } });
        }}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${STATUS_LABEL[lesson.status]}${complete ? ", tudo feito" : ""}`}
        // Face and edge together are what sit centred, in the ring and on the
        // track — centring the face alone left the edge hanging out below.
        style={{ width: size, height: size + DEPTH }}
      >
        {({ pressed }) => (
          <>
            {/* The edge, showing under the face: the button's depth. */}
            <View
              style={{ top: DEPTH, width: size, height: size, backgroundColor: edge }}
              className="absolute rounded-full"
            />

            <View
              style={{
                top: pressed ? DEPTH : 0,
                width: size,
                height: size,
                backgroundColor: face,
                borderColor: border ?? undefined,
                borderWidth: border ? 2 : 0,
              }}
              className="absolute items-center justify-center rounded-full"
            >
              {/* A lesson behind the group is stamped. */}
              {lesson.status === "done" && lesson.type !== "conversation" ? (
                <View
                  style={{ borderColor: content }}
                  className="absolute inset-1.5 rounded-full border-2 border-dashed opacity-50"
                />
              ) : null}

              {lesson.type === "conversation" ? (
                <MessagesSquare color={content} size={current ? 40 : 34} strokeWidth={2.25} />
              ) : (
                <Text
                  style={{ color: content }}
                  className={`font-display ${current ? "text-5xl" : "text-4xl"}`}
                >
                  {lesson.number}
                </Text>
              )}
            </View>

            {complete ? (
              <View
                style={{
                  left: badgeAt - BADGE_SIZE / 2,
                  top: (pressed ? DEPTH : 0) + size - badgeAt - BADGE_SIZE / 2,
                }}
                className="absolute"
              >
                {/* Ringed in the page's background, setting it off the face. */}
                <GoldMarker size={BADGE_SIZE} outline={colors[scheme].background} />
              </View>
            ) : null}
          </>
        )}
      </Pressable>
    </View>
  );
}
