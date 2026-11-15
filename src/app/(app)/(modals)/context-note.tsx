import { useRef, useState } from "react";
import { Text, TextInput, useColorScheme, View } from "react-native";
import { router, Stack } from "expo-router";

import AuthField from "@/features/auth/components/auth-field";
import { addContextNote, MAX_BODY, MAX_TITLE } from "@/features/context/data/student-context";
import KeyboardAwareScrollView, { KEYBOARD_GAP } from "@/lib/keyboard-aware-scroll-view";
import { useToolbarIcon } from "@/lib/toolbar-icon";
import { colors } from "@/theme/colors";

/**
 * The student writing something into their own context — lexicon-web's
 * ContextNoteForm. Append-only, and the sheet says so: what goes in is dated
 * and stays. Taking something out is a conversation with the teacher.
 */
export default function ContextNoteScreen() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const palette = colors[scheme];
  const closeIcon = useToolbarIcon("xmark", "close");
  const saveIcon = useToolbarIcon("checkmark", "check");
  const bodyRef = useRef<TextInput>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready = title.trim().length > 0 && body.trim().length > 0;

  async function save() {
    if (saving || !ready) return;

    setSaving(true);
    setError(null);
    try {
      await addContextNote(title.trim(), body.trim());
      router.back();
    } catch {
      setSaving(false);
      setError("Não foi possível salvar. Tente de novo.");
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: "Adicionar" }} />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon={closeIcon}
          accessibilityLabel="Cancelar"
          onPress={() => router.back()}
          tintColor={palette.primary}
          disabled={saving}
        />
      </Stack.Toolbar>
      {/* The sheet's confirm, as iOS puts it: a prominent check on the right,
          off until both fields have something in them. */}
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={saveIcon}
          accessibilityLabel="Salvar"
          variant="prominent"
          onPress={save}
          tintColor={palette.primary}
          disabled={!ready || saving}
        />
      </Stack.Toolbar>

      <KeyboardAwareScrollView
        contentInsetAdjustmentBehavior="automatic"
        bottomOffset={KEYBOARD_GAP}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-5 p-6"
      >
        <AuthField
          label="Sobre o que é?"
          value={title}
          onChangeText={setTitle}
          maxLength={MAX_TITLE}
          placeholder="Ex.: Vou viajar a trabalho em novembro"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => bodyRef.current?.focus()}
          editable={!saving}
        />

        <View className="gap-2">
          <Text className="font-sans text-sm font-semibold text-foreground">
            Conte para o seu professor
          </Text>
          <TextInput
            ref={bodyRef}
            value={body}
            onChangeText={setBody}
            maxLength={MAX_BODY}
            multiline
            textAlignVertical="top"
            placeholder="O que mudou, o que você quer praticar, o que está difícil…"
            placeholderTextColor={palette.mutedForeground}
            selectionColor={palette.primary}
            editable={!saving}
            className="min-h-36 rounded-xl border border-input bg-card px-4 py-3 font-sans text-base text-foreground"
          />
          <Text className="text-right font-sans text-xs text-muted-foreground">
            {body.length}/{MAX_BODY}
          </Text>
        </View>

        {error && (
          <Text accessibilityRole="alert" className="font-sans text-sm text-destructive">
            {error}
          </Text>
        )}

        <Text className="text-center font-sans text-xs text-muted-foreground">
          Fica salvo com a data de hoje e não pode ser apagado.
        </Text>
      </KeyboardAwareScrollView>
    </>
  );
}
