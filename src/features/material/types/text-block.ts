import type { BlockBase } from "@/features/material/types/block-base";

/** A paragraph, with an optional label above and note below. */
export type TextBlock = BlockBase & {
  type: "text";
  label?: string;
  /** Inline markdown; its line breaks are the author's. */
  body: string;
  note?: string;
};
