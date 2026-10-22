import { useEffect } from "react";
import { Text, View, useColorScheme } from "react-native";
import { CalendarClock, CloudOff, Trophy } from "lucide-react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";

import GoldMarker from "@/features/lessons/components/gold-marker";
import CardStack from "@/features/practice/components/card-stack";
import Confetti from "@/features/practice/components/confetti";
import type { CardOutcome } from "@/features/practice/types/card-outcome";
import type { CardRating } from "@/features/practice/types/card-rating";
import { haptics } from "@/lib/haptics";
import { colors, practiceColors } from "@/theme/colors";

const ORDER: CardRating[] = ["remembered", "almost", "forgot"];

type Props = {
  /** The card's eyebrow: "Speaking Practice". */
  title: string;
  outcomes: CardOutcome[];
  failedSaves: number;
  /** The skill's names for the three ratings. */
  labels: Record<CardRating, string>;
  /** What was practised, by count: "12 cartões em voz alta". */
  practised: (count: number) => string;
};

/** A headline for how it went, by the share of cards got right. */
function headline(right: number, total: number): string {
  if (total === 0 || right === total) return "Mandou bem!";
  if (right / total >= 0.6) return "Boa prática!";
  return "Prática concluída";
}

/**
 * The end of a sitting, as the last card on the deck — CaughtUp's card, with the
 * gold coin of a "Now you can" where its check is: how many went each way, and that they come back
 * by how they went. Arrives with a cheer you can feel.
 */
export default function SessionSummary({
  title,
  outcomes,
  failedSaves,
  labels,
  practised,
}: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const palette = colors[scheme];
  const look = practiceColors[scheme];

  const counts = ORDER.map((rating) => ({
    rating,
    count: outcomes.filter((outcome) => outcome.rating === rating).length,
  }));
  const right = counts[0]!.count;

  // The whole sitting done: the biggest buzz the app has, once.
  useEffect(() => {
    haptics.celebrate();
  }, []);

  return (
    <View className="flex-1">
      <CardStack>
        <Animated.View
          entering={FadeIn.duration(220)}
          className="flex-1 rounded-[32px] border border-border bg-card px-7 py-8"
        >
          <Text className="font-sans text-sm font-bold uppercase tracking-[2px] text-muted-foreground">
            {title}
          </Text>

          <View className="flex-1 items-center justify-center gap-7">
            <Animated.View
              entering={ZoomIn.delay(120)
                .springify()
                .damping(14)
                .stiffness(170)}
              style={{ backgroundColor: look.almost.background }}
              className="size-32 items-center justify-center rounded-full"
            >
              {/* The "Now you can" coin, ribbons and all, with a trophy stamped
                on it. Nudged up so the ribbons hang inside the halo. */}
              <View style={{ marginTop: -18 }}>
                <GoldMarker size={76} icon={Trophy} />
              </View>
            </Animated.View>

            <View className="items-center gap-2">
              <Text className="text-center font-display text-4xl text-secondary-foreground">
                {headline(right, outcomes.length)}
              </Text>
              <Text className="text-center font-sans text-lg leading-7 text-muted-foreground">
                {practised(outcomes.length)}.
              </Text>
            </View>

            <View className="w-full flex-row gap-3">
              {counts.map(({ rating, count }, index) => (
                <Animated.View
                  key={rating}
                  entering={FadeInDown.delay(320 + index * 90).duration(260)}
                  style={{ backgroundColor: look[rating].background }}
                  className="flex-1 items-center gap-0.5 rounded-2xl px-2 py-3"
                >
                  <Text
                    style={{ color: look[rating].text }}
                    className="font-display text-3xl"
                  >
                    {count}
                  </Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{ color: look[rating].text }}
                    className="font-sans text-sm font-semibold"
                  >
                    {labels[rating]}
                  </Text>
                </Animated.View>
              ))}
            </View>
          </View>

          <View className="flex-row items-center justify-center gap-2">
            {failedSaves > 0 ? (
              <>
                <CloudOff
                  color={palette.mutedForeground}
                  size={18}
                  strokeWidth={2.25}
                />
                <Text className="shrink font-sans text-base text-muted-foreground">
                  {failedSaves === 1
                    ? "Um resultado não foi salvo"
                    : `${failedSaves} resultados não foram salvos`}
                </Text>
              </>
            ) : (
              <>
                <CalendarClock
                  color={palette.mutedForeground}
                  size={18}
                  strokeWidth={2.25}
                />
                <Text className="shrink font-sans text-base text-muted-foreground">
                  Voltam conforme você acertou
                </Text>
              </>
            )}
          </View>
        </Animated.View>
      </CardStack>
      {/* Over the card, bursting from about where the coin is. */}
      <Confetti originY={0.36} />
    </View>
  );
}
