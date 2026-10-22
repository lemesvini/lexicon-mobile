import { Text, View, useColorScheme } from "react-native";
import { CalendarClock, Check } from "lucide-react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

import CardStack from "@/features/practice/components/card-stack";
import { colors, practiceColors } from "@/theme/colors";

type Props = {
  /** The card's eyebrow: "Speaking Practice". */
  title?: string;
  /** What has all been done: "todos os cartões de hoje". */
  done?: string;
  /** When more will come. */
  upcoming?: string;
};

/** No cards due: the deck still on the table, its top card a check — nothing
 *  left to do today — and when more will come. */
export default function CaughtUp({
  title = "Speaking Practice",
  done = "todos os cartões de hoje",
  upcoming = "Novos cartões chegam depois das próximas aulas",
}: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const palette = colors[scheme];
  const remembered = practiceColors[scheme].remembered;

  return (
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
            entering={ZoomIn.delay(120).springify().damping(22).stiffness(180)}
            style={{ backgroundColor: remembered.background }}
            className="size-32 items-center justify-center rounded-full"
          >
            <View className="size-20 items-center justify-center rounded-full bg-primary">
              <Check color={palette.primaryForeground} size={40} strokeWidth={3} />
            </View>
          </Animated.View>
          <View className="items-center gap-2">
            <Text className="text-center font-display text-4xl text-secondary-foreground">Tudo em dia</Text>
            <Text className="text-center font-sans text-lg leading-7 text-muted-foreground">
              Você já praticou {done}.
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-center gap-2">
          <CalendarClock color={palette.mutedForeground} size={18} strokeWidth={2.25} />
          <Text className="shrink font-sans text-base text-muted-foreground">
            {upcoming}
          </Text>
        </View>
      </Animated.View>
    </CardStack>
  );
}
