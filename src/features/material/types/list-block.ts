import type { BlockBase } from "@/features/material/types/block-base";

export type ListBlock = BlockBase & {
  type: "list";
  label?: string;
  style: "numbered" | "bullet" | "checklist";
  /** Each item in its own tinted card; an item's first line is then its
   *  heading when there is more than one. */
  cards?: boolean;
  items: string[];
  note?: string;
};
