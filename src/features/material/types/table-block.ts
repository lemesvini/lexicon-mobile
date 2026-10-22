import type { BlockBase } from "@/features/material/types/block-base";

/** A table, stored by column. */
export type TableBlock = BlockBase & {
  type: "table";
  label?: string;
  note?: string;
  columns: { title: string; rows: string[] }[];
};
