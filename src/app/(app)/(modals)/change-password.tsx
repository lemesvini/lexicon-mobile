import { useEffect, useRef, useState } from "react";
import { BackHandler, Pressable, ScrollView, Text, type TextInput, useColorScheme, View } from "react-native";
import { router, Stack } from "expo-router";

import { useAuth } from "@/features/auth/auth-provider";
import AuthField from "@/features/auth/components/auth-field";
import SubmitButton from "@/features/auth/components/submit-button";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/colors";

const MIN_LENGTH = 8;

/**
 * Sheet for setting a new password. Opened by PasswordGate while the account
 * is on a temporary password from the teacher panel — and then it can't be
 * dismissed — or from the profile sheet, when the student wants to change it.
 */
export default function ChangePasswordScreen() {
  const { mustChangePassword: forced, signOut } = useAuth();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const confirmationRef = useRef<TextInput>(null);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The swipe-down is blocked through `gestureEnabled`; this covers Android's
  // back button.
  useEffect(() => {
    if (!forced) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, [forced]);

  async function handleSubmit() {
    if (password.length < MIN_LENGTH) {
      setError(`Use pelo menos ${MIN_LENGTH} caracteres.`);
      return;
    }
    if (password !== confirmation) {
      setError("As duas senhas não são iguais.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    // Clearing the flag is part of the same write, as on the web: leaving it
    // set would reopen this sheet straight away.
    const { error: updateError } = await supabase.auth.updateUser({
      password,
      data: { must_change_password: false },
    });

    setIsSubmitting(false);

    if (updateError) {
      if (updateError.code === "same_password") {
        setError("A nova senha precisa ser diferente da atual.");
      } else if (updateError.code === "weak_password") {
        setError("Essa senha é fraca demais. Tente uma mais longa.");
      } else {
        setError(updateError.message);
      }
      return;
    }

    router.back();
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: forced ? "Crie sua senha" : "Trocar senha",
          gestureEnabled: !forced,
        }}
      />
      {!forced && (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Button
            icon="xmark"
            onPress={() => router.back()}
            tintColor={colors[scheme].primary}
          />
        </Stack.Toolbar>
      )}

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-5 p-6"
      >
        <Text className="font-sans text-base text-muted-foreground">
          {forced
            ? "Você entrou com uma senha temporária. Escolha a sua para continuar."
            : "Escolha uma nova senha para a sua conta."}
        </Text>

        <AuthField
          label="Nova senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          passwordRules={`minlength: ${MIN_LENGTH};`}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => confirmationRef.current?.focus()}
          editable={!isSubmitting}
        />
        <AuthField
          ref={confirmationRef}
          label="Confirme a senha"
          value={confirmation}
          onChangeText={setConfirmation}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          editable={!isSubmitting}
        />

        {error && (
          <Text accessibilityRole="alert" className="font-sans text-sm text-destructive">
            {error}
          </Text>
        )}

        <View className="mt-2">
          <SubmitButton
            label="Salvar senha"
            busyLabel="Salvando…"
            busy={isSubmitting}
            onPress={handleSubmit}
          />
        </View>

        {forced && (
          <Pressable
            accessibilityRole="button"
            onPress={signOut}
            disabled={isSubmitting}
            className="items-center py-2"
          >
            <Text className="font-sans text-sm font-semibold text-muted-foreground">
              Entrar com outra conta
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </>
  );
}
