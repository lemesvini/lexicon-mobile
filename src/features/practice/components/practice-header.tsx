import { useEffect } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";
import { router } from "expo-router";
import { Volume2, X } from "lucide-react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { haptics } from "@/lib/haptics";
import { colors } from "@/theme/colors";

type Props = {
  /** 1-based. */
  number: number;
  total: number;
  /** Plays the card out loud. Without it there is no speaker button at all —
   *  speaking practice has nothing to play. */
  onSpeak?: () => void;
  /** Shown but not pressable yet: the audio is still loading. */
  speakDisabled?: boolean;
};

/** A round button floating over the background, as on the cards' screen. */
function RoundButton({
  label,
  onPress,
  disabled,
  children,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={
        onPress
          ? () => {
              haptics.tap();
              onPress();
            }
          : undefined
      }
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      hitSlop={6}
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      }}
      className={`size-12 items-center justify-center rounded-full bg-card active:opacity-70 ${disabled ? "opacity-40" : ""}`}
    >
      {children}
    </Pressable>
  );
}

/** The top of a sitting: a way out, how far through, the card read aloud, and
 *  a bar filling as it goes. */
export default function PracticeHeader({ number, total, onSpeak, speakDisabled }: Props) {
  const palette = colors[useColorScheme() === "dark" ? "dark" : "light"];
  const filled = useSharedValue(0);

  useEffect(() => {
    const progress = total > 0 ? Math.min((number - 1) / total, 1) : 0;
    filled.value = withTiming(progress, { duration: 400, easing: Easing.out(Easing.cubic) });
  }, [number, total, filled]);

  const bar = useAnimatedStyle(() => ({ width: `${filled.value * 100}%` }));

  return (
    <View className="gap-5 px-5 pb-4 pt-6">
      <View className="flex-row items-center justify-between">
        <RoundButton
          label="Fechar"
          onPress={() => router.back()}
        >
          <X color={palette.foreground} size={22} strokeWidth={2.25} />
        </RoundButton>
        <Text
          className="font-sans text-lg font-bold text-foreground"
          accessibilityLabel={`Cartão ${number} de ${total}`}
        >
          {number} de {total}
        </Text>
        {onSpeak ? (
          <RoundButton label="Ouvir em inglês" onPress={onSpeak} disabled={speakDisabled}>
            <Volume2 color={palette.foreground} size={22} strokeWidth={2.25} />
          </RoundButton>
        ) : (
          // The button's room, kept, so the count stays centred.
          <View className="size-12" />
        )}
      </View>
      <View className="h-1.5 overflow-hidden rounded-full bg-border">
        <Animated.View style={bar} className="h-full rounded-full bg-primary" />
      </View>
    </View>
  );
}
