import type { BlockBase } from "@/features/material/types/block-base";

/** A social post, drawn as the card it would be. */
export type PostBlock = BlockBase & {
  type: "post";
  label?: string;
  /** With or without the `@` — exactly one is drawn. */
  username: string;
  displayName?: string;
  /** In the `lesson-images` bucket. Absent draws the default user icon. */
  avatarPath?: string;
  /** Block markdown. May be empty on a post that is only a photo. */
  body: string;
  imagePath?: string;
  imageAlt?: string;
  /** Defaults to "light". */
  theme?: "light" | "dark" | "mist" | "forest";
  note?: string;
};
