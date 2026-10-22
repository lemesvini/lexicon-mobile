import { Text, View } from "react-native";
import { Image } from "expo-image";

import { COVER_COLORS, FOREST, SAND } from "@/features/material/brand";
import type { CanDoBlock } from "@/features/material/types/can-do-block";

// The "now you CAN" badge — lexicon-web/public/cando.png.
const BADGE = require("../../../../../assets/images/cando.png");
/** The badge's own proportions, 893 × 1110. */
const BADGE_ASPECT = 893 / 1110;

/** The closing slide: a sand card on the slide's ground, with "Now you can",
 *  the can-do, the badge and a sign-off. Stacked, where the web's sits side by
 *  side on a projector. The card is always sand with forest type, whatever it
 *  sits on. */
export default function CanDoView({ block }: { block: CanDoBlock }) {
  const { background } = COVER_COLORS[block.color ?? "forest"] ?? COVER_COLORS.forest;

  return (
    <View style={{ backgroundColor: background }} className="rounded-3xl p-3.5">
      <View
        style={{ backgroundColor: SAND, shadowColor: FOREST }}
        className="gap-6 rounded-2xl px-6 py-7 shadow-md"
      >
        <View className="gap-3">
          {block.eyebrow ? (
            <Text
              style={{ color: FOREST }}
              className="font-sans text-xs uppercase tracking-[1.5px] opacity-75"
            >
              {block.eyebrow}
            </Text>
          ) : null}
          <Text style={{ color: FOREST }} className="font-display text-4xl leading-tight">
            Now you can
          </Text>
          <Text style={{ color: FOREST }} className="font-sans text-xl leading-snug">
            {block.text}
          </Text>
        </View>

        <Image
          source={BADGE}
          contentFit="contain"
          accessibilityLabel="Lexicon — now you can"
          style={{ height: 180, aspectRatio: BADGE_ASPECT, alignSelf: "center" }}
        />

        <View
          style={{ borderTopColor: `${FOREST}26` }}
          className="flex-row items-baseline justify-between border-t pt-4"
        >
          <Text style={{ color: FOREST }} className="font-display text-2xl">
            Thank you
          </Text>
          <Text style={{ color: FOREST }} className="font-sans text-sm opacity-70">
            See you next class
          </Text>
        </View>
      </View>
    </View>
  );
}
