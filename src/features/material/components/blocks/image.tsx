import { useState } from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";

import { BlockLabel, BlockNote } from "@/features/material/components/block-chrome";
import { renderInline } from "@/features/material/inline";
import type { ImageBlock } from "@/features/material/types/image-block";
import { lessonImageUrl } from "@/lib/storage";

/** An uploaded image, full width at its own proportions — known once it has
 *  loaded; 16:9 until then, the shape most of them are. A wallpaper is the same
 *  image: it is alone on its slide, with nothing to lay over it. */
export default function ImageView({ block }: { block: ImageBlock }) {
  const [aspect, setAspect] = useState(16 / 9);
  if (!block.path) return null;

  return (
    <View className="gap-3">
      {block.label ? <BlockLabel>{block.label}</BlockLabel> : null}
      <Image
        source={{ uri: lessonImageUrl(block.path) }}
        accessibilityLabel={block.alt}
        contentFit="cover"
        transition={150}
        onLoad={(event) => {
          const { width, height } = event.source;
          if (width > 0 && height > 0) setAspect(width / height);
        }}
        style={{ width: "100%", aspectRatio: aspect, borderRadius: 16 }}
      />
      {block.caption ? (
        <Text className="text-center font-sans text-sm italic text-muted-foreground">
          {renderInline(block.caption)}
        </Text>
      ) : null}
      {block.note ? <BlockNote text={block.note} /> : null}
    </View>
  );
}
