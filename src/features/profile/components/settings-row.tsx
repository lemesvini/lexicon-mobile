import { Pressable, Text, useColorScheme, View } from "react-native";
import { ChevronRight, type LucideIcon } from "lucide-react-native";

import { colors } from "@/theme/colors";

type Props = {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
  /** Shown on the right instead of the chevron, e.g. "Em breve". */
  detail?: string;
  destructive?: boolean;
};

export default function SettingsRow({ icon: Icon, label, onPress, detail, destructive }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const palette = colors[scheme];
  const tint = destructive ? palette.destructive : palette.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !onPress }}
      disabled={!onPress}
      onPress={onPress}
      className="min-h-12 flex-row items-center gap-3 px-4 py-3 active:bg-muted"
    >
      <View className="w-7 items-center">
        <Icon size={20} strokeWidth={2} color={tint} />
      </View>
      <Text
        className={`flex-1 font-sans text-base ${
          destructive ? "font-semibold text-destructive" : "text-foreground"
        } ${onPress ? "" : "opacity-50"}`}
      >
        {label}
      </Text>
      {detail ? (
        <Text className="font-sans text-sm text-muted-foreground">{detail}</Text>
      ) : (
        onPress && !destructive && (
          <ChevronRight size={18} color={palette.mutedForeground} />
        )
      )}
    </Pressable>
  );
}
