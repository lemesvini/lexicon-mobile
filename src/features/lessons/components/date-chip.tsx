import { Text, View, useColorScheme } from "react-native";
import { Check, Video, X } from "lucide-react-native";

import { formatDay } from "@/features/today/format";
import { colors, pathColors } from "@/theme/colors";

type Props = {
  /** "YYYY-MM-DD". */
  day: string;
  /** Ahead: the day it is planned for. Attended: the day it was taught.
   *  Missed: the day of the class the student wasn't at. */
  kind: "ahead" | "attended" | "missed";
};

const ICONS = { ahead: Video, attended: Check, missed: X } as const;

/** A lesson's day, beside its node: "Qui, 1 out", "Amanhã", "Hoje" — the Today
 *  tab's wording. One ahead carries the camera of a live class still to come;
 *  one behind is ticked, or crossed out in a soft terracotta where the student
 *  was absent. */
export default function DateChip({ day, kind }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const theme = colors[scheme];
  const missed = pathColors[scheme].missed;
  const Icon = ICONS[kind];

  const look =
    kind === "missed"
      ? { icon: missed.text, text: missed.text, background: missed.background, border: missed.border }
      : {
          icon: theme.mutedForeground,
          text: kind === "attended" ? theme.mutedForeground : theme.foreground,
          background: theme.card,
          border: theme.border,
        };

  return (
    <View
      style={{ backgroundColor: look.background, borderColor: look.border }}
      className="flex-row items-center gap-1.5 rounded-full border px-3 py-1.5"
    >
      <Icon color={look.icon} size={14} strokeWidth={2.25} />
      <Text style={{ color: look.text }} className="font-sans text-sm font-semibold">
        {formatDay(day)}
      </Text>
    </View>
  );
}
