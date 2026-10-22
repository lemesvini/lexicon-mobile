import type { Student } from "@/features/auth/types/student";

export type AccessCheck =
  | { kind: "allowed"; student: Student }
  /** No roster row — a teacher or admin account — or a deactivated student. */
  | { kind: "denied"; reason: "not-student" | "inactive" }
  /** The request failed (offline, timeout). Not cached, so it's retried. */
  | { kind: "unknown" };
