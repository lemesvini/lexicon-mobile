import { useState } from "react";
import { Alert, ScrollView, Text, useColorScheme, View } from "react-native";
import { router, Stack } from "expo-router";

import { useAuth } from "@/features/auth/auth-provider";
import SubmitButton from "@/features/auth/components/submit-button";
import { useToolbarIcon } from "@/lib/toolbar-icon";
import { colors } from "@/theme/colors";

const DELETED = [
  "Seu login, seu nome, seu email e seu telefone",
  "Suas tarefas, sua presença, seu progresso e seus relatórios",
  "O que você escreveu em My context",
  "Sua foto e suas notificações",
];

/**
 * Sheet for deleting the account, opened from the Me tab. Says what goes and
 * what stays, then asks once more: the deletion is immediate and can't be
 * undone. On success Stack.Protected takes the app away, sheet included.
 */
export default function DeleteAccountScreen() {
  const { deleteAccount } = useAuth();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const closeIcon = useToolbarIcon("xmark", "close");
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setError(null);
    setIsDeleting(true);
    const message = await deleteAccount();
    setIsDeleting(false);
    setError(message);
  }

  function confirmDelete() {
    Alert.alert("Excluir sua conta?", "Essa ação é definitiva e não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => void handleDelete() },
    ]);
  }

  return (
    <>
      <Stack.Screen options={{ title: "Excluir conta", gestureEnabled: !isDeleting }} />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={closeIcon}
          accessibilityLabel="Fechar"
          disabled={isDeleting}
          onPress={() => router.back()}
          tintColor={colors[scheme].primary}
        />
      </Stack.Toolbar>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="gap-5 p-6"
      >
        <Text className="font-sans text-base text-muted-foreground">
          Sua conta do Lexicon será excluída na hora, e isso não pode ser desfeito.
        </Text>

        <View className="gap-2">
          <Text className="font-sans text-base font-semibold text-foreground">
            O que será apagado
          </Text>
          {DELETED.map((item) => (
            <Text key={item} className="font-sans text-base text-foreground">
              • {item}
            </Text>
          ))}
        </View>

        <View className="gap-2">
          <Text className="font-sans text-base font-semibold text-foreground">O que continua</Text>
          <Text className="font-sans text-base text-foreground">
            Os pagamentos já feitos ficam no financeiro da escola, sem nada que identifique você.
          </Text>
        </View>

        <View className="gap-2">
          <Text className="font-sans text-base font-semibold text-foreground">Suas aulas</Text>
          <Text className="font-sans text-base text-foreground">
            Excluir a conta não cancela suas aulas nem suas mensalidades. Para isso, fale com seu
            professor.
          </Text>
        </View>

        {error && (
          <Text accessibilityRole="alert" className="font-sans text-sm text-destructive">
            {error}
          </Text>
        )}

        <View className="mt-2">
          <SubmitButton
            label="Excluir minha conta"
            busyLabel="Excluindo…"
            busy={isDeleting}
            onPress={confirmDelete}
            destructive
          />
        </View>
      </ScrollView>
    </>
  );
}
