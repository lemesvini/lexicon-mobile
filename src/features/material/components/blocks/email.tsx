import { Text, View } from "react-native";

import { FOREST, INK, JADE, MIST, withAlpha } from "@/features/material/brand";
import { BlockLabel, BlockNote } from "@/features/material/components/block-chrome";
import { Markdown } from "@/features/material/markdown";
import type { EmailBlock } from "@/features/material/types/email-block";

type Theme = { surface: string; border: string; rule: string; field: string; text: string };

/** lexicon-web's EMAIL_THEMES: Mail's light and dark, and the brand's pair. */
const THEMES: Record<NonNullable<EmailBlock["theme"]>, Theme> = {
  light: { surface: "#ffffff", border: "#d3d3d6", rule: "#e8e8ea", field: "#6e6e73", text: "#1d1d1f" },
  dark: { surface: "#1f1f21", border: "#39393c", rule: "#313134", field: "#98989d", text: "#f2f2f7" },
  mist: {
    surface: MIST,
    border: withAlpha(FOREST, 0.22),
    rule: withAlpha(FOREST, 0.14),
    field: withAlpha(FOREST, 0.65),
    text: FOREST,
  },
  forest: { surface: FOREST, border: INK, rule: withAlpha(MIST, 0.14), field: JADE, text: MIST },
};

/** Close, minimise, zoom: the same three in every theme, as macOS draws them. */
const TRAFFIC_LIGHTS = ["#ff5f57", "#febc2e", "#28c840"];

/** The header rows, in Mail's order. */
const FIELDS = [
  { key: "to", name: "To:" },
  { key: "cc", name: "Cc:" },
  { key: "subject", name: "Subject:" },
  { key: "from", name: "From:" },
] as const;

/** An email, drawn as the Mail window it would be read in: traffic lights, the
 *  header rows it has, and the message. */
export default function EmailView({ block }: { block: EmailBlock }) {
  const theme = THEMES[block.theme ?? "light"] ?? THEMES.light;
  const rule = { borderBottomWidth: 1, borderBottomColor: theme.rule };

  return (
    <View className="gap-2.5">
      {block.label ? <BlockLabel>{block.label.trim()}</BlockLabel> : null}
      <View
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        className="overflow-hidden rounded-xl border shadow-md"
      >
        <View style={rule} className="flex-row items-center gap-1.5 px-4 py-2.5">
          {TRAFFIC_LIGHTS.map((colour) => (
            <View key={colour} style={{ backgroundColor: colour }} className="h-2.5 w-2.5 rounded-full" />
          ))}
        </View>

        {FIELDS.map(({ key, name }) =>
          block[key] ? (
            <View key={key} style={rule} className="flex-row items-baseline gap-3 px-4 py-2">
              {/* "Subject:" sets the gutter, so every value starts on one edge. */}
              <Text style={{ color: theme.field }} className="w-[68px] font-sans text-sm">
                {name}
              </Text>
              <Text style={{ color: theme.text }} className="flex-1 font-sans text-[15px]">
                {block[key]}
              </Text>
            </View>
          ) : null,
        )}

        <View className="min-h-20 px-4 py-4">
          <Markdown text={block.body} color={theme.text} size={16} />
        </View>
      </View>
      {block.note ? <BlockNote text={block.note} /> : null}
    </View>
  );
}
