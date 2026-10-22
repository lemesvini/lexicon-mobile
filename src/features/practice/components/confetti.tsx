import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { confettiColors } from "@/theme/colors";

/** How many pieces, across both bursts. */
const PIECES = 64;
/** The second burst, on the landing of haptics.celebrate's drumroll. */
const SECOND_BURST_MS = 700;
/** How long a piece is in the air before it has faded out. */
const LIFE_S = 2.8;
/** The whole show, second burst included. */
const TOTAL_MS = SECOND_BURST_MS + LIFE_S * 1000;
/** Gravity, in points per second squared. */
const GRAVITY = 1100;
/** Air drag: the bigger, the sooner a piece stops shooting and starts drifting. */
const DRAG = 2.4;

type Piece = {
  /** Launch angle, radians from the horizontal; around straight up. */
  angle: number;
  /** Launch speed, points per second. */
  speed: number;
  /** Turns, degrees per second. */
  spin: number;
  /** How fast it flips over, which is what makes paper flutter. */
  flip: number;
  /** Sideways sway once it's floating down. */
  sway: number;
  width: number;
  height: number;
  color: string;
  round: boolean;
  delayMs: number;
};

const between = (min: number, max: number) => min + Math.random() * (max - min);

function makePieces(): Piece[] {
  return Array.from({ length: PIECES }, (_, index) => {
    const round = Math.random() < 0.3;
    const size = between(7, 11);
    return {
      // A fan upwards, wider than it is tall: 25° to 155°.
      angle: between(0.45, Math.PI - 0.45),
      speed: between(650, 1250),
      spin: between(-540, 540),
      flip: between(4, 11),
      sway: between(10, 28),
      width: size,
      height: round ? size : size * between(1.4, 2),
      color: confettiColors[index % confettiColors.length]!,
      round,
      delayMs: index % 2 === 0 ? 0 : SECOND_BURST_MS + between(0, 80),
    };
  });
}

function ConfettiPiece({
  piece,
  origin,
  clock,
}: {
  piece: Piece;
  origin: { x: number; y: number };
  clock: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const t = Math.max(0, clock.value - piece.delayMs) / 1000;
    if (t <= 0 || t >= LIFE_S) return { opacity: 0 };

    // Thrown against air: it slows towards a gentle fall rather than arcing
    // like a stone — x and y of a body with linear drag.
    const slow = (1 - Math.exp(-DRAG * t)) / DRAG;
    const vx = Math.cos(piece.angle) * piece.speed;
    const vy = -Math.sin(piece.angle) * piece.speed;
    const x = origin.x + vx * slow + Math.sin(t * 3 + piece.spin) * piece.sway * Math.min(t, 1);
    const y = origin.y + (vy + GRAVITY / DRAG) * slow - (GRAVITY / DRAG) * t;

    const fade = t > LIFE_S - 0.7 ? (LIFE_S - t) / 0.7 : 1;
    return {
      opacity: fade,
      transform: [
        { translateX: x - piece.width / 2 },
        { translateY: y - piece.height / 2 },
        { rotate: `${piece.spin * t}deg` },
        { scaleX: Math.cos(t * piece.flip) },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: 0,
          top: 0,
          width: piece.width,
          height: piece.height,
          borderRadius: piece.round ? piece.width / 2 : 1.5,
          backgroundColor: piece.color,
        },
        style,
      ]}
    />
  );
}

/**
 * Confetti, thrown up from a point and fluttering down: two bursts, timed with
 * haptics.celebrate — one as it starts, one as its drumroll lands. Fills its
 * parent, over whatever is there, and never takes a touch. Nothing at all when
 * the system asks for reduced motion.
 *
 * `originY` is where it bursts from, as a share of the parent's height.
 */
export default function Confetti({ originY = 0.4 }: { originY?: number }) {
  const reduceMotion = useReducedMotion();
  const [pieces] = useState(makePieces);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const clock = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion || !size) return;
    clock.value = withTiming(TOTAL_MS, { duration: TOTAL_MS, easing: Easing.linear });
  }, [reduceMotion, size, clock]);

  if (reduceMotion) return null;

  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        if (!size) setSize({ width, height });
      }}
    >
      {size
        ? pieces.map((piece, index) => (
            <ConfettiPiece
              key={index}
              piece={piece}
              origin={{ x: size.width / 2, y: size.height * originY }}
              clock={clock}
            />
          ))
        : null}
    </View>
  );
}
