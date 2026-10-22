import { Children, Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = { title?: string; children: React.ReactNode };

/** A grouped list, in the style of the iOS settings screens. The separators
 *  start where the labels do, past the icon tiles. */
export default function SettingsSection({ title, children }: Props) {
  const rows = Children.toArray(children);

  return (
    <View className="gap-2">
      {title && (
        <Text className="px-4 font-sans text-[13px] uppercase text-muted-foreground">{title}</Text>
      )}
      <View className="overflow-hidden rounded-3xl bg-card">
        {rows.map((row, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <View className="ml-[60px] bg-border" style={{ height: StyleSheet.hairlineWidth }} />
            )}
            {row}
          </Fragment>
        ))}
      </View>
    </View>
  );
}
