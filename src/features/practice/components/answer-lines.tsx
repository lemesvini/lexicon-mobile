import { View } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";

import OptionButton from "@/features/homework/components/option-button";
import type { OptionState } from "@/features/homework/types/option-state";
import type { WordChip } from "@/features/practice/types/word-chip";

/** One row of chips, gap included: where each ruled line falls. */
const ROW = 60;
/** At least this many lines, so the space is there before the first tap. */
const LINES = 2;

type Props = {
  chips: WordChip[];
  /** Once checked: how the whole answer is shown. */
  state: OptionState;
  disabled: boolean;
  onRemove: (chip: WordChip) => void;
};

/** Where the sentence is rebuilt: ruled lines, as on a page, with the words
 *  tapped so far sitting on them. A word tapped here goes back to the bank. */
export default function AnswerLines({ chips, state, disabled, onRemove }: Props) {
  return (
    <View style={{ minHeight: ROW * LINES }}>
      {Array.from({ length: LINES }, (_, line) => (
        <View
          key={line}
          style={{ position: "absolute", left: 0, right: 0, top: ROW * (line + 1) - 4 }}
          className="h-px bg-border"
        />
      ))}
      <View className="flex-row flex-wrap gap-x-2 gap-y-2">
        {chips.map((chip) => (
          <Animated.View key={chip.id} entering={FadeIn.duration(140)} layout={LinearTransition.duration(180)}>
            <OptionButton variant="chip" state={state} disabled={disabled} onPress={() => onRemove(chip)}>
              {chip.text}
            </OptionButton>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
