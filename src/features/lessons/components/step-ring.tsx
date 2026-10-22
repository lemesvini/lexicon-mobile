import { useColorScheme } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import type { LessonStep } from "@/features/lessons/types/lesson-step";
import { colors, goldColors } from "@/theme/colors";

type Props = {
  steps: readonly LessonStep[];
  /** The ring's outer diameter. */
  size: number;
  strokeWidth?: number;
  /** The steps done in gold rather than primary — a lesson done in full. */
  gold?: boolean;
};

/** The space between two segments, in degrees. */
const GAP = 16;

function point(centre: number, radius: number, degrees: number) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return `${centre + radius * Math.cos(radians)} ${centre + radius * Math.sin(radians)}`;
}

/** A lesson's steps around its node, clockwise from the top: the live class,
 *  then each homework. */
export default function StepRing({ steps, size, strokeWidth = 6, gold = false }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const done = gold ? goldColors.rim.mid : colors[scheme].primary;
  const pending = colors[scheme].border;

  const centre = size / 2;
  const radius = (size - strokeWidth) / 2;

  if (steps.length <= 1) {
    return (
      <Svg width={size} height={size} pointerEvents="none">
        <Circle
          cx={centre}
          cy={centre}
          r={radius}
          stroke={steps[0]?.done ? done : pending}
          strokeWidth={strokeWidth}
          fill="none"
        />
      </Svg>
    );
  }

  const sweep = (360 - steps.length * GAP) / steps.length;

  return (
    <Svg width={size} height={size} pointerEvents="none">
      {steps.map((step, index) => {
        const start = GAP / 2 + index * (sweep + GAP);
        return (
          <Path
            key={index}
            d={`M ${point(centre, radius, start)} A ${radius} ${radius} 0 ${sweep > 180 ? 1 : 0} 1 ${point(centre, radius, start + sweep)}`}
            stroke={step.done ? done : pending}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}
    </Svg>
  );
}
