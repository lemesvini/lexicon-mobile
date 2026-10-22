import type { BlockBase } from "@/features/material/types/block-base";
import type { MaterialBlock } from "@/features/material/types/material-block";

/** Blocks laid out together. On a phone always as a column: two columns side
 *  by side are too narrow to read. */
export type ContainerBlock = BlockBase & {
  type: "container";
  direction?: "row" | "column";
  align?: "start" | "center";
  gap?: "sm" | "md" | "lg";
  blocks: MaterialBlock[];
};
