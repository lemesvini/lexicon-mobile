// Whether the signed-in account may use the app, read from its own roster row.
// Mirrors lexicon-web/src/lib/student-access.ts: RLS already limits `students`
// to the caller's own row, so there is nothing to filter here.

import { supabase } from "@/lib/supabase";

export type Student = {
  fullName: string;
  email: string;
  moduleName: string | null;
};

export type AccessCheck =
  | { kind: "allowed"; student: Student }
  /** No roster row — a teacher or admin account — or a deactivated student. */
  | { kind: "denied"; reason: "not-student" | "inactive" }
  /** The request failed (offline, timeout). Not cached, so it's retried. */
  | { kind: "unknown" };

const cache = new Map<string, Promise<AccessCheck>>();

export function clearAccessCache() {
  cache.clear();
}

async function fetchAccess(userId: string): Promise<AccessCheck> {
  const { data, error } = await supabase
    .from("students")
    .select("full_name, email, status, module:modules (name)")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return { kind: "unknown" };
  if (!data) return { kind: "denied", reason: "not-student" };
  if (data.status === "inactive") return { kind: "denied", reason: "inactive" };

  // PostgREST returns an embedded to-one either as an object or as a
  // one-element array, depending on how it resolves the relationship.
  const embedded = data.module as { name?: string } | { name?: string }[] | null;
  const module = Array.isArray(embedded) ? embedded[0] : embedded;

  return {
    kind: "allowed",
    student: {
      fullName: data.full_name ?? "",
      email: data.email ?? "",
      moduleName: module?.name ?? null,
    },
  };
}

/** Holds the in-flight promise, so the sign-in screen and the auth listener
 *  checking the same user share one request. */
export function checkAccess(userId: string): Promise<AccessCheck> {
  const hit = cache.get(userId);
  if (hit) return hit;

  const promise = fetchAccess(userId).then((check) => {
    if (check.kind === "unknown") cache.delete(userId);
    return check;
  });
  cache.set(userId, promise);
  return promise;
}
