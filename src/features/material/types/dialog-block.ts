import type { BlockBase } from "@/features/material/types/block-base";

/** An exchange between speakers, drawn as a chat. */
export type DialogBlock = BlockBase & {
  type: "dialog";
  label?: string;
  note?: string;
  lines: { speaker: string; text: string }[];
};
