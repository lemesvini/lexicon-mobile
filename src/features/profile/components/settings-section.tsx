import { Children, Fragment } from "react";
import { Text, View } from "react-native";

type Props = { title?: string; children: React.ReactNode };

/** A grouped list, in the style of the iOS settings screens. */
export default function SettingsSection({ title, children }: Props) {
  const rows = Children.toArray(children);

  return (
    <View className="gap-2">
      {title && (
        <Text className="px-4 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </Text>
      )}
      <View className="overflow-hidden rounded-2xl bg-card">
        {rows.map((row, index) => (
          <Fragment key={index}>
            {index > 0 && <View className="ml-14 h-px bg-border" />}
            {row}
          </Fragment>
        ))}
      </View>
    </View>
  );
}
