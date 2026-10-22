import { useCallback, useState } from "react";
import { Alert, Linking } from "react-native";
import { useFocusEffect } from "expo-router";

import { fetchClassReminders, saveClassReminders } from "@/features/notifications/data/class-reminders";
import { registerPushToken } from "@/features/notifications/data/push-token";
import { isDailyPracticeOn, setDailyPracticeOn } from "@/features/notifications/daily-practice";
import { getPermission, requestPermission } from "@/features/notifications/permissions";
import type { PermissionStatus } from "@/features/notifications/types/permission-status";

/**
 * The Me tab's two switches: the daily practice reminder (on the phone) and
 * the class reminder (on the server). Both show as off while the system won't
 * let the app notify — a switch that's on and does nothing would be a lie —
 * and turning one on asks for the permission, or points to the settings when
 * only they can give it.
 *
 * Re-reads on focus: the student may have come back from the system settings.
 */
export function useNotificationSettings() {
  const [permission, setPermission] = useState<PermissionStatus | null>(null);
  const [practice, setPractice] = useState(isDailyPracticeOn);
  const [classes, setClasses] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getPermission().then(setPermission).catch(() => {});
      fetchClassReminders().then(setClasses).catch(() => {});
    }, []),
  );

  async function allowed(): Promise<boolean> {
    let status = await getPermission();
    if (status === "undetermined") status = await requestPermission();
    setPermission(status);

    if (status === "granted") {
      registerPushToken().catch(() => {});
      return true;
    }
    Alert.alert(
      "Notificações desligadas",
      "Para receber lembretes, permita as notificações do Lexicon nos ajustes do celular.",
      [
        { text: "Agora não", style: "cancel" },
        { text: "Abrir ajustes", onPress: () => void Linking.openSettings() },
      ],
    );
    return false;
  }

  async function togglePractice(next: boolean) {
    if (next && !(await allowed())) return;
    setPractice(next);
    await setDailyPracticeOn(next).catch(() => {});
  }

  async function toggleClasses(next: boolean) {
    if (next && !(await allowed())) return;
    setClasses(next);
    try {
      await saveClassReminders(next);
    } catch {
      setClasses(!next);
      Alert.alert("Não foi possível salvar", "Confira sua internet e tente de novo.");
    }
  }

  const granted = permission === "granted";

  return {
    practice: granted && practice,
    classes: granted && classes,
    /** The system says no, and only its settings can change that. */
    blocked: permission === "blocked",
    togglePractice,
    toggleClasses,
  };
}
