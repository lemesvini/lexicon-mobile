import { Text, View } from "react-native";
import { Image } from "expo-image";
import { UserRound } from "lucide-react-native";

import { FOREST, INK, JADE, MIST, withAlpha } from "@/features/material/brand";
import { BlockLabel, BlockNote } from "@/features/material/components/block-chrome";
import { Markdown } from "@/features/material/markdown";
import type { PostBlock } from "@/features/material/types/post-block";
import { lessonImageUrl } from "@/lib/storage";

type Theme = { surface: string; border: string; text: string; muted: string; avatar: string };

/** lexicon-web's POST_THEMES. */
const THEMES: Record<NonNullable<PostBlock["theme"]>, Theme> = {
  light: { surface: "#ffffff", border: "#e1e3e6", text: "#0f1419", muted: "#65707b", avatar: "#eff1f3" },
  dark: { surface: "#16181c", border: "#2f3336", text: "#e7e9ea", muted: "#8b98a5", avatar: "#2f3336" },
  mist: {
    surface: MIST,
    border: withAlpha(FOREST, 0.22),
    text: FOREST,
    muted: withAlpha(FOREST, 0.65),
    avatar: withAlpha(FOREST, 0.12),
  },
  forest: { surface: FOREST, border: INK, text: MIST, muted: JADE, avatar: withAlpha(MIST, 0.14) },
};

const AVATAR = 44;

/** One leading `@`, however the author typed it. */
function handleOf(username: string): string {
  const name = username.trim().replace(/^@+/, "");
  return name ? `@${name}` : "";
}

/** The profile picture, or the silhouette every feed fills that circle with. */
function Avatar({ theme, path }: { theme: Theme; path?: string }) {
  return (
    <View
      style={{ width: AVATAR, height: AVATAR, backgroundColor: theme.avatar }}
      className="items-center justify-center overflow-hidden rounded-full"
    >
      {path ? (
        <Image source={{ uri: lessonImageUrl(path) }} contentFit="cover" style={{ width: AVATAR, height: AVATAR }} />
      ) : (
        <UserRound color={theme.muted} size={AVATAR / 2} />
      )}
    </View>
  );
}

/** A social post, drawn as its card: who posted, the words, the photo. No like
 *  or reply — none of them would do anything. */
export default function PostView({ block }: { block: PostBlock }) {
  const theme = THEMES[block.theme ?? "light"] ?? THEMES.light;
  const handle = handleOf(block.username);

  return (
    <View className="gap-2.5">
      {block.label ? <BlockLabel>{block.label}</BlockLabel> : null}
      <View
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        className="gap-3 rounded-2xl border p-4 shadow-md"
      >
        <View className="flex-row items-center gap-3">
          <Avatar theme={theme} path={block.avatarPath} />
          <View className="flex-1">
            {block.displayName ? (
              <Text numberOfLines={1} style={{ color: theme.text }} className="font-sans text-base font-semibold">
                {block.displayName}
              </Text>
            ) : null}
            {handle ? (
              <Text numberOfLines={1} style={{ color: theme.muted }} className="font-sans text-sm">
                {handle}
              </Text>
            ) : null}
          </View>
        </View>

        {block.body.trim() ? <Markdown text={block.body} color={theme.text} size={16} /> : null}

        {block.imagePath ? (
          <Image
            source={{ uri: lessonImageUrl(block.imagePath) }}
            accessibilityLabel={block.imageAlt}
            contentFit="cover"
            style={{
              width: "100%",
              aspectRatio: 4 / 3,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.border,
            }}
          />
        ) : null}
      </View>
      {block.note ? <BlockNote text={block.note} /> : null}
    </View>
  );
}
