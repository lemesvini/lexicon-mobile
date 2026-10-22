import { Text, View } from "react-native";

import { BlockLabel, BlockNote } from "@/features/material/components/block-chrome";
import { renderInline } from "@/features/material/inline";
import type { DialogBlock } from "@/features/material/types/dialog-block";

/** Each speaker's side, by first appearance: the first on the left, the
 *  second on the right, and alternating after — lexicon-web's sideResolver. */
function sideResolver(lines: DialogBlock["lines"]) {
  const order: string[] = [];
  for (const line of lines) if (!order.includes(line.speaker)) order.push(line.speaker);
  return (speaker: string): "left" | "right" =>
    order.indexOf(speaker) % 2 === 0 ? "left" : "right";
}

/** An exchange, drawn as a chat. A speaker is named only where their run of
 *  lines starts. */
export default function DialogView({ block }: { block: DialogBlock }) {
  const sideOf = sideResolver(block.lines);

  return (
    <View className="gap-2.5">
      {block.label ? <BlockLabel>{block.label}</BlockLabel> : null}
      <View className="gap-2 rounded-3xl border border-border bg-card/40 px-3.5 py-4">
        {block.lines.map((line, index) => {
          const right = sideOf(line.speaker) === "right";
          const startsRun = index === 0 || block.lines[index - 1]!.speaker !== line.speaker;
          return (
            <View
              key={index}
              className={`gap-1 ${startsRun && index > 0 ? "mt-1.5" : ""} ${right ? "items-end" : "items-start"}`}
            >
              {startsRun ? (
                <Text className="px-1 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {line.speaker}
                </Text>
              ) : null}
              <View
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${right ? "rounded-tr-sm bg-primary" : "rounded-tl-sm bg-muted"}`}
              >
                <Text
                  className={`font-sans text-base leading-relaxed ${right ? "text-primary-foreground" : "text-foreground"}`}
                >
                  {renderInline(line.text)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      {block.note ? <BlockNote text={block.note} /> : null}
    </View>
  );
}
