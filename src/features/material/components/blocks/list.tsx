import { Text, View } from "react-native";

import { BlockLabel, BlockNote } from "@/features/material/components/block-chrome";
import { renderInline } from "@/features/material/inline";
import type { ListBlock } from "@/features/material/types/list-block";

/** The marker in a fixed-width slot, so every style lines its text up on the
 *  same edge. */
function Marker({ style, index }: { style: ListBlock["style"]; index: number }) {
  return (
    <View className="w-7 items-center pt-0.5">
      {style === "numbered" ? (
        <View className="h-7 w-7 items-center justify-center rounded-full border-[1.5px] border-foreground/50">
          <Text className="font-sans text-sm font-medium text-foreground">{index + 1}</Text>
        </View>
      ) : style === "checklist" ? (
        <View className="mt-0.5 h-5 w-5 rounded-md border-2 border-muted-foreground/35" />
      ) : (
        <View className="mt-2.5 h-1.5 w-1.5 rounded-full bg-primary/70" />
      )}
    </View>
  );
}

/** An item in its own tinted card. With more than one line, the first is the
 *  card's heading — "What you see" over "Pick three cards…". */
function CardItem({ item, style, index }: { item: string; style: ListBlock["style"]; index: number }) {
  const [first = "", ...rest] = item.split("\n");
  const body = rest.join("\n").trim();

  return (
    <View className="flex-row gap-3.5 rounded-2xl border border-primary/25 bg-primary/5 px-4 py-3.5">
      <Marker style={style} index={index} />
      <View className="flex-1 gap-1">
        {body ? (
          <>
            <Text className="font-sans text-lg font-semibold leading-snug text-foreground">
              {renderInline(first)}
            </Text>
            <Text className="font-sans text-base leading-relaxed text-foreground/85">
              {renderInline(body)}
            </Text>
          </>
        ) : (
          <Text className="font-sans text-[17px] leading-[27px] text-foreground">
            {renderInline(item)}
          </Text>
        )}
      </View>
    </View>
  );
}

/** A numbered, bulleted or checklist list, as lines or as cards. */
export default function ListView({ block }: { block: ListBlock }) {
  return (
    <View className="gap-3">
      {block.label ? <BlockLabel>{block.label}</BlockLabel> : null}
      <View className={block.cards ? "gap-3" : "gap-2.5"}>
        {block.items.map((item, index) =>
          block.cards ? (
            <CardItem key={index} item={item} style={block.style} index={index} />
          ) : (
            <View key={index} className="flex-row gap-3">
              <Marker style={block.style} index={index} />
              <Text className="flex-1 font-sans text-[17px] leading-[27px] text-foreground">
                {renderInline(item)}
              </Text>
            </View>
          ),
        )}
      </View>
      {block.note ? <BlockNote text={block.note} /> : null}
    </View>
  );
}
