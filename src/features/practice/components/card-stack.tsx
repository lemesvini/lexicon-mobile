import type { ReactNode } from "react";
import { View, useColorScheme } from "react-native";

import { practiceColors } from "@/theme/colors";

/** How far each card underneath shows below the one above it. */
const STEP = 13;
/** How much narrower each card underneath is, on each side. */
const INSET = [22, 50];

const SHADOW = {
  shadowColor: "#000",
  shadowOpacity: 0.07,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 8 },
  elevation: 4,
} as const;

/** The deck: the card on top, and the rounded bottoms of two more peeking out
 *  under it, narrower and darker as they go down. Always two — it's the look
 *  of a deck, not a count of what's left. */
export default function CardStack({ children }: { children: ReactNode }) {
  const card = practiceColors[useColorScheme() === "dark" ? "dark" : "light"].card;

  return (
    <View style={{ marginBottom: STEP * 2 }} className="flex-1">
      {[2, 1].map((layer) => (
        <View
          key={layer}
          style={{
            ...SHADOW,
            position: "absolute",
            left: INSET[layer - 1],
            right: INSET[layer - 1],
            top: STEP * layer,
            bottom: -STEP * layer,
            backgroundColor: layer === 1 ? card.border : card.edge,
          }}
          className="rounded-[32px]"
        />
      ))}
      <View style={SHADOW} className="flex-1">
        {children}
      </View>
    </View>
  );
}
