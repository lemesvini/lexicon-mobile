import { ActivityIndicator, Pressable, Text, useColorScheme } from "react-native";

import { colors } from "@/theme/colors";

type Props = {
  label: string;
  busyLabel: string;
  busy: boolean;
  onPress: () => void;
};

export default function SubmitButton({ label, busyLabel, busy, onPress }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy, disabled: busy }}
      disabled={busy}
      onPress={onPress}
      className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary active:opacity-80 disabled:opacity-70"
    >
      {busy && <ActivityIndicator color={colors[scheme].primaryForeground} />}
      <Text className="font-sans text-base font-bold text-primary-foreground">
        {busy ? busyLabel : label}
      </Text>
    </Pressable>
  );
}
