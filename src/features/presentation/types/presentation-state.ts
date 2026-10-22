import type { DeckSlide } from "@/features/presentation/types/deck-slide";

export type PresentationState =
  | { status: "loading" }
  | { status: "ready"; slides: DeckSlide[] }
  /** Not theirs to read — no lesson page, no deck. */
  | { status: "missing" }
  | { status: "error"; message: string };
