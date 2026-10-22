import type { Assignment } from "@/features/homework/types/assignment";

export type AssignmentState =
  | { status: "loading" }
  | { status: "ready"; assignment: Assignment }
  /** Not published to them, or not theirs — the same, from here. */
  | { status: "missing" }
  | { status: "error"; message: string };
