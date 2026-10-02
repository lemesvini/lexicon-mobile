import type { Ref } from "react";
import { Text, TextInput, type TextInputProps, useColorScheme, View } from "react-native";

import { colors } from "@/theme/colors";

type Props = TextInputProps & { label: string; ref?: Ref<TextInput> };

export default function AuthField({ label, ref, ...input }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <View className="gap-2">
      <Text className="font-sans text-sm font-semibold text-foreground">{label}</Text>
      <TextInput
        ref={ref}
        className="h-12 rounded-xl border border-input bg-card px-4 font-sans text-base text-foreground"
        placeholderTextColor={colors[scheme].mutedForeground}
        selectionColor={colors[scheme].primary}
        autoCapitalize="none"
        autoCorrect={false}
        {...input}
      />
    </View>
  );
}
