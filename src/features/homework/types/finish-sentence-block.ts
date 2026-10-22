import type { BlockBase } from "@/features/material/types/block-base";

/** A sentence with one word missing, chosen from a few options. */
export type FinishSentenceBlock = BlockBase & {
  type: "finish-sentence";
  id: string;
  label?: string;
  /** The sentence, with `___` where the missing word goes. */
  sentence: string;
  options: string[];
  note?: string;
};
