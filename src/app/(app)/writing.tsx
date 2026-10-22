import { useState } from "react";
import { Text, View, useColorScheme } from "react-native";
import { PenLine } from "lucide-react-native";

import SentenceBuilder from "@/features/practice/components/sentence-builder";
import ExerciseSession from "@/features/practice/components/exercise-session";
import { fetchWritingCards } from "@/features/practice/data/practice-cards";
import { usePracticeSession } from "@/features/practice/data/use-practice-session";
import { SENTENCE_LABELS } from "@/features/practice/srs";
import type { CardOutcome } from "@/features/practice/types/card-outcome";
import type { WritingCard } from "@/features/practice/types/writing-card";
import { buildBank } from "@/features/practice/word-bank";
import { practiceColors } from "@/theme/colors";

type ExerciseProps = {
  card: WritingCard;
  pool: WritingCard[];
  number: number;
  total: number;
  bottomInset: number;
  onDone: (outcome: CardOutcome) => void;
};

/** The sentence to translate, as a card with the writing skill's mark: the
 *  Portuguese, big, and which lesson it comes from. */
function Prompt({ card }: { card: WritingCard }) {
  const look = practiceColors[useColorScheme() === "dark" ? "dark" : "light"].writing;

  return (
    <View className="gap-4 rounded-[28px] border border-border bg-card p-5">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-row items-center gap-2.5">
          <View
            style={{ backgroundColor: look.tint }}
            className="size-9 items-center justify-center rounded-full"
          >
            <PenLine color={look.icon} size={18} strokeWidth={2.25} />
          </View>
          <Text className="font-sans text-sm font-bold uppercase tracking-[2px] text-muted-foreground">
            Em português
          </Text>
        </View>
        {card.lessonTitle ? (
          <Text
            numberOfLines={1}
            className="max-w-[50%] overflow-hidden rounded-full bg-secondary px-3 py-1 font-sans text-xs font-semibold text-secondary-foreground"
          >
            {card.lessonTitle}
          </Text>
        ) : null}
      </View>
      <Text className="font-sans text-2xl font-bold leading-8 text-foreground">{card.prompt}</Text>
    </View>
  );
}

/** One sentence: read in Portuguese, built in English from a bank of words. */
function WritingExercise({ card, pool, number, total, bottomInset, onDone }: ExerciseProps) {
  const [bank] = useState(() =>
    buildBank(
      card.answer,
      card.distractors,
      pool.filter((other) => other.cardId !== card.cardId).map((other) => other.answer),
    ),
  );

  return (
    <SentenceBuilder
      number={number}
      total={total}
      title="Escreva em inglês"
      prompt={<Prompt card={card} />}
      answer={card.answer}
      bank={bank}
      // The Portuguese is already on screen.
      note={null}
      bottomInset={bottomInset}
      onDone={onDone}
    />
  );
}

/**
 * Writing practice: listening without the audio. A sentence in Portuguese, put
 * into English by tapping its words in order — no typing.
 */
export default function WritingScreen() {
  const session = usePracticeSession(fetchWritingCards);

  return (
    <ExerciseSession
      session={session}
      title="Writing Practice"
      done="todas as frases de hoje"
      upcoming="Novas frases chegam depois das próximas aulas"
      labels={SENTENCE_LABELS}
      practised={(count) => `${count} ${count === 1 ? "frase traduzida" : "frases traduzidas"}`}
      renderCard={(card, context) => <WritingExercise card={card} pool={session.pool} {...context} />}
    />
  );
}
