import type { BlockBase } from "@/features/material/types/block-base";

/** The closing slide: "Now you can", the lesson's can-do, and the badge. */
export type CanDoBlock = BlockBase & {
  type: "can-do";
  /** "Lesson complete · My Daily Routine". */
  eyebrow?: string;
  text: string;
  /** The ground around the sand card. Defaults to "forest". */
  color?: "jade" | "forest" | "mist" | "clear";
};
