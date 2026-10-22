import type { ReactNode } from "react";
import { Pressable, Text } from "react-native";

import { haptics } from "@/lib/haptics";

type Props = {
  label: string;
  onPress: () => void;
  /** Dark and filled — the one to press; or plain, on a raised card. */
  variant?: "primary" | "plain";
  disabled?: boolean;
  icon?: ReactNode;
  /** Takes an equal share of a row. */
  grow?: boolean;
  /** The buzz on press — a tap by default; "select" when it picks among
   *  choices; "none" when the press itself leads to a buzz of its own (a
   *  check that succeeds or fails). See @/lib/haptics. */
  haptic?: "tap" | "select" | "none";
};

/** The big round-ended buttons under the card. */
export default function PracticeButton({
  label,
  onPress,
  variant = "plain",
  disabled,
  icon,
  grow,
  haptic = "tap",
}: Props) {
  const primary = variant === "primary";

  return (
    <Pressable
      onPress={() => {
        if (haptic !== "none") haptics[haptic]();
        onPress();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={{
        shadowColor: "#000",
        shadowOpacity: primary ? 0.12 : 0.07,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      }}
      className={`min-h-[60px] flex-row items-center justify-center gap-2.5 rounded-full px-5 active:opacity-80 ${
        primary ? "bg-primary" : "bg-card"
      } ${grow ? "flex-1" : ""} ${disabled ? "opacity-50" : ""}`}
    >
      {icon}
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        className={`font-sans text-lg font-bold ${primary ? "text-primary-foreground" : "text-foreground"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
