import { useEffect, type ReactNode } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Check, X } from "lucide-react-native";

import type { OptionState } from "@/features/homework/types/option-state";
import { haptics } from "@/lib/haptics";
import { exerciseColors } from "@/theme/colors";

/** Where an option stands — lexicon-web's `optionState`. Once graded, the right
 *  one shows whether or not it was picked, and a wrong pick shows as wrong. */
export function optionState({
  index,
  chosen,
  correct,
}: {
  index: number;
  chosen: number | null;
  /** The right answer once it is released at grading; null before. */
  correct: number | null;
}): OptionState {
  if (correct !== null && index === correct) return "correct";
  if (index !== chosen) return "idle";
  if (correct === null) return "chosen";
  return "incorrect";
}

/** How deep the button is: the edge showing under its face. */
const DEPTH = 4;

type Props = {
  state: OptionState;
  disabled?: boolean;
  onPress?: () => void;
  children: ReactNode;
  /** A full-width answer, or a word-sized chip. */
  variant?: "block" | "chip";
  /** "A", "B" — a block's letter, in its own ring. */
  letter?: string;
  /** A chip already moved into the sentence: left behind as its outline, the
   *  size it was, so nothing around it jumps. */
  hollow?: boolean;
};

/** One answer, as a chunky button with depth: the face sinks onto its edge
 *  while pressed, and swells a little when it is picked. */
export default function OptionButton({
  state,
  disabled,
  onPress,
  children,
  variant = "block",
  letter,
  hollow = false,
}: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const look = exerciseColors[scheme][state];
  const idle = exerciseColors[scheme].idle;
  const pressed = useSharedValue(0);
  const pop = useSharedValue(1);

  useEffect(() => {
    if (state === "chosen") {
      // A small swell, eased — felt more than seen.
      pop.value = withSequence(
        withTiming(1.02, { duration: 140, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 180, easing: Easing.inOut(Easing.quad) }),
      );
    }
  }, [state, pop]);

  const face = useAnimatedStyle(() => ({
    // Most of the way onto the edge, not all of it.
    transform: [{ translateY: pressed.value * (DEPTH - 1) }, { scale: pop.value }],
  }));

  const chip = variant === "chip";

  if (hollow) {
    return (
      <View
        style={{ borderColor: idle.border, marginBottom: DEPTH }}
        className={`rounded-2xl border-2 border-dashed ${chip ? "px-4 py-2.5" : "px-4 py-3.5"}`}
      >
        {/* Invisible, so the outline keeps the word's size. */}
        <Text className="font-sans text-lg font-semibold opacity-0">{children}</Text>
      </View>
    );
  }

  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        haptics.select();
        onPress?.();
      }}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 90, easing: Easing.out(Easing.quad) });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 160, easing: Easing.out(Easing.quad) });
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: state !== "idle", disabled }}
      style={{ paddingBottom: DEPTH }}
      className={chip ? "" : "w-full"}
    >
      {/* The edge: the face's own shape, a shade darker, showing under it. */}
      <View
        style={{ backgroundColor: look.edge, top: DEPTH }}
        className="absolute bottom-0 left-0 right-0 rounded-2xl"
      />
      <Animated.View
        style={[{ backgroundColor: look.face, borderColor: look.border }, face]}
        className={`flex-row items-center gap-3 rounded-2xl border-2 ${chip ? "px-4 py-2.5" : "px-4 py-3.5"}`}
      >
        {letter ? (
          <View
            style={{ borderColor: look.border }}
            className="h-8 w-8 items-center justify-center rounded-xl border-2"
          >
            <Text style={{ color: look.text }} className="font-sans text-sm font-bold">
              {letter}
            </Text>
          </View>
        ) : null}
        <Text
          style={{ color: look.text }}
          className={`font-sans ${chip ? "text-lg font-semibold" : "flex-1 text-base font-medium"}`}
        >
          {children}
        </Text>
        {state === "correct" ? (
          <Check color={look.border} size={20} strokeWidth={3} />
        ) : state === "incorrect" ? (
          <X color={look.text} size={20} strokeWidth={3} />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}
