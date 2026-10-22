import { Pressable, Text, useColorScheme, View } from "react-native";
import { router, type Href } from "expo-router";
import { ClipboardCheck, FileText, type LucideIcon, Video } from "lucide-react-native";

import { formatAgo } from "@/features/notifications/format";
import type { InboxItem } from "@/features/notifications/types/inbox-item";
import type { NotificationKind } from "@/features/notifications/types/notification-kind";
import { haptics } from "@/lib/haptics";
import { colors } from "@/theme/colors";

const ICONS: Record<NotificationKind, LucideIcon> = {
  homework_graded: ClipboardCheck,
  unit_report: FileText,
  class_reminder: Video,
};

type Props = { item: InboxItem };

/** One notification: what it's about, when, and a dot while it's new. Opens
 *  what it points at, as tapping the push itself would. */
export default function NotificationRow({ item }: Props) {
  const palette = colors[useColorScheme() === "dark" ? "dark" : "light"];
  const Icon = ICONS[item.kind] ?? FileText;
  const url = item.url;

  return (
    <Pressable
      accessibilityRole={url ? "button" : undefined}
      disabled={!url}
      onPress={() => {
        if (!url) return;
        haptics.tap();
        router.push(url as Href);
      }}
      className="flex-row items-start gap-3 px-4 py-3.5 active:bg-muted"
    >
      <View className="size-12 items-center justify-center rounded-2xl bg-secondary">
        <Icon size={22} color={palette.secondaryForeground} />
      </View>
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center gap-2">
          <Text
            className="flex-1 font-sans text-base font-semibold text-foreground"
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text className="font-sans text-xs text-muted-foreground">
            {formatAgo(item.createdAt)}
          </Text>
        </View>
        <Text className="font-sans text-sm text-muted-foreground" numberOfLines={3}>
          {item.body}
        </Text>
      </View>
      {item.unread ? (
        <View
          accessibilityLabel="Nova"
          className="mt-2 size-2.5 rounded-full bg-primary"
        />
      ) : null}
    </Pressable>
  );
}
