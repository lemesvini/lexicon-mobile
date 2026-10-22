import { useState } from "react";
import { Text, TextInput, View, useColorScheme } from "react-native";

import ExercisePrompt from "@/features/homework/components/exercise-prompt";
import type { AnswerValue } from "@/features/homework/types/answer-value";
import type { LongAnswerBlock } from "@/features/homework/types/long-answer-block";
import { BlockNote } from "@/features/material/components/block-chrome";
import { renderInline } from "@/features/material/inline";
import { colors, exerciseColors } from "@/theme/colors";

type Props = {
  block: LongAnswerBlock;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  disabled: boolean;
};

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

/** A question answered in the student's own words: a deep box that lights up
 *  in the brand's green while it's being written in, and counts the words. Read
 *  back as it was written once handed in. */
export default function LongAnswer({ block, value, onChange, disabled }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const palette = exerciseColors[scheme];
  const [focused, setFocused] = useState(false);
  const text = typeof value === "string" ? value : "";
  const look = focused ? palette.chosen : palette.idle;
  const count = wordCount(text);

  return (
    <View className="gap-5">
      <ExercisePrompt block={block} />

      <View className="gap-1.5">
        <Text className="font-sans text-xl font-semibold leading-snug text-foreground">
          {renderInline(block.question)}
        </Text>
        {block.hint ? (
          <Text className="font-sans text-sm text-muted-foreground">{block.hint}</Text>
        ) : null}
      </View>

      {disabled ? (
        <View className="rounded-2xl border-2 border-border bg-muted/40 px-4 py-3.5">
          <Text className={`font-sans text-base leading-relaxed ${text ? "text-foreground" : "text-muted-foreground"}`}>
            {text || "Deixado em branco."}
          </Text>
        </View>
      ) : (
        <View
          style={{ backgroundColor: look.face, borderColor: look.border, borderBottomColor: look.edge }}
          className="rounded-2xl border-2 border-b-[5px]"
        >
          <TextInput
            value={text}
            onChangeText={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            multiline
            placeholder="Escreva sua resposta…"
            placeholderTextColor={colors[scheme].mutedForeground}
            textAlignVertical="top"
            className="min-h-40 px-4 pb-2 pt-3.5 font-sans text-base leading-relaxed text-foreground"
          />
          <Text className="px-4 pb-2.5 text-right font-sans text-xs font-semibold text-muted-foreground">
            {count} {count === 1 ? "palavra" : "palavras"}
          </Text>
        </View>
      )}

      {block.note ? <BlockNote text={block.note} /> : null}
    </View>
  );
}
