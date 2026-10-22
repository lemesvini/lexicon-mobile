import type { BlockBase } from "@/features/material/types/block-base";

/** A live web page. Framed on the web; here, opened in the in-app browser. */
export type EmbedBlock = BlockBase & {
  type: "embed";
  label?: string;
  /** The page's address, as the teacher pasted it. */
  url?: string;
  /** A page we host, in the `lesson-embeds` bucket. Wins over `url`. */
  path?: string;
  /** A publisher's embed snippet. Wins over both; read for the address in it. */
  html?: string;
  title?: string;
  caption?: string;
  note?: string;
};
