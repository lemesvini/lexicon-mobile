import { View } from "react-native";
import Animated from "react-native-reanimated";

import ExercisePrompt from "@/features/homework/components/exercise-prompt";
import OptionButton, { optionState } from "@/features/homework/components/option-button";
import { enterAt } from "@/features/homework/motion";
import type { AnswerValue } from "@/features/homework/types/answer-value";
import type { FindMistakeBlock } from "@/features/homework/types/find-mistake-block";
import { BlockNote } from "@/features/material/components/block-chrome";

type Props = {
  block: FindMistakeBlock;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  disabled: boolean;
  correct: AnswerValue | null;
};

/** The sentence's words as the answer counts them: split on whitespace, with
 *  punctuation travelling with its word. */
function words(sentence: string): string[] {
  return sentence.trim().split(/\s+/).filter(Boolean);
}

/** A sentence with one wrong word, every word a chip to tap. */
export default function FindMistake({ block, value, onChange, disabled, correct }: Props) {
  const chosen = typeof value === "number" ? value : null;
  const key = typeof correct === "number" ? correct : null;

  return (
    <View className="gap-8">
      <ExercisePrompt block={block} />
      <View className="flex-row flex-wrap justify-center gap-2.5 rounded-3xl border border-border bg-card px-4 py-6">
        {words(block.sentence).map((word, index) => (
          <Animated.View key={index} entering={enterAt(index)}>
            <OptionButton
              variant="chip"
              state={optionState({ index, chosen, correct: key })}
              disabled={disabled}
              onPress={() => onChange(index)}
            >
              {word}
            </OptionButton>
          </Animated.View>
        ))}
      </View>
      {block.note ? <BlockNote text={block.note} /> : null}
    </View>
  );
}
