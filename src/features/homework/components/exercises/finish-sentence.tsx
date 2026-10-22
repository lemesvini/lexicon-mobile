import { Text, View, useColorScheme } from "react-native";
import Animated from "react-native-reanimated";

import ExercisePrompt from "@/features/homework/components/exercise-prompt";
import OptionButton, { optionState } from "@/features/homework/components/option-button";
import { LAND, enterAt } from "@/features/homework/motion";
import type { AnswerValue } from "@/features/homework/types/answer-value";
import type { FinishSentenceBlock } from "@/features/homework/types/finish-sentence-block";
import { BlockNote } from "@/features/material/components/block-chrome";
import { renderInline } from "@/features/material/inline";
import { exerciseColors } from "@/theme/colors";

type Props = {
  block: FinishSentenceBlock;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  disabled: boolean;
  correct: AnswerValue | null;
};

/** The sentence either side of its gap — the first run of three or more
 *  underscores, which is how `___` is typed. */
function split(sentence: string): { before: string[]; after: string[] } {
  const words = (text: string) => text.trim().split(/\s+/).filter(Boolean);
  const match = /_{3,}/.exec(sentence);
  if (!match) return { before: words(sentence), after: [] };
  return {
    before: words(sentence.slice(0, match.index)),
    after: words(sentence.slice(match.index + match[0].length)),
  };
}

/** The gap: a dashed outline the size of a word, until a word drops into it. */
function Slot({ word, state }: { word: string | null; state: ReturnType<typeof optionState> }) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const palette = exerciseColors[scheme];

  if (word === null) {
    return (
      <View
        style={{ borderColor: palette.idle.border }}
        className="h-11 min-w-[96px] rounded-xl border-2 border-dashed"
      />
    );
  }

  const look = palette[state];
  return (
    // Keyed by the word, so each new pick drops in afresh.
    <Animated.View
      key={word}
      entering={LAND}
      style={{ backgroundColor: look.face, borderColor: look.border }}
      className="h-11 min-w-[96px] items-center justify-center rounded-xl border-2 px-3"
    >
      <Text style={{ color: look.text }} className="font-sans text-xl font-bold">
        {word}
      </Text>
    </Animated.View>
  );
}

/** A sentence with a word missing, and the words to fill it with. The one
 *  picked moves into the gap, leaving its outline behind; another pick swaps it. */
export default function FinishSentence({ block, value, onChange, disabled, correct }: Props) {
  const chosen = typeof value === "number" ? value : null;
  const key = typeof correct === "number" ? correct : null;
  const { before, after } = split(block.sentence);
  const slotState = optionState({ index: chosen ?? -1, chosen, correct: key });

  // Word by word, so the gap flows with the sentence and wraps with it.
  const word = (text: string, index: number) => (
    <Text key={index} className="font-sans text-2xl leading-[44px] text-foreground">
      {renderInline(text)}
    </Text>
  );

  return (
    <View className="gap-8">
      <ExercisePrompt block={block} />

      <View className="flex-row flex-wrap items-center gap-x-2 gap-y-2 rounded-3xl border border-border bg-card px-5 py-6">
        {before.map(word)}
        <Slot word={chosen === null ? null : (block.options[chosen] ?? null)} state={slotState} />
        {after.map((text, index) => word(text, before.length + 1 + index))}
      </View>

      <View className="flex-row flex-wrap justify-center gap-3">
        {block.options.map((option, index) => {
          const state = optionState({ index, chosen, correct: key });
          return (
            <Animated.View key={index} entering={enterAt(index)}>
              <OptionButton
                variant="chip"
                state={state}
                // Moved into the gap while answering; once graded, shown with
                // its mark where it was.
                hollow={!disabled && state === "chosen"}
                disabled={disabled}
                onPress={() => onChange(index)}
              >
                {option}
              </OptionButton>
            </Animated.View>
          );
        })}
      </View>

      {block.note ? <BlockNote text={block.note} /> : null}
    </View>
  );
}
