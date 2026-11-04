import { ActivityIndicator, Pressable, Text, useColorScheme } from "react-native";

import { colors } from "@/theme/colors";

type Props = {
  label: string;
  busyLabel: string;
  busy: boolean;
  onPress: () => void;
  /** Red, for an action that can't be undone. */
  destructive?: boolean;
};

export default function SubmitButton({ label, busyLabel, busy, onPress, destructive }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy, disabled: busy }}
      disabled={busy}
      onPress={onPress}
      className={`h-14 flex-row items-center justify-center gap-2 rounded-full active:opacity-80 disabled:opacity-70 ${
        destructive ? "bg-destructive" : "bg-primary"
      }`}
    >
      {busy && (
        <ActivityIndicator
          color={colors[scheme][destructive ? "destructiveForeground" : "primaryForeground"]}
        />
      )}
      <Text
        className={`font-sans text-base font-bold ${
          destructive ? "text-destructive-foreground" : "text-primary-foreground"
        }`}
      >
        {busy ? busyLabel : label}
      </Text>
    </Pressable>
  );
}
