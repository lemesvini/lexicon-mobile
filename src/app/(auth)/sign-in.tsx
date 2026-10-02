import { useRef, useState } from "react";
import { ScrollView, Text, type TextInput, useColorScheme, View } from "react-native";
import { router, Stack } from "expo-router";

import { useAuth } from "@/features/auth/auth-provider";
import AuthField from "@/features/auth/components/auth-field";
import SubmitButton from "@/features/auth/components/submit-button";
import { colors } from "@/theme/colors";

/** Sheet over the welcome screen. On success Stack.Protected removes the whole
 *  (auth) group, sheet included, so there is no navigation to do here. */
export default function SignInScreen() {
  const { signIn, notice } = useAuth();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password) {
      setError("Preencha o email e a senha.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    const message = await signIn(email, password);
    setIsSubmitting(false);
    setError(message);
  }

  const message = error ?? notice;

  return (
    <>
      <Stack.Screen options={{ title: "Entrar" }} />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="xmark"
          onPress={() => router.back()}
          tintColor={colors[scheme].primary}
        />
      </Stack.Toolbar>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        // automaticallyAdjustKeyboardInsets
        // keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-5 p-6"
      >
        <View className="">
          <Text className="font-sans text-base text-muted-foreground">
            Use o email e a senha que seu professor enviou.
          </Text>
        </View>

        <AuthField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="username"
          autoFocus
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
          editable={!isSubmitting}
        />
        <AuthField
          ref={passwordRef}
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
          editable={!isSubmitting}
        />

        {message && (
          <Text accessibilityRole="alert" className="font-sans text-sm text-destructive">
            {message}
          </Text>
        )}

        <View className="mt-2">
          <SubmitButton label="Entrar" busyLabel="Entrando…" busy={isSubmitting} onPress={handleSubmit} />
        </View>

        <Text className="text-center font-sans text-sm text-muted-foreground">
          Esqueceu a senha? Peça uma nova ao seu professor.
        </Text>
      </ScrollView>
    </>
  );
}
