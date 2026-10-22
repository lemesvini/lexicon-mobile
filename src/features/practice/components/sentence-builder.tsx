import { type ReactNode, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import OptionButton from "@/features/homework/components/option-button";
import AnswerLines from "@/features/practice/components/answer-lines";
import FeedbackPanel from "@/features/practice/components/feedback-panel";
import PracticeButton from "@/features/practice/components/practice-button";
import PracticeHeader from "@/features/practice/components/practice-header";
import type { CardOutcome } from "@/features/practice/types/card-outcome";
import type { WordChip } from "@/features/practice/types/word-chip";
import { checkSentence } from "@/features/practice/word-bank";
import { haptics } from "@/lib/haptics";

type Props = {
  number: number;
  total: number;
  /** The header's speaker, when there is something to play. */
  onSpeak?: () => void;
  speakDisabled?: boolean;
  /** The instruction: "Toque no que você ouvir". */
  title: string;
  /** What the sentence is given as, under the title: the audio's buttons, the
   *  Portuguese. */
  prompt: ReactNode;
  /** The sentence to build. */
  answer: string;
  bank: WordChip[];
  /** Under the answer once checked — the translation, when it isn't already
   *  on screen. */
  note: string | null;
  bottomInset: number;
  onDone: (outcome: CardOutcome) => void;
};

/**
 * A sentence built from a bank of words, Duolingo's way — listening's and
 * writing's exercise, which differ only in how the sentence is given. Tap a
 * word to place it, tap a placed one to send it back, check, and see how it
 * went in a panel rising from the bottom.
 */
export default function SentenceBuilder({
  number,
  total,
  onSpeak,
  speakDisabled,
  title,
  prompt,
  answer,
  bank,
  note,
  bottomInset,
  onDone,
}: Props) {
  const [chosen, setChosen] = useState<WordChip[]>([]);
  const [outcome, setOutcome] = useState<CardOutcome | null>(null);

  const used = new Set(chosen.map((chip) => chip.id));
  const checked = outcome !== null;

  const check = () => {
    const result = checkSentence(answer, chosen);
    if (result.rating === "remembered") haptics.success();
    else haptics.warning();
    setOutcome(result);
  };

  return (
    <View className="flex-1">
      <PracticeHeader number={number} total={total} onSpeak={onSpeak} speakDisabled={speakDisabled} />

      <ScrollView className="flex-1" contentContainerClassName="gap-7 px-5 pb-6 pt-2">
        <Text className="font-display text-3xl text-secondary-foreground">{title}</Text>

        {prompt}

        <AnswerLines
          chips={chosen}
          state={!checked ? "idle" : outcome.rating === "remembered" ? "correct" : "incorrect"}
          disabled={checked}
          onRemove={(chip) => setChosen((current) => current.filter((c) => c.id !== chip.id))}
        />

        <View className="flex-row flex-wrap justify-center gap-2 pt-2">
          {bank.map((chip) => (
            <OptionButton
              key={chip.id}
              variant="chip"
              state="idle"
              hollow={used.has(chip.id)}
              disabled={checked}
              onPress={() => setChosen((current) => [...current, chip])}
            >
              {chip.text}
            </OptionButton>
          ))}
        </View>
      </ScrollView>

      {outcome ? (
        <FeedbackPanel
          rating={outcome.rating}
          label={
            outcome.rating === "remembered" ? "Correto!" : outcome.rating === "almost" ? "Quase!" : "Não foi dessa vez"
          }
          answer={outcome.rating === "remembered" ? null : answer}
          translation={note}
          bottomInset={bottomInset}
          onContinue={() => onDone(outcome)}
        />
      ) : (
        <View style={{ paddingBottom: bottomInset + 12 }} className="px-5 pt-3">
          <PracticeButton
            label="Verificar"
            variant="primary"
            haptic="none"
            disabled={chosen.length === 0}
            onPress={check}
          />
        </View>
      )}
    </View>
  );
}
