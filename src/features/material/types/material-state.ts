import type { MaterialSlide } from "@/features/material/types/material-slide";

export type MaterialState =
  | { status: "loading" }
  | { status: "ready"; slides: MaterialSlide[] }
  /** Not published to them, or not theirs — the same, from here. */
  | { status: "missing" }
  | { status: "error"; message: string };
