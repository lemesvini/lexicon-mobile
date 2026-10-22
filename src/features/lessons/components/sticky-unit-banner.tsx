import Animated, { useAnimatedStyle, type SharedValue } from "react-native-reanimated";

import UnitBanner from "@/features/lessons/components/unit-banner";
import { BANNER_MARGIN } from "@/features/lessons/path-layout";
import type { PathUnit } from "@/features/lessons/types/path-unit";

type Props = {
  unit: PathUnit;
  /** Where the banner sits on the path. */
  top: number;
  /** The scroll's `contentOffset.y`: 0 at rest, the path's top at the top of
   *  what shows under the header. */
  scrollY: SharedValue<number>;
};

/** A unit's banner on the path, which stops under the header once it gets
 *  there and stays while its unit scrolls by.
 *
 *  By hand rather than with `stickyHeaderIndices`, which pins to the top of the
 *  scroll view's frame — behind a transparent header. And one banner per unit,
 *  never a copy pinned elsewhere: each is drawn over the one before, so the next
 *  unit's slides up over this one and covers it where it stopped. Nothing is
 *  pushed up behind the header, and nothing can show twice. */
export default function StickyUnitBanner({ unit, top, scrollY }: Props) {
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.max(0, scrollY.value + BANNER_MARGIN - top) }],
  }));

  return (
    <Animated.View style={[{ position: "absolute", top, left: 16, right: 16 }, style]}>
      <UnitBanner unit={unit} />
    </Animated.View>
  );
}
