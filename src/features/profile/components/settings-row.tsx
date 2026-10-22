import { Pressable, Switch, Text, useColorScheme, View } from "react-native";
import { ChevronRight, type LucideIcon } from "lucide-react-native";

import { colors } from "@/theme/colors";

type Props = {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
  /** Shown on the right instead of the chevron, e.g. "Em breve". */
  detail?: string;
  /** Centred red text with no icon, as iOS shows "Sign Out". */
  destructive?: boolean;
  /** A switch on the right instead of the chevron; the row toggles it. */
  value?: boolean;
  onValueChange?: (value: boolean) => void;
};

/** A row in the style of the iOS Settings app: the icon on its own rounded
 *  tile, the label at body size, and the chevron, value or switch on the
 *  right. */
export default function SettingsRow({
  icon: Icon,
  label,
  onPress,
  detail,
  destructive,
  value,
  onValueChange,
}: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const palette = colors[scheme];
  const isSwitch = value !== undefined && onValueChange !== undefined;
  const press = isSwitch ? () => onValueChange(!value) : onPress;

  if (destructive) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className="min-h-[52px] items-center justify-center px-4 active:bg-muted"
      >
        <Text className="font-sans text-[17px] text-destructive">{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole={isSwitch ? "switch" : "button"}
      accessibilityState={isSwitch ? { checked: value } : { disabled: !press }}
      disabled={!press}
      onPress={press}
      className="min-h-[52px] flex-row items-center gap-3.5 px-4 py-2.5 active:bg-muted"
    >
      <View
        className={`size-[30px] items-center justify-center rounded-[8px] bg-primary ${
          press ? "" : "opacity-50"
        }`}
      >
        <Icon size={18} strokeWidth={2.25} color={palette.primaryForeground} />
      </View>
      <Text
        className={`flex-1 font-sans text-[17px] text-foreground ${press ? "" : "opacity-50"}`}
      >
        {label}
      </Text>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ true: palette.primary }}
        />
      ) : (
        <View className="flex-row items-center gap-1.5">
          {detail ? (
            <Text className="font-sans text-[17px] text-muted-foreground">{detail}</Text>
          ) : null}
          {onPress && <ChevronRight size={20} strokeWidth={2.25} color={palette.mutedForeground} />}
        </View>
      )}
    </Pressable>
  );
}
