import type { AccessCheck } from "@/features/auth/types/access-check";

/** The AuthProvider state setters an access check reports back through. */
export type AccessSetters = {
  setAccess: (access: { userId: string; check: AccessCheck }) => void;
  setNotice: (notice: string | null) => void;
};
