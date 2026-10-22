import { useState } from "react";
import { Text, View } from "react-native";

import { COVER_COLORS } from "@/features/material/brand";
import type { TitleBlock } from "@/features/material/types/title-block";

/** Caprasimo's average advance, as a fraction of its size — enough to size the
 *  headline to its longest line without measuring it. lexicon-web's own. */
const CHAR_WIDTH = 0.62;
const LINE_HEIGHT = 0.95;
/** A portrait card on a phone, where the web's is 16:9 on a projector. */
const ASPECT = 6 / 5;
const PADDING = 28;

/** The size that fits both ways: the longest line across the width, every line
 *  in half the height — and never a wall for a two-word title. */
function headlineSize(lines: string[], width: number): number {
  const inner = width - PADDING * 2;
  const longest = Math.max(...lines.map((line) => line.length), 1);
  const byWidth = inner / (CHAR_WIDTH * longest);
  const byHeight = (width * ASPECT * 0.5) / (lines.length * LINE_HEIGHT);
  return Math.min(byWidth, byHeight, 64);
}

/** "lexicon" with ENGLISH ruled underneath — the printed lockup. */
function Wordmark({ colour }: { colour: string }) {
  return (
    <View className="items-center">
      <Text style={{ color: colour }} className="font-display text-xl lowercase leading-none">
        lexicon
      </Text>
      <Text
        style={{ color: colour, letterSpacing: 2.5, marginRight: -2.5 }}
        className="mt-1 font-sans text-[7px]"
      >
        ENGLISH
      </Text>
    </View>
  );
}

/** The cover: eyebrow and wordmark on top, the headline at the foot. */
export default function TitleView({ block }: { block: TitleBlock }) {
  const [width, setWidth] = useState(0);
  const { background, foreground } = COVER_COLORS[block.color ?? "jade"] ?? COVER_COLORS.jade;
  const lines = block.title.split("\n");
  const size = headlineSize(lines, width);

  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={{ backgroundColor: background, aspectRatio: 1 / ASPECT, padding: PADDING }}
      className="justify-between overflow-hidden rounded-3xl"
    >
      <View className="flex-row items-start justify-between gap-6">
        {block.eyebrow ? (
          <Text style={{ color: foreground }} className="flex-1 font-sans text-sm font-semibold">
            {block.eyebrow}
          </Text>
        ) : (
          <View />
        )}
        {block.hideWordmark ? null : <Wordmark colour={foreground} />}
      </View>

      {/* Measured first: until the card's width is known, a guess would flash. */}
      {width > 0 ? (
        <View className="gap-3">
          <Text
            style={{ color: foreground, fontSize: size, lineHeight: size * LINE_HEIGHT * 1.1 }}
            className="font-display"
          >
            {block.title}
          </Text>
          {block.subtitle ? (
            <Text style={{ color: foreground }} className="font-sans text-base leading-snug opacity-80">
              {block.subtitle}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
