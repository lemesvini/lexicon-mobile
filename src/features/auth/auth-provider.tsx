import { createContext, use, useEffect, useState } from "react";
import type { AuthError, Session } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { checkAccess, clearAccessCache } from "@/features/auth/student-access";
import { cancelDailyPractice } from "@/features/notifications/daily-practice";
import { unregisterPushToken } from "@/features/notifications/data/push-token";
import type { AccessCheck } from "@/features/auth/types/access-check";
import type { AccessSetters } from "@/features/auth/types/access-setters";
import type { AuthState } from "@/features/auth/types/auth-state";
import type { AuthStatus } from "@/features/auth/types/auth-status";

const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const value = use(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}

const DENIED: Record<"not-student" | "inactive", string> = {
  "not-student": "Esta conta não é de aluno. O app da Lexicon é só para alunos.",
  inactive: "Seu acesso está desativado. Fale com seu professor.",
};

function signInMessage(error: AuthError): string {
  if (error.code === "invalid_credentials") return "Email ou senha incorretos.";
  if (error.status === 0 || error.name === "AuthRetryableFetchError") {
    return "Sem conexão. Confira sua internet e tente de novo.";
  }
  return error.message;
}

async function endSession() {
  const { error } = await supabase.auth.signOut();
  // A global sign-out needs the network; offline, at least forget the session
  // on this device.
  if (error) await supabase.auth.signOut({ scope: "local" });
  clearAccessCache();
}

async function verifyAccess(userId: string, { setAccess, setNotice }: AccessSetters) {
  const check = await checkAccess(userId);
  setAccess({ userId, check });
  if (check.kind === "denied") {
    setNotice(DENIED[check.reason]);
    await endSession();
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // undefined until the stored session has been read.
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [restoredUserId, setRestoredUserId] = useState<string | null>(null);
  const [access, setAccess] = useState<{ userId: string; check: AccessCheck } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);

      if (event === "INITIAL_SESSION") setRestoredUserId(next?.user.id ?? null);
      if (event === "SIGNED_OUT") setAccess(null);

      const userId = next?.user.id;
      if (userId && (event === "INITIAL_SESSION" || event === "SIGNED_IN")) {
        // Deferred on purpose: supabase-js holds its auth lock while it emits
        // this event, and the check queries Supabase. Doing it inline can
        // deadlock (same as lexicon-web's AuthProvider).
        setTimeout(() => void verifyAccess(userId, { setAccess, setNotice }), 0);
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  let status: AuthStatus;
  if (session === undefined) {
    status = "loading";
  } else if (!session) {
    status = "signed-out";
  } else {
    const check = access?.userId === session.user.id ? access.check : null;
    if (check) {
      // "unknown" (offline) lets the student in: RLS still guards the data.
      status = check.kind === "denied" ? "signed-out" : "signed-in";
    } else {
      // A session restored at launch opens the app right away and is checked
      // in the background; a fresh sign-in waits on the sign-in screen.
      status = session.user.id === restoredUserId ? "signed-in" : "signed-out";
    }
  }

  const student =
    access?.userId === session?.user.id && access?.check.kind === "allowed"
      ? access.check.student
      : null;
  const metadata = session?.user.user_metadata;
  const fullName = student?.fullName || (typeof metadata?.full_name === "string" ? metadata.full_name : "");

  const value: AuthState = {
    status,
    session: session ?? null,
    student,
    firstName: fullName.trim().split(/\s+/)[0] ?? "",
    mustChangePassword: metadata?.must_change_password === true,
    notice,
    signIn: async (email, password) => {
      setNotice(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) return signInMessage(error);
      // Shares the listener's request, and keeps the form busy until the
      // check is in and Stack.Protected has moved on from the sign-in screen.
      await verifyAccess(data.user.id, { setAccess, setNotice });
      return null;
    },
    signOut: async () => {
      setNotice(null);
      // While the session can still reach the server: this phone stops getting
      // the student's pushes and reminders. Neither holds up signing out.
      await Promise.allSettled([unregisterPushToken(), cancelDailyPractice()]);
      await endSession();
    },
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}
