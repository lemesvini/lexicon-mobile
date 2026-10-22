import { ScrollView, Text, View } from "react-native";

import { BlockLabel, BlockNote } from "@/features/material/components/block-chrome";
import { renderInline } from "@/features/material/inline";
import type { TableBlock } from "@/features/material/types/table-block";

/** A column's width once there are too many to share the screen. */
const COLUMN_WIDTH = 150;

/** A table, stored by column and drawn by row. Two columns share the width;
 *  more scroll sideways inside the table — a swipe there moves the table, not
 *  the slide. */
export default function TableView({ block }: { block: TableBlock }) {
  const columns = block.columns;
  const rows = Math.max(0, ...columns.map((column) => column.rows.length));
  const fits = columns.length <= 2;
  const cell = fits ? { flex: 1 } : { width: COLUMN_WIDTH };

  const table = (
    <View>
      <View className="flex-row rounded-t-xl bg-muted/60">
        {columns.map((column, index) => (
          <View key={index} style={cell} className="px-3.5 py-3">
            <Text className="font-sans text-xs font-semibold uppercase tracking-[1.5px] text-muted-foreground">
              {column.title}
            </Text>
          </View>
        ))}
      </View>
      {Array.from({ length: rows }, (_, row) => (
        <View
          key={row}
          className={`flex-row ${row < rows - 1 ? "border-b border-border/50" : ""}`}
        >
          {columns.map((column, index) => (
            <View key={index} style={cell} className="px-3.5 py-3">
              <Text className="font-sans text-base leading-relaxed text-foreground">
                {renderInline(column.rows[row] ?? "")}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <View className="gap-2">
      {block.label ? <BlockLabel>{block.label}</BlockLabel> : null}
      <View className="overflow-hidden rounded-xl border border-border/60">
        {fits ? (
          table
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {table}
          </ScrollView>
        )}
      </View>
      {block.note ? <BlockNote text={block.note} /> : null}
    </View>
  );
}
