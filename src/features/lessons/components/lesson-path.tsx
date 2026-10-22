import { Fragment } from "react";
import { View, useColorScheme } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Svg, { G, Path } from "react-native-svg";

import ContinueBadge from "@/features/lessons/components/continue-badge";
import DateChip from "@/features/lessons/components/date-chip";
import PathNode from "@/features/lessons/components/path-node";
import StickyUnitBanner from "@/features/lessons/components/sticky-unit-banner";
import { NODE_SIZE, RING_SIZE, TRACK_ABOVE, ringSizeOf } from "@/features/lessons/path-layout";
import type { PathGeometry } from "@/features/lessons/types/path-geometry";
import type { PathUnit } from "@/features/lessons/types/path-unit";
import { colors } from "@/theme/colors";

type Props = {
  units: PathUnit[];
  geometry: PathGeometry;
  width: number;
  /** The scroll's `contentOffset.y`, for the banners to stop under the header. */
  scrollY: SharedValue<number>;
};

const TRACK_WIDTH = 22;
/** Between a node's edge and the chip beside it. */
const CHIP_GAP = 12;
/** Wide enough for "Continuar" at its biggest pulse. */
const BADGE_BOX = 200;

/** The whole module's path: one track, every unit's banner on it, and the
 *  lessons along it. */
export default function LessonPath({ units, geometry, width, scrollY }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const theme = colors[scheme];
  const lessons = units.flatMap((unit) => unit.lessons);
  const { height } = geometry;

  return (
    <View style={{ width, height }}>
      {/* From above the top of the content, so the track shows behind the
          header; translated back so its coordinates are the content's. */}
      <Svg
        width={width}
        height={height + TRACK_ABOVE}
        style={{ position: "absolute", top: -TRACK_ABOVE }}
      >
        <G y={TRACK_ABOVE}>
          <Path d={geometry.ahead} stroke={theme.border} strokeWidth={TRACK_WIDTH} strokeLinecap="round" fill="none" />
          <Path d={geometry.covered} stroke={theme.accent} strokeWidth={TRACK_WIDTH} strokeLinecap="round" fill="none" />
        </G>
      </Svg>

      {lessons.map((lesson, index) => {
        const { x, y, side } = geometry.nodes[index]!;
        const current = lesson.status === "current";
        // The chip goes on the side the node swung away from, where there is room.
        const reach = (ringSizeOf(lesson) ?? NODE_SIZE) / 2 + CHIP_GAP;
        const chipOnLeft = side === "right";
        // A missed class shows the day the student wasn't there — even for a
        // lesson the group skipped, which has no day of its own.
        const day = lesson.missedOn ?? lesson.scheduledOn;
        const kind = lesson.missedOn
          ? "missed"
          : lesson.status === "done"
            ? "attended"
            : "ahead";

        return (
          <Fragment key={lesson.id}>
            {current ? (
              <View
                style={{ left: x - BADGE_BOX / 2, width: BADGE_BOX, bottom: height - y + RING_SIZE / 2 }}
                className="absolute items-center"
              >
                <ContinueBadge lessonId={lesson.id} lessonName={lesson.name} />
              </View>
            ) : null}

            <View
              style={{ left: x - RING_SIZE / 2, top: y - RING_SIZE / 2 }}
              className="absolute"
            >
              <PathNode lesson={lesson} />
            </View>

            {/* Behind the group, the day it was taught — the web lays a taught
                lesson's date on its class; a skipped one has none — or the day
                the student missed it. Ahead, the day it is planned for. */}
            {day ? (
              <View
                style={[
                  { top: y - 16 },
                  chipOnLeft ? { right: width - x + reach } : { left: x + reach },
                ]}
                className="absolute"
              >
                <DateChip day={day} kind={kind} />
              </View>
            ) : null}
          </Fragment>
        );
      })}

      {/* After the lessons, so a banner stopped under the header is over the
          lessons scrolling under it; in unit order, so each is over the last. */}
      {units.map((unit, index) => (
        <StickyUnitBanner
          key={`banner-${index}`}
          unit={unit}
          top={geometry.bannerTops[index]!}
          scrollY={scrollY}
        />
      ))}
    </View>
  );
}
