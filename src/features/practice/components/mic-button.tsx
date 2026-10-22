import { useEffect } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Mic, Square } from "lucide-react-native";

import { colors } from "@/theme/colors";

type Props = {
  listening: boolean;
  disabled?: boolean;
  onPress: () => void;
};

/** One breath of the halo while listening. */
const PULSE_MS = 1100;

/**
 * The microphone: tap to speak, tap again when done. While it listens, a halo
 * breathes out from it — the screen is waiting on the student's voice, not
 * loading.
 */
export default function MicButton({ listening, disabled, onPress }: Props) {
  const palette = colors[useColorScheme() === "dark" ? "dark" : "light"];
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (listening) {
      pulse.value = 0;
      pulse.value = withRepeat(withTiming(1, { duration: PULSE_MS, easing: Easing.out(Easing.quad) }), -1);
    } else {
      cancelAnimation(pulse);
      pulse.value = withTiming(0, { duration: 150 });
    }
  }, [listening, pulse]);

  const halo = useAnimatedStyle(() => ({
    opacity: listening ? 0.35 * (1 - pulse.value) : 0,
    transform: [{ scaleX: 1 + pulse.value * 0.08 }, { scaleY: 1 + pulse.value * 0.35 }],
  }));

  return (
    <View className="justify-center">
      <Animated.View style={halo} className="absolute inset-0 rounded-full bg-primary" />
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={listening ? "Parar de gravar" : "Falar em inglês"}
        accessibilityState={{ disabled }}
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        }}
        className={`min-h-[60px] flex-row items-center justify-center gap-2.5 rounded-full bg-primary px-5 active:opacity-80 ${
          disabled ? "opacity-50" : ""
        }`}
      >
        {listening ? (
          <Square color={palette.primaryForeground} fill={palette.primaryForeground} size={16} />
        ) : (
          <Mic color={palette.primaryForeground} size={22} strokeWidth={2.25} />
        )}
        <Text className="font-sans text-lg font-bold text-primary-foreground">
          {listening ? "Ouvindo… toque para parar" : "Falar em inglês"}
        </Text>
      </Pressable>
    </View>
  );
}
