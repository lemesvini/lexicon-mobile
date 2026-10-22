import type { BlockBase } from "@/features/material/types/block-base";

/** A block the app doesn't draw: a minigame is played live on the projector,
 *  with the class, and has nothing to show in the material. */
export type UnsupportedBlock = BlockBase & {
  type: "minigame";
};
