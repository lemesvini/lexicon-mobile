import { ScrollView, Text, useColorScheme, View } from "react-native";
import { router, Stack } from "expo-router";
import { Bell, Mic } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PermissionCard from "@/features/permissions/components/permission-card";
import { usePermissions } from "@/features/permissions/use-permissions";
import PracticeButton from "@/features/practice/components/practice-button";
import { colors, practiceColors } from "@/theme/colors";

/**
 * The microphone and the notifications, explained before the system asks:
 * opened over the Today screen on the first visit (see usePermissionsPrompt).
 * Each card asks for its own, so a "no" to one doesn't take the other with it.
 */
export default function PermissionsScreen() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const insets = useSafeAreaInsets();
  const permissions = usePermissions();
  const done = permissions.microphone === "granted" && permissions.notifications === "granted";

  return (
    <>
      <Stack.Screen options={{ title: "Antes de começar" }} />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="xmark"
          accessibilityLabel="Fechar"
          onPress={() => router.back()}
          tintColor={colors[scheme].primary}
        />
      </Stack.Toolbar>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1"
        contentContainerClassName="gap-4 p-6"
      >
        <Text className="font-sans text-base text-muted-foreground">
          Duas permissões para aproveitar o Lexicon por inteiro. Você pode mudar de ideia quando
          quiser, nos ajustes do celular.
        </Text>

        <PermissionCard
          icon={Mic}
          look={practiceColors[scheme].speaking}
          title="Microfone"
          body="Para ouvir você falar em inglês nas práticas de speaking. O Lexicon não guarda o áudio."
          status={permissions.microphone}
          onAllow={() => void permissions.allow("microphone")}
        />
        <PermissionCard
          icon={Bell}
          look={practiceColors[scheme].writing}
          title="Notificações"
          body="Lembretes de aula e de prática, e um aviso quando o professor corrigir uma atividade."
          status={permissions.notifications}
          onAllow={() => void permissions.allow("notifications")}
        />
      </ScrollView>

      <View style={{ paddingBottom: insets.bottom + 12 }} className="px-6 pt-4">
        <PracticeButton
          label={done ? "Continuar" : "Agora não"}
          variant={done ? "primary" : "plain"}
          onPress={() => router.back()}
        />
      </View>
    </>
  );
}
