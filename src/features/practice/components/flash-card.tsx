import { useEffect } from "react";
import { Text, View, useColorScheme } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Mic } from "lucide-react-native";

import type { CardResult } from "@/features/practice/types/card-result";
import type { SpeakingCard } from "@/features/practice/types/speaking-card";
import { colors, practiceColors } from "@/theme/colors";

type Props = {
  card: SpeakingCard;
  /** Showing the English. */
  flipped: boolean;
  /** How the go just made turned out, once there is one. */
  result: CardResult | null;
  /** The line at the foot of the front. */
  hint: string;
};

/** Half a turn, eased: long enough to see it turn over, short enough not to wait on. */
const FLIP_MS = 420;

/** A small uppercase label: "COMO SE DIZ". */
function Eyebrow({ children }: { children: string }) {
  return (
    <Text className="font-sans text-sm font-bold uppercase tracking-[2px] text-muted-foreground">
      {children}
    </Text>
  );
}

/** The answer, word by word: those not heard in the student's go marked in
 *  terracotta, so they can see what was missing. */
function Answer({ text, result }: { text: string; result: CardResult | null }) {
  const forgot = practiceColors[useColorScheme() === "dark" ? "dark" : "light"].forgot;

  return (
    <Text className="text-center font-display text-[40px] leading-[48px] text-accent-foreground">
      {result?.words
        ? result.words.map((word, index) => (
            <Text
              key={index}
              style={word.matched ? undefined : { color: forgot.text, textDecorationLine: "underline" }}
            >
              {index > 0 ? " " : ""}
              {word.text}
            </Text>
          ))
        : text}
    </Text>
  );
}

/**
 * One card, as a card: the Portuguese on the front, the English on the back,
 * turning over when `flipped` changes. Both faces are always drawn, back to
 * back, and the turn hides whichever is facing away.
 */
export default function FlashCard({ card, flipped, result, hint }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const palette = colors[scheme];
  const backLook = practiceColors[scheme].back;
  const turn = useSharedValue(flipped ? 1 : 0);

  useEffect(() => {
    turn.value = withTiming(flipped ? 1 : 0, {
      duration: FLIP_MS,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [flipped, turn]);

  // Opacity as well as backface-visibility: Android doesn't always honour the
  // latter, and a face seen through its back reads mirrored.
  const front = useAnimatedStyle(() => ({
    opacity: turn.value < 0.5 ? 1 : 0,
    transform: [{ perspective: 1200 }, { rotateY: `${interpolate(turn.value, [0, 1], [0, 180])}deg` }],
  }));
  const back = useAnimatedStyle(() => ({
    opacity: turn.value >= 0.5 ? 1 : 0,
    transform: [{ perspective: 1200 }, { rotateY: `${interpolate(turn.value, [0, 1], [180, 360])}deg` }],
  }));

  const face = "absolute inset-0 rounded-[32px] border px-7 py-8";

  return (
    <View className="flex-1">
      <Animated.View
        style={[{ backfaceVisibility: "hidden" }, front]}
        className={`${face} border-border bg-card`}
        pointerEvents={flipped ? "none" : "auto"}
        accessibilityElementsHidden={flipped}
        importantForAccessibility={flipped ? "no-hide-descendants" : "auto"}
      >
        <View className="flex-row items-center justify-between gap-3">
          <Eyebrow>Como se diz</Eyebrow>
          {card.lessonTitle ? (
            <Text
              numberOfLines={1}
              className="max-w-[60%] overflow-hidden rounded-full bg-secondary px-3.5 py-1.5 font-sans text-sm font-semibold text-secondary-foreground"
            >
              {card.lessonTitle}
            </Text>
          ) : null}
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-center font-sans text-[40px] font-bold leading-[48px] text-foreground">
            {card.prompt}
          </Text>
        </View>
        <View className="flex-row items-center justify-center gap-2">
          <Mic color={palette.mutedForeground} size={18} strokeWidth={2.25} />
          <Text className="font-sans text-base text-muted-foreground">{hint}</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          { backfaceVisibility: "hidden", backgroundColor: backLook.face, borderColor: backLook.border },
          back,
        ]}
        className={face}
        pointerEvents={flipped ? "auto" : "none"}
        accessibilityElementsHidden={!flipped}
        importantForAccessibility={flipped ? "auto" : "no-hide-descendants"}
      >
        <View className="flex-row items-center justify-between gap-3">
          <Eyebrow>Em inglês</Eyebrow>
          <Text numberOfLines={1} className="max-w-[60%] font-sans text-sm font-semibold text-accent-foreground/80">
            {card.prompt}
          </Text>
        </View>
        <View className="flex-1 items-center justify-center gap-4">
          <Answer text={card.answer} result={result} />
          {card.example ? (
            <Text className="text-center font-sans text-lg leading-7 text-accent-foreground/75">
              {card.example}
            </Text>
          ) : null}
          {result?.heard ? (
            <Text className="mt-2 text-center font-sans text-sm italic text-accent-foreground/60">
              Você disse: “{result.heard}”
            </Text>
          ) : null}
        </View>
        {card.lessonTitle ? (
          <Text className="text-center font-sans text-sm font-semibold text-accent-foreground/70">
            {card.lessonTitle}
          </Text>
        ) : null}
      </Animated.View>
    </View>
  );
}
