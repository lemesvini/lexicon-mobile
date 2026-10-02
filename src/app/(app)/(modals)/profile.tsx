import { Alert, ScrollView, Text, useColorScheme, View } from "react-native";
import { router, Stack } from "expo-router";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { FileText, KeyRound, LogOut, ShieldCheck } from "lucide-react-native";

import { useAuth } from "@/features/auth/auth-provider";
import SettingsRow from "@/features/profile/components/settings-row";
import SettingsSection from "@/features/profile/components/settings-section";
import { legalLinks } from "@/features/profile/legal-links";
import { colors } from "@/theme/colors";

export default function ProfileScreen() {
  const { session, student, signOut } = useAuth();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  const name = student?.fullName || session?.user.user_metadata?.full_name || "";
  const email = student?.email || session?.user.email || "";

  function confirmSignOut() {
    Alert.alert("Sair da conta?", "Você vai precisar do email e da senha para entrar de novo.", [
      { text: "Cancelar", style: "cancel" },
      // Stack.Protected closes this sheet and the app behind it on its own.
      { text: "Sair", style: "destructive", onPress: () => void signOut() },
    ]);
  }

  function open(url: string | null) {
    return url ? () => void WebBrowser.openBrowserAsync(url) : undefined;
  }

  return (
    <>
      <Stack.Screen options={{ title: "Perfil" }} />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="xmark"
          onPress={() => router.back()}
          tintColor={colors[scheme].primary}
        />
      </Stack.Toolbar>

      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName="gap-8 p-4">
        <View className="items-center gap-1 pt-2">
          <View className="mb-3 size-20 items-center justify-center rounded-full bg-ring/20">
            <Text className="font-display text-4xl text-secondary-foreground">
              {name.trim().charAt(0).toUpperCase() || "?"}
            </Text>
          </View>
          {name ? (
            <Text className="text-center font-display text-2xl text-secondary-foreground">{name}</Text>
          ) : null}
          <Text className="font-sans text-sm text-muted-foreground">{email}</Text>
          {student?.moduleName && (
            <Text className="mt-2 rounded-full bg-accent px-3 py-1 font-sans text-xs font-semibold text-accent-foreground">
              {student.moduleName}
            </Text>
          )}
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
    </>
  );
}
