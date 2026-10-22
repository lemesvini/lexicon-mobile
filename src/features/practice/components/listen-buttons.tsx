import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, View, useColorScheme } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Snail, Volume2 } from "lucide-react-native";

import { haptics } from "@/lib/haptics";
import { pathColors, practiceColors } from "@/theme/colors";

/** How deep the buttons are: the edge showing under their face. */
const DEPTH = 5;

/** A chunky button, like the path's nodes: the face sinks onto its edge while
 *  pressed. */
function ChunkyButton({
  face,
  edge,
  border,
  size,
  label,
  disabled,
  onPress,
  children,
}: {
  face: string;
  edge: string;
  border?: string;
  size: number;
  label: string;
  disabled?: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  const pressed = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: pressed.value * (DEPTH - 1) }] }));

  return (
    <Pressable
      onPress={() => {
        haptics.tap();
        onPress();
      }}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 90, easing: Easing.out(Easing.quad) });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 160, easing: Easing.out(Easing.quad) });
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={{ width: size, height: size + DEPTH, opacity: disabled ? 0.6 : 1 }}
    >
      <View
        style={{ backgroundColor: edge, top: DEPTH, height: size }}
        className="absolute left-0 right-0 rounded-3xl"
      />
      <Animated.View
        style={[
          { backgroundColor: face, height: size, borderColor: border ?? face, borderWidth: border ? 2 : 0 },
          style,
        ]}
        className="items-center justify-center rounded-3xl"
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  ready: boolean;
  /** Which speed is playing, or null. */
  playing: number | null;
  onPlay: () => void;
  onPlaySlow: () => void;
};

/** The sentence, to hear: a big button for it at full speed, a small one with a
 *  snail for slowly. */
export default function ListenButtons({ ready, playing, onPlay, onPlaySlow }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const node = pathColors[scheme].lesson;
  const card = practiceColors[scheme].card;
  const slowIcon = practiceColors[scheme].listening.icon;

  return (
    <View className="flex-row items-end justify-center gap-4">
      <ChunkyButton
        face={node.face}
        edge={node.edge}
        size={112}
        label="Ouvir a frase"
        disabled={!ready}
        onPress={onPlay}
      >
        {ready ? (
          <Volume2
            color={node.content}
            size={52}
            strokeWidth={2.25}
            style={{ opacity: playing === 1 ? 0.7 : 1 }}
          />
        ) : (
          <ActivityIndicator color={node.content} />
        )}
      </ChunkyButton>
      <ChunkyButton
        face={card.face}
        edge={card.edge}
        border={card.border}
        size={72}
        label="Ouvir devagar"
        disabled={!ready}
        onPress={onPlaySlow}
      >
        <Snail color={slowIcon} size={32} strokeWidth={2.25} style={{ opacity: playing !== null && playing < 1 ? 0.6 : 1 }} />
      </ChunkyButton>
    </View>
  );
}
