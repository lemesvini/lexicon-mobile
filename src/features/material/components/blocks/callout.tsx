import { Text, View } from "react-native";

import { renderInline } from "@/features/material/inline";
import type { CalloutBlock } from "@/features/material/types/callout-block";

/** By colour token — lexicon-web's `calloutClasses`, dark variants included.
 *  Green is the brand's, as on the web: the same green the list cards use. */
const TONES: Record<string, string> = {
  blue_bg: "bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-900",
  green_bg: "bg-primary/10 border-primary/30",
  yellow_bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900",
  gray_bg: "bg-neutral-50 border-neutral-200 dark:bg-neutral-900/60 dark:border-neutral-800",
  red_bg: "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-900",
};

/** A boxed note, its emoji in a ring. */
export default function CalloutView({ block }: { block: CalloutBlock }) {
  const tone = TONES[block.color ?? ""] ?? TONES.blue_bg;

  return (
    <View className={`flex-row items-start gap-3.5 rounded-2xl border px-4 py-4 ${tone}`}>
      {block.icon ? (
        <View className="h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-foreground/25">
          <Text className="text-lg">{block.icon}</Text>
        </View>
      ) : null}
      <View className="flex-1 gap-1">
        {block.title ? (
          <Text className="font-sans text-lg font-semibold leading-snug text-foreground">
            {block.title}
          </Text>
        ) : null}
        {block.body ? (
          <Text className="font-sans text-base leading-relaxed text-foreground/85">
            {renderInline(block.body)}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
