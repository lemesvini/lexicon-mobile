import type { BlockBase } from "@/features/material/types/block-base";

/** A passage, and descriptions of it to choose between — one of them right. */
export type ChooseDescriptionBlock = BlockBase & {
  type: "choose-description";
  id: string;
  label?: string;
  /** The passage, in English. Block markdown. */
  text: string;
  /** "mono" for anything whose layout is part of the reading — an email, a
   *  chat. Defaults to "sans". */
  font?: "sans" | "mono";
  /** In the student's own language. */
  options: string[];
  note?: string;
};
