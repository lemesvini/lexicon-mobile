import { Pressable, Text, View, useColorScheme } from "react-native";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { ExternalLink, Globe, MessageCircle, Play } from "lucide-react-native";

import { BlockLabel, BlockNote } from "@/features/material/components/block-chrome";
import { embedTarget } from "@/features/material/embed-target";
import { renderInline } from "@/features/material/inline";
import type { EmbedBlock } from "@/features/material/types/embed-block";
import type { EmbedTarget } from "@/features/material/types/embed-target";
import { haptics } from "@/lib/haptics";
import { colors } from "@/theme/colors";

function open(url: string) {
  haptics.tap();
  void WebBrowser.openBrowserAsync(url);
}

/** A YouTube video: its thumbnail, with a play button over it. */
function VideoCard({ target, name }: { target: Extract<EmbedTarget, { kind: "video" }>; name: string }) {
  return (
    <Pressable
      onPress={() => open(target.url)}
      accessibilityRole="button"
      accessibilityLabel={`Assistir: ${name}`}
      className="overflow-hidden rounded-2xl active:opacity-85"
    >
      <Image
        source={{ uri: `https://i.ytimg.com/vi/${target.videoId}/hqdefault.jpg` }}
        contentFit="cover"
        style={{ width: "100%", aspectRatio: 16 / 9 }}
      />
      <View className="absolute inset-0 items-center justify-center">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-black/60">
          <Play color="#ffffff" fill="#ffffff" size={26} style={{ marginLeft: 3 }} />
        </View>
      </View>
    </Pressable>
  );
}

/** A post, or any other page: what it is, where it lives, and a way there. */
function LinkCard({ target, title }: { target: Exclude<EmbedTarget, { kind: "video" }>; title?: string }) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const theme = colors[scheme];
  const Icon = target.kind === "post" ? MessageCircle : Globe;
  const heading = target.kind === "post" ? `Ver post no ${target.network}` : title?.trim() || target.host;
  const detail = target.kind === "post" ? target.network : target.host;

  return (
    <Pressable
      onPress={() => open(target.url)}
      accessibilityRole="link"
      accessibilityLabel={heading}
      className="flex-row items-center gap-3.5 rounded-2xl border border-border bg-card px-4 py-4 active:opacity-80"
    >
      <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/10">
        <Icon color={theme.primary} size={20} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text numberOfLines={2} className="font-sans text-base font-semibold text-foreground">
          {heading}
        </Text>
        <Text numberOfLines={1} className="font-sans text-sm text-muted-foreground">
          {detail}
        </Text>
      </View>
      <ExternalLink color={theme.mutedForeground} size={18} />
    </Pressable>
  );
}

/** A live page: framed in the slide on the web, opened in the in-app browser
 *  here — the app has no web view, and a frame on a phone is a small one. */
export default function EmbedView({ block }: { block: EmbedBlock }) {
  const target = embedTarget(block);

  return (
    <View className="gap-2.5">
      {block.label ? <BlockLabel>{block.label}</BlockLabel> : null}
      {target === null ? (
        // The web's placeholder: an embed not filled in yet.
        <View className="rounded-2xl border border-dashed border-border px-4 py-4">
          <Text className="font-sans text-sm text-muted-foreground">Conteúdo indisponível.</Text>
        </View>
      ) : target.kind === "video" ? (
        <VideoCard target={target} name={block.title || block.label || "vídeo"} />
      ) : (
        <LinkCard target={target} title={block.title} />
      )}
      {block.caption ? (
        <Text className="text-center font-sans text-sm italic text-muted-foreground">
          {renderInline(block.caption)}
        </Text>
      ) : null}
      {block.note ? <BlockNote text={block.note} /> : null}
    </View>
  );
}
