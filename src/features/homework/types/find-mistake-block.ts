import type { BlockBase } from "@/features/material/types/block-base";

/** A sentence with one wrong word, found by tapping it. The answer is the
 *  word's index in the sentence split on whitespace. */
export type FindMistakeBlock = BlockBase & {
  type: "find-mistake";
  id: string;
  label?: string;
  sentence: string;
  note?: string;
};
