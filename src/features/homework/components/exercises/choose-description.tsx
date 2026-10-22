import { Platform, View, useColorScheme } from "react-native";
import Animated from "react-native-reanimated";

import ExercisePrompt from "@/features/homework/components/exercise-prompt";
import OptionButton, { optionState } from "@/features/homework/components/option-button";
import { enterAt } from "@/features/homework/motion";
import type { AnswerValue } from "@/features/homework/types/answer-value";
import type { ChooseDescriptionBlock } from "@/features/homework/types/choose-description-block";
import { BlockNote } from "@/features/material/components/block-chrome";
import { Markdown } from "@/features/material/markdown";
import { colors } from "@/theme/colors";

const MONO = Platform.select({ ios: "Menlo", default: "monospace" });
const LETTERS = "ABCDEFGH";

type Props = {
  block: ChooseDescriptionBlock;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  disabled: boolean;
  correct: AnswerValue | null;
};

/** A passage to read, and the description of it to pick, lettered. A passage
 *  set in "mono" is one whose layout is part of the reading — an email, a chat. */
export default function ChooseDescription({ block, value, onChange, disabled, correct }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const chosen = typeof value === "number" ? value : null;
  const key = typeof correct === "number" ? correct : null;
  const mono = block.font === "mono";

  return (
    <View className="gap-6">
      <ExercisePrompt block={block} />

      {/* The passage, ruled in the brand's green down its left edge. */}
      <View className="flex-row overflow-hidden rounded-3xl border border-border bg-card">
        <View className="w-1.5 bg-primary/70" />
        <View className="flex-1 px-4 py-4">
          <Markdown
            text={block.text}
            color={colors[scheme].foreground}
            size={mono ? 15 : 17}
            fontFamily={mono ? MONO : undefined}
          />
        </View>
      </View>

      <View className="gap-3">
        {block.options.map((option, index) => (
          <Animated.View key={index} entering={enterAt(index)}>
            <OptionButton
              letter={LETTERS[index]}
              state={optionState({ index, chosen, correct: key })}
              disabled={disabled}
              onPress={() => onChange(index)}
            >
              {option}
            </OptionButton>
          </Animated.View>
        ))}
      </View>

      {block.note ? <BlockNote text={block.note} /> : null}
    </View>
  );
}
