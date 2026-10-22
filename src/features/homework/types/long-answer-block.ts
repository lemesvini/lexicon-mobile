import type { BlockBase } from "@/features/material/types/block-base";

/** A question answered in the student's own words, marked by hand. */
export type LongAnswerBlock = BlockBase & {
  type: "long-answer";
  id: string;
  label?: string;
  question: string;
  /** "3–5 sentences". */
  hint?: string;
  note?: string;
};
