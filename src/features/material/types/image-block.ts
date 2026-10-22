import type { BlockBase } from "@/features/material/types/block-base";

export type ImageBlock = BlockBase & {
  type: "image";
  label?: string;
  /** In the `lesson-images` bucket. */
  path: string;
  alt?: string;
  caption?: string;
  note?: string;
  /** Behind the whole slide on the web. Always alone on its slide in the
   *  material, so on a phone it is simply the image, full width. */
  wallpaper?: boolean;
};
