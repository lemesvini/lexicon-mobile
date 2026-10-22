import type { BlockBase } from "@/features/material/types/block-base";

/** A boxed note with an emoji. */
export type CalloutBlock = BlockBase & {
  type: "callout";
  /** An emoji, drawn in a ring. */
  icon?: string;
  /** "blue_bg", "green_bg", "yellow_bg", "gray_bg" or "red_bg"; anything else
   *  is drawn blue, as on the web. */
  color?: string;
  title: string;
  body: string;
};
