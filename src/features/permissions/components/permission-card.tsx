import { Pressable, Text, View, useColorScheme } from "react-native";
import { Check, type LucideIcon } from "lucide-react-native";

import type { PermissionStatus } from "@/features/notifications/types/permission-status";
import { haptics } from "@/lib/haptics";
import { practiceColors } from "@/theme/colors";

type Props = {
  icon: LucideIcon;
  /** The icon's soft tint and its colour, as the Practice tab's skill cards. */
  look: { tint: string; icon: string };
  title: string;
  body: string;
  /** Null while the system is still being asked where it stands. */
  status: PermissionStatus | null;
  onAllow: () => void;
};

/**
 * One permission in the permissions sheet: what it's for, and a button that
 * asks for it — or a quiet green "Permitido" once given, or the way to the
 * system settings once refused, since only they can change it then.
 */
export default function PermissionCard({ icon: Icon, look, title, body, status, onAllow }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const granted = practiceColors[scheme].remembered;

  return (
    <View className="gap-4 rounded-3xl bg-card p-5">
      <View className="flex-row items-start gap-4">
        <View
          style={{ backgroundColor: look.tint }}
          className="size-14 items-center justify-center rounded-full"
        >
          <Icon size={26} color={look.icon} strokeWidth={2} />
        </View>
        <View className="flex-1 gap-1">
          <Text className="font-display text-2xl text-primary">{title}</Text>
          <Text className="font-sans text-base text-muted-foreground">{body}</Text>
        </View>
      </View>

      {status === "granted" ? (
        <View
          accessibilityLabel={`${title}: permitido`}
          style={{ backgroundColor: granted.background }}
          className="h-12 flex-row items-center justify-center gap-2 rounded-full"
        >
          <Check size={18} color={granted.text} strokeWidth={2.75} />
          <Text style={{ color: granted.text }} className="font-sans text-base font-bold">
            Permitido
          </Text>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={status === "blocked" ? `${title}: abrir ajustes` : `Permitir ${title}`}
          accessibilityState={{ disabled: status === null }}
          disabled={status === null}
          onPress={() => {
            haptics.tap();
            onAllow();
          }}
          className={`h-12 items-center justify-center rounded-full active:opacity-80 ${
            status === "blocked" ? "bg-muted" : "bg-primary"
          } ${status === null ? "opacity-50" : ""}`}
        >
          <Text
            className={`font-sans text-base font-bold ${
              status === "blocked" ? "text-foreground" : "text-primary-foreground"
            }`}
          >
            {status === "blocked" ? "Abrir ajustes" : "Permitir"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
