// The brand palette, for the blocks that look the same whatever the device's
// scheme — a cover, the can-do slide. lexicon-web/src/features/blocks/brand.ts,
// in the design source's hex. Theme tokens are for the blocks that should
// follow the app: text, list, table, dialog.

/** Brand green. */
export const JADE = "#61B495";
/** Deep green — the dark ground. */
export const FOREST = "#14352A";
/** Pale green — the light ground. */
export const MIST = "#DFF2EA";
/** Near-black, faintly green. */
export const INK = "#0E1412";
/** Warm off-white. */
export const SAND = "#F6F0EB";

/** A brand colour at partial opacity, for hairlines and quiet type — derived
 *  from the colour, as on the web, rather than a second hex typed by hand. */
export function withAlpha(hex: string, alpha: number): string {
  const channel = Math.round(Math.min(Math.max(alpha, 0), 1) * 255);
  return `${hex}${channel.toString(16).padStart(2, "0")}`;
}

/** A cover's ground and type, by its `color` — the web's TITLE_COLORS. "clear"
 *  is laid over a wallpaper image there; with no image here, it is the forest. */
export const COVER_COLORS = {
  jade: { background: JADE, foreground: MIST },
  forest: { background: FOREST, foreground: MIST },
  mist: { background: MIST, foreground: FOREST },
  clear: { background: FOREST, foreground: MIST },
} as const;
