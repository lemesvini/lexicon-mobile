import type { Session } from "@supabase/supabase-js";

import type { AuthStatus } from "@/features/auth/types/auth-status";
import type { Student } from "@/features/auth/types/student";

export type AuthState = {
  status: AuthStatus;
  session: Session | null;
  /** The roster row, once the access check has come back. */
  student: Student | null;
  /** First word of the student's name, or "" if it isn't known. */
  firstName: string;
  /** Set by the teacher panel's Edge Functions when they issue a temporary
   *  password; cleared by the change-password screen. */
  mustChangePassword: boolean;
  /** Why the last session was ended, shown on the sign-in screen. */
  notice: string | null;
  /** Resolves with an error message, or null once the student is let in. */
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};
