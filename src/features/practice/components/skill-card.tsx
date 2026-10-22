import { Pressable, Text, View, useColorScheme } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BookOpen, Headphones, type LucideIcon, Mic, PenLine } from "lucide-react-native";

import type { Skill } from "@/features/practice/types/skill";
import type { SkillPractice } from "@/features/practice/types/skill-practice";
import { haptics } from "@/lib/haptics";
import { practiceColors } from "@/theme/colors";

/** How deep the card is: the edge showing under its face. */
const DEPTH = 5;

const SKILLS: Record<Skill, { title: string; icon: LucideIcon }> = {
  listening: { title: "Listening", icon: Headphones },
  speaking: { title: "Speaking", icon: Mic },
  reading: { title: "Reading", icon: BookOpen },
  writing: { title: "Writing", icon: PenLine },
};

/** One skill to practise, as a chunky card: the face sinks onto its edge while
 *  pressed. Without `onPress`, it goes nowhere yet. */
export default function SkillCard({
  practice,
  onPress,
}: {
  practice: SkillPractice;
  onPress?: () => void;
}) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const card = practiceColors[scheme].card;
  const look = practiceColors[scheme][practice.skill];
  const { title, icon: Icon } = SKILLS[practice.skill];
  const pressed = useSharedValue(0);

  const face = useAnimatedStyle(() => ({
    // Most of the way onto the edge, not all of it.
    transform: [{ translateY: pressed.value * (DEPTH - 1) }],
  }));

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
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 90, easing: Easing.out(Easing.quad) });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 160, easing: Easing.out(Easing.quad) });
      }}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${practice.subtitle}, ${practice.meta}`}
      style={{ paddingBottom: DEPTH }}
      className="flex-1"
    >
      <View
        style={{ backgroundColor: card.edge, top: DEPTH }}
        className="absolute bottom-0 left-0 right-0 rounded-[28px]"
      />
      <Animated.View
        style={[{ backgroundColor: card.face, borderColor: card.border }, face]}
        className="min-h-[140px] flex-1 rounded-[28px] border p-5"
      >
        <View className="flex-row items-start justify-between">
          <View
            style={{ backgroundColor: look.tint }}
            className="size-14 items-center justify-center rounded-full"
          >
            <Icon size={26} color={look.icon} strokeWidth={2} />
          </View>
          <Text className="font-sans text-sm font-bold text-muted-foreground">{practice.meta}</Text>
        </View>
        {/* Pushes the words to the bottom, so a short subtitle doesn't leave a gap under it. */}
        <View className="min-h-3 flex-1" />
        <Text className="font-display text-3xl font-bold text-primary" numberOfLines={1}>
          {title}
        </Text>
        {/* <Text className="mt-1 font-sans text-base text-muted-foreground" numberOfLines={2}>
          {practice.subtitle}
        </Text> */}
      </Animated.View>
    </Pressable>
  );
}
