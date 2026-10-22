import { Text, View, useColorScheme } from "react-native";

import { practiceColors } from "@/theme/colors";

/** The skills' tints, taken in turn, so a row of interests reads as a handful
 *  of colours rather than one. */
const TURNS = ["reading", "listening", "writing", "speaking"] as const;

/** The student's interests as pills, the way a dating profile shows them. */
export default function InterestPills({ interests }: { interests: string[] }) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <View className="flex-row flex-wrap gap-2">
      {interests.map((interest, index) => {
        const look = practiceColors[scheme][TURNS[index % TURNS.length]!];
        return (
          <View
            key={interest}
            style={{ backgroundColor: look.tint }}
            className="rounded-full px-4 py-2"
          >
            <Text style={{ color: look.icon }} className="font-sans text-[15px] font-bold">
              {interest}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
