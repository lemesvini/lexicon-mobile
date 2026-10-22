import { Text, View } from "react-native";

import { BlockLabel, BlockNote } from "@/features/material/components/block-chrome";
import { renderInline } from "@/features/material/inline";
import type { TextBlock } from "@/features/material/types/text-block";

/** A paragraph. */
export default function TextView({ block }: { block: TextBlock }) {
  return (
    <View className="gap-2">
      {block.label ? <BlockLabel>{block.label}</BlockLabel> : null}
      <Text className="font-sans text-[17px] leading-[27px] text-foreground">
        {renderInline(block.body)}
      </Text>
      {block.note ? <BlockNote text={block.note} /> : null}
    </View>
  );
}
