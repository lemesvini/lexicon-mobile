import type { BlockBase } from "@/features/material/types/block-base";

/** The cover: eyebrow, wordmark, and one big headline on a brand colour. */
export type TitleBlock = BlockBase & {
  type: "title";
  eyebrow?: string;
  /** Line breaks are kept: they are where the author wants it to wrap. */
  title: string;
  subtitle?: string;
  /** Defaults to "jade". "clear" is laid over a wallpaper image on the web. */
  color?: "jade" | "forest" | "mist" | "clear";
  hideWordmark?: boolean;
};
