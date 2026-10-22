import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import { haptics } from "@/lib/haptics";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  lessonId: string;
  lessonName: string;
};

/** The "Continuar" bubble over the group's next lesson. It bobs up and down, to
 *  say where to go — unless the system asks for less motion. Opens the lesson,
 *  as the node under it does. */
export default function ContinueBadge({ lessonId, lessonName }: Props) {
  const reduceMotion = useReducedMotion();
  const offsetY = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    offsetY.value = withRepeat(
      withTiming(-5, { duration: 700, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    return () => cancelAnimation(offsetY);
  }, [reduceMotion, offsetY]);

  const bob = useAnimatedStyle(() => ({ transform: [{ translateY: offsetY.value }] }));

  return (
    <Animated.View style={bob} className="items-center">
      <Pressable
        onPress={() => {
          haptics.tap();
          router.push({ pathname: "/lesson/[lessonId]", params: { lessonId } });
        }}
        accessibilityRole="button"
        accessibilityLabel={`Continuar: ${lessonName}`}
        className="rounded-xl bg-primary px-5 py-2.5 active:opacity-80"
      >
        <Text className="font-sans text-sm font-bold uppercase tracking-widest text-primary-foreground">
          Continuar
        </Text>
      </Pressable>
      {/* The point, towards the node. */}
      <View className="-mt-1.5 h-3 w-3 rotate-45 bg-primary" />
    </Animated.View>
  );
}
