import { View } from "react-native";
import Svg, { Circle, ClipPath, Defs, LinearGradient, Path, Polygon, Stop } from "react-native-svg";
import { type LucideIcon, Star } from "lucide-react-native";

import { goldColors } from "@/theme/colors";

type Props = {
  size: number;
  /** A ring of this colour around the coin and its ribbons, setting them off
   *  whatever they sit on. */
  outline?: string;
  /** What is stamped on the coin: a star, unless it marks something else — a
   *  practice sitting's trophy. */
  icon?: LucideIcon;
};

/** How far the ribbons hang below the coin, as a share of its size. They
 *  overflow the marker's box: it is laid out at the coin's size. */
const RIBBON_DROP = 0.28;

/** A gold coin with a star stamped on it and two ribbons hanging under it: a
 *  "Now you can" handed in, or a lesson on the path done in full. */
export default function GoldMarker({ size, outline, icon: Icon = Star }: Props) {
  const gap = outline ? Math.max(2, size * 0.06) : 0;
  const centre = size / 2;
  // The drawing's coordinates, shifted by the outline so it isn't cut off.
  const cx = gap + centre;
  const cy = gap + centre;
  const at = (x: number, y: number) => `${gap + size * x},${gap + size * y}`;
  const face = size * 0.38;
  // The gloss on the rim's top left: a quarter arc, just inside its edge.
  const gloss = size * 0.44;
  const from = { x: cx - gloss * Math.cos(Math.PI / 12), y: cy - gloss * Math.sin(Math.PI / 12) };
  const to = { x: cx - gloss * Math.sin(Math.PI / 12), y: cy - gloss * Math.cos(Math.PI / 12) };
  const glyph = size * 0.5;

  // Each tail tucked under the coin, splayed a little outward, its end cut
  // into a swallowtail.
  const bottom = 1 + RIBBON_DROP;
  const notch = bottom - 0.1;
  const tails = [
    [at(0.2, 0.55), at(0.47, 0.55), at(0.39, bottom), at(0.255, notch), at(0.12, bottom)],
    [at(0.53, 0.55), at(0.8, 0.55), at(0.88, bottom), at(0.745, notch), at(0.61, bottom)],
  ].map((points) => points.join(" "));
  // The fold down each tail's inner side.
  const folds = [
    [at(0.38, 0.55), at(0.47, 0.55), at(0.39, bottom), at(0.32, bottom - 0.055)],
    [at(0.53, 0.55), at(0.62, 0.55), at(0.68, bottom - 0.055), at(0.61, bottom)],
  ].map((points) => points.join(" "));

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg
        width={size + gap * 2}
        height={size * bottom + gap * 2}
        style={{ position: "absolute", left: -gap, top: -gap }}
      >
        <Defs>
          <LinearGradient id="gold-rim" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={goldColors.rim.light} />
            <Stop offset="0.45" stopColor={goldColors.rim.mid} />
            <Stop offset="1" stopColor={goldColors.rim.dark} />
          </LinearGradient>
          <LinearGradient id="gold-face" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={goldColors.face.dark} />
            <Stop offset="1" stopColor={goldColors.face.light} />
          </LinearGradient>
          <LinearGradient id="gold-ribbon" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={goldColors.rim.dark} />
            <Stop offset="0.35" stopColor={goldColors.face.dark} />
            <Stop offset="1" stopColor={goldColors.rim.mid} />
          </LinearGradient>
          <ClipPath id="gold-face-clip">
            <Circle cx={cx} cy={cy} r={face} />
          </ClipPath>
        </Defs>

        {outline ? (
          <>
            {tails.map((points) => (
              <Polygon
                key={points}
                points={points}
                fill={outline}
                stroke={outline}
                strokeWidth={gap * 2}
                strokeLinejoin="round"
              />
            ))}
            <Circle cx={cx} cy={cy} r={centre + gap} fill={outline} />
          </>
        ) : null}

        {tails.map((points) => (
          <Polygon key={points} points={points} fill="url(#gold-ribbon)" />
        ))}
        {folds.map((points) => (
          <Polygon key={points} points={points} fill={goldColors.edge} opacity={0.45} />
        ))}

        <Circle cx={cx} cy={cy} r={centre} fill="url(#gold-rim)" />
        <Circle
          cx={cx}
          cy={cy}
          r={face}
          fill="url(#gold-face)"
          stroke={goldColors.edge}
          strokeOpacity={0.5}
          strokeWidth={0.8}
        />
        {/* A streak of light across the face. */}
        <Polygon
          points={`${at(0.62, 0)} ${at(0.76, 0)} ${at(0.38, 1)} ${at(0.24, 1)}`}
          fill={goldColors.shine}
          opacity={0.22}
          clipPath="url(#gold-face-clip)"
        />
        <Path
          d={`M ${from.x} ${from.y} A ${gloss} ${gloss} 0 0 1 ${to.x} ${to.y}`}
          stroke={goldColors.shine}
          strokeOpacity={0.85}
          strokeWidth={1.4}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      {/* Stamped: a darker icon a hair below the white one. */}
      <View style={{ position: "absolute", top: centre - glyph / 2 + 1 }}>
        <Icon
          color={goldColors.iconShadow}
          fill={goldColors.iconShadow}
          size={glyph}
          strokeWidth={2.5}
          opacity={0.6}
        />
      </View>
      <Icon color={goldColors.icon} fill={goldColors.icon} size={glyph} strokeWidth={2.5} />
    </View>
  );
}
