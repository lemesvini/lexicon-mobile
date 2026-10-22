import { useEffect } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";
import { router } from "expo-router";
import { CloudCheck, CloudOff, X } from "lucide-react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import type { ProgressSignal } from "@/features/material/types/progress-signal";
import { haptics } from "@/lib/haptics";
import { colors, pathColors } from "@/theme/colors";

type Props = {
  /** The page's name: a slide's stage, a question. */
  title: string;
  /** What the ring shows in its middle. */
  number: number;
  /** How full the ring is, 0–1: how far through a material, how much of a
   *  homework is answered. */
  progress: number;
  /** What the ring says to a screen reader: "Etapa 3 de 10". */
  progressLabel: string;
  /** Shows in the ring for a moment, in place of the number. */
  signal?: ProgressSignal;
};

const SIZE = 52;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** One beat of the cloud's pulse, out or back. */
const BEAT = 240;
/** How far it swells on a beat. */
const SWELL = 1.08;
const EASE = Easing.inOut(Easing.quad);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** How far through, as a ring filling clockwise from the top, with the number
 *  in the middle. One continuous arc: a dozen pages would leave segments
 *  thinner than the gaps between them. It slides to a new value rather than
 *  jumping, and draws nothing at none — a round cap would otherwise leave a dot
 *  at the top that reads as a start. A save shows as a cloud that pulses twice
 *  where the number is, and gives the number back. */
function CountRing({ number, progress, label, signal }: {
  number: number;
  progress: number;
  label: string;
  signal?: ProgressSignal;
}) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const theme = colors[scheme];
  const filled = useSharedValue(progress);
  const cloud = useSharedValue(0);
  const beat = useSharedValue(1);
  // The signal stays until the next one, so its kind holds while it fades out.
  const kind = signal?.kind ?? "saved";

  useEffect(() => {
    filled.value = withTiming(Math.min(Math.max(progress, 0), 1), {
      duration: 450,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, filled]);

  useEffect(() => {
    if (!signal) return;
    cloud.value = withSequence(
      withTiming(1, { duration: 180, easing: EASE }),
      withDelay(BEAT * 4, withTiming(0, { duration: 260, easing: EASE })),
    );
    beat.value = withSequence(
      withTiming(SWELL, { duration: BEAT, easing: EASE }),
      withTiming(1, { duration: BEAT, easing: EASE }),
      withTiming(SWELL, { duration: BEAT, easing: EASE }),
      withTiming(1, { duration: BEAT, easing: EASE }),
    );
  }, [signal, cloud, beat]);

  const arc = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - filled.value),
    strokeOpacity: filled.value > 0.001 ? 1 : 0,
  }));
  const numberStyle = useAnimatedStyle(() => ({ opacity: 1 - cloud.value }));
  const cloudStyle = useAnimatedStyle(() => ({
    opacity: cloud.value,
    transform: [{ scale: beat.value }],
  }));

  const Icon = kind === "error" ? CloudOff : CloudCheck;
  const iconColour = kind === "error" ? pathColors[scheme].missed.text : theme.primary;

  return (
    <View
      style={{ width: SIZE, height: SIZE }}
      className="items-center justify-center"
      accessible
      accessibilityLabel={label}
    >
      <Svg width={SIZE} height={SIZE} style={{ position: "absolute" }}>
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke={theme.border} strokeWidth={STROKE} fill="none" />
        {/* Turned back a quarter, so it starts at the top. */}
        <AnimatedCircle
          animatedProps={arc}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={theme.primary}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          fill="none"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>
      <Animated.Text style={numberStyle} className="font-display text-xl text-foreground">
        {number}
      </Animated.Text>
      <Animated.View style={cloudStyle} className="absolute">
        <Icon color={iconColour} size={22} strokeWidth={2.25} />
      </Animated.View>
    </View>
  );
}

/** The top of a viewer, with no header to hold it: how far through, the page's
 *  name, and a way out. */
export default function SlideProgress({ title, number, progress, progressLabel, signal }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <View className="flex-row items-center gap-3.5 px-5 pb-5 pt-6">
      <CountRing number={number} progress={progress} label={progressLabel} signal={signal} />
      <Text numberOfLines={2} className="flex-1 font-display text-2xl leading-tight text-foreground">
        {title}
      </Text>
      <Pressable
        onPress={() => {
          haptics.tap();
          router.back();
        }}
        accessibilityRole="button"
        accessibilityLabel="Fechar"
        hitSlop={8}
        className="h-10 w-10 items-center justify-center rounded-full bg-muted active:opacity-70"
      >
        <X color={colors[scheme].foreground} size={20} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}
