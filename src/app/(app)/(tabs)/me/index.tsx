import { Alert, RefreshControl, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import {
  Bell,
  CalendarClock,
  FileText,
  KeyRound,
  LogOut,
  ShieldCheck,
  Sparkles,
} from "lucide-react-native";

import { useAuth } from "@/features/auth/auth-provider";
import { useNotificationSettings } from "@/features/notifications/use-notification-settings";
import ProgressCard from "@/features/profile/components/progress-card";
import SettingsRow from "@/features/profile/components/settings-row";
import SettingsSection from "@/features/profile/components/settings-section";
import { useProgress } from "@/features/profile/data/use-progress";
import { legalLinks } from "@/features/profile/legal-links";

export default function MeScreen() {
  const { session, student, signOut } = useAuth();
  const { state, refreshing, refresh } = useProgress();
  const notifications = useNotificationSettings();

  const name = student?.fullName || session?.user.user_metadata?.full_name || "";
  const where =
    state.status === "ready"
      ? [state.data.moduleName, state.data.unitName]
      : [student?.moduleName];

  function confirmSignOut() {
    Alert.alert("Sair da conta?", "Você vai precisar do email e da senha para entrar de novo.", [
      { text: "Cancelar", style: "cancel" },
      // Stack.Protected takes the app away on its own.
      { text: "Sair", style: "destructive", onPress: () => void signOut() },
    ]);
  }

  function open(url: string | null) {
    return url ? () => void WebBrowser.openBrowserAsync(url) : undefined;
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="gap-6 p-4"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    >
      <View className="flex-row items-center gap-4 pt-6">
        <View className="size-20 items-center justify-center rounded-full bg-ring/20">
          <Text className="font-display text-4xl text-secondary-foreground">
            {name.trim().charAt(0).toUpperCase() || "?"}
          </Text>
        </View>
        <View className="flex-1 gap-1">
          {name ? (
            <Text numberOfLines={1} className="font-display text-3xl text-secondary-foreground">
              {name}
            </Text>
          ) : null}
          <Text numberOfLines={1} className="font-sans text-sm text-muted-foreground">
            {where.filter(Boolean).join(" · ") || student?.email || session?.user.email}
          </Text>
        </View>
      </View>

      {state.status === "ready" ? (
        <ProgressCard progress={state.data} />
      ) : state.status === "error" ? (
        <Text className="py-6 text-center font-sans text-sm text-muted-foreground">
          Não foi possível carregar seu progresso. Puxe para tentar de novo.
        </Text>
      ) : (
        <ProgressCard loading />
      )}

      <SettingsSection>
        <SettingsRow icon={Sparkles} label="My context" onPress={() => router.push("/me/context")} />
      </SettingsSection>

      <View className="gap-2">
        <SettingsSection title="Notificações">
          <SettingsRow
            icon={Bell}
            label="Lembrete diário de prática"
            value={notifications.practice}
            onValueChange={(next) => void notifications.togglePractice(next)}
          />
          <SettingsRow
            icon={CalendarClock}
            label="Lembrete de aula"
            value={notifications.classes}
            onValueChange={(next) => void notifications.toggleClasses(next)}
          />
        </SettingsSection>
        <Text className="px-4 font-sans text-[13px] text-muted-foreground">
          {notifications.blocked
            ? "As notificações do Lexicon estão desligadas nos ajustes do celular."
            : "A prática às 19h, e a aula uma hora antes. Correções e relatórios chegam sempre."}
        </Text>
      </View>

      <SettingsSection title="Conta">
        <SettingsRow
          icon={KeyRound}
          label="Trocar senha"
          onPress={() => router.push("/change-password")}
        />
      </SettingsSection>

      <SettingsSection title="Sobre">
        <SettingsRow
          icon={ShieldCheck}
          label="Política de privacidade"
          onPress={open(legalLinks.privacy)}
          detail={legalLinks.privacy ? undefined : "Em breve"}
        />
        <SettingsRow
          icon={FileText}
          label="Termos de uso"
          onPress={open(legalLinks.terms)}
          detail={legalLinks.terms ? undefined : "Em breve"}
        />
      </SettingsSection>

      <SettingsSection>
        <SettingsRow icon={LogOut} label="Sair" onPress={confirmSignOut} destructive />
      </SettingsSection>

      <Text className="text-center font-sans text-xs text-muted-foreground">
        Versão {Constants.expoConfig?.version}
      </Text>
    </ScrollView>
  );
}
