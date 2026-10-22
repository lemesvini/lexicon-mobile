import type { BlockBase } from "@/features/material/types/block-base";

/** An email, drawn as the Mail window it would be read in. */
export type EmailBlock = BlockBase & {
  type: "email";
  label?: string;
  /** Defaults to "light". */
  theme?: "light" | "dark" | "mist" | "forest";
  /** Each header row is drawn only when it has a value. */
  to?: string;
  cc?: string;
  subject?: string;
  from?: string;
  /** Block markdown: a greeting, a body and a sign-off are three paragraphs. */
  body: string;
  note?: string;
};
