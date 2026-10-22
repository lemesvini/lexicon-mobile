import { View, useColorScheme } from "react-native";
import { Check, X } from "lucide-react-native";

import GoldMarker from "@/features/lessons/components/gold-marker";
import type { StepMarkerState } from "@/features/lessons/types/step-marker-state";
import { colors, pathColors } from "@/theme/colors";

type Props = {
  state: StepMarkerState;
  /** Done as a gold star coin rather than in primary — a "Now you can". */
  gold?: boolean;
  size?: number;
};

/** The gold coin, against the others' size. */
const GOLD_SCALE = 38 / 30;

/** The round marker of one of a lesson's steps: done, begun, missed, or still
 *  to come. A missed class takes the same terracotta as on the path. */
export default function StepMarker({ state, gold = false, size = 30 }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const theme = colors[scheme];
  const missed = pathColors[scheme].missed;
  const box = { width: size, height: size };
  const goldSize = Math.round(size * GOLD_SCALE);
  const icon = size * 0.56;

  switch (state) {
    case "done":
      if (gold) {
        // Bigger than the rest, but laid out at their size so the line
        // between the steps stays straight.
        return (
          <View style={{ margin: (size - goldSize) / 2 }}>
            <GoldMarker size={goldSize} />
          </View>
        );
      }
      return (
        <View style={box} className="items-center justify-center rounded-full bg-primary">
          <Check color={theme.primaryForeground} size={icon} strokeWidth={3} />
        </View>
      );
    case "partial":
      // Half filled: begun, not handed in.
      return (
        <View style={box} className="overflow-hidden rounded-full border-2 border-primary">
          <View className="absolute bottom-0 left-0 top-0 w-1/2 bg-primary" />
        </View>
      );
    case "missed":
      return (
        <View
          style={[box, { backgroundColor: missed.background, borderColor: missed.border }]}
          className="items-center justify-center rounded-full border-2"
        >
          <X color={missed.text} size={icon * 0.95} strokeWidth={3} />
        </View>
      );
    case "empty":
      return (
        <View style={box} className="rounded-full border-2 border-dashed border-muted-foreground/60" />
      );
  }
}
