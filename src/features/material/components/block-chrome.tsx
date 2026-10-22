import { Text, View } from "react-native";

import { renderInline } from "@/features/material/inline";

// What every block's label and note look like — lexicon-web's view-ui.tsx.
// Kept in one place so a slide reads as one designed surface.

/** Small uppercase line above a block. */
export function BlockLabel({ children }: { children: string }) {
  return (
    <Text className="font-sans text-xs font-semibold uppercase tracking-[2px] text-primary/80">
      {children}
    </Text>
  );
}

/** A quiet footnote below a block, ruled on the left. */
export function BlockNote({ text }: { text: string }) {
  return (
    <View className="border-l-2 border-border pl-3">
      <Text className="font-sans text-sm italic leading-relaxed text-muted-foreground">
        {renderInline(text)}
      </Text>
    </View>
  );
}
