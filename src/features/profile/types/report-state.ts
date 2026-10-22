import type { ProgressReport } from "@/features/profile/types/progress-report";

export type ReportState =
  | { status: "loading" }
  | { status: "ready"; data: ProgressReport }
  | { status: "missing" }
  | { status: "error"; message: string };
