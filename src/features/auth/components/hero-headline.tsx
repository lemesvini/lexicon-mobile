import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme/colors";

const lineClass = "text-center font-display text-secondary-foreground";
const lineStyle = { fontSize: 46, lineHeight: 52 };

/** The landing page headline, set line by line so "bilíngue" can carry the
 *  hand-drawn underline. */
export default function HeroHeadline() {
  return (
    <View accessible accessibilityRole="header" accessibilityLabel="Descubra a liberdade de ser bilíngue">
      <Text className={lineClass} style={lineStyle} numberOfLines={1} adjustsFontSizeToFit>
        Descubra a
      </Text>
      <Text className={lineClass} style={lineStyle} numberOfLines={1} adjustsFontSizeToFit>
        liberdade de
      </Text>
      <View className="flex-row items-start justify-center">
        <Text className={lineClass} style={lineStyle}>
          ser{" "}
        </Text>
        <View>
          <Text className="font-display text-ring" style={lineStyle}>
            bilíngue
          </Text>
          <Svg
            width="104%"
            height={12}
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
            style={{ marginTop: -2, marginLeft: "-2%" }}
          >
            <Path
              d="M2 9 C 30 3, 70 2, 98 6"
              stroke={colors.light.ring}
              strokeWidth={3}
              strokeLinecap="round"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </Svg>
        </View>
      </View>
    </View>
  );
}
