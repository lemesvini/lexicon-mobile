import type { ContextBlock } from "@/features/context/types/context-block";

export type ContextState =
  | { status: "loading" }
  | { status: "ready"; data: ContextBlock[] }
  | { status: "error"; message: string };
