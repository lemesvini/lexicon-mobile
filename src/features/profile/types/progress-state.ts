import type { Progress } from "@/features/profile/types/progress";

export type ProgressState =
  | { status: "loading" }
  | { status: "ready"; data: Progress }
  | { status: "error"; message: string };
