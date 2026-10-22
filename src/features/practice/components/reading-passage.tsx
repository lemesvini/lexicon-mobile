import { Text, View } from "react-native";

/** A reading text's paragraphs, set loose: the one thing on these screens that
 *  is read rather than scanned. `compact` when it is opened again under a
 *  question, smaller so the question stays near. */
export default function ReadingPassage({ paragraphs, compact }: { paragraphs: string[]; compact?: boolean }) {
  return (
    <View className={compact ? "gap-3" : "gap-4"}>
      {paragraphs.map((paragraph, index) => (
        <Text
          key={index}
          className={`font-sans text-foreground ${compact ? "text-base leading-7" : "text-lg leading-8"}`}
        >
          {paragraph}
        </Text>
      ))}
    </View>
  );
}
