import { useState } from "react";
import { Pressable, ScrollView, Text, View, useColorScheme } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react-native";

import OptionButton, { optionState } from "@/features/homework/components/option-button";
import ExerciseSession from "@/features/practice/components/exercise-session";
import FeedbackPanel from "@/features/practice/components/feedback-panel";
import PracticeButton from "@/features/practice/components/practice-button";
import PracticeHeader from "@/features/practice/components/practice-header";
import ReadingPassage from "@/features/practice/components/reading-passage";
import { fetchReadingCards } from "@/features/practice/data/practice-cards";
import { usePracticeSession } from "@/features/practice/data/use-practice-session";
import { READING_SESSION_SIZE } from "@/features/practice/session";
import { READING_LABELS } from "@/features/practice/srs";
import type { CardOutcome } from "@/features/practice/types/card-outcome";
import type { ReadingCard } from "@/features/practice/types/reading-card";
import { haptics } from "@/lib/haptics";
import { colors, practiceColors } from "@/theme/colors";

/** The steps a text takes in the sitting: itself, then one per question. */
const stepsOf = (card: ReadingCard) => 1 + card.questions.length;

/** How the text did, from how many of its questions were right: all of them,
 *  most (60% or more), or fewer. */
function outcomeOf(right: number, total: number): CardOutcome {
  const score = total > 0 ? right / total : 0;
  return { rating: score === 1 ? "remembered" : score >= 0.6 ? "almost" : "forgot", score };
}

/** The reading skill's mark: its icon on its tint. */
function ReadingMark({ size = 36 }: { size?: number }) {
  const look = practiceColors[useColorScheme() === "dark" ? "dark" : "light"].reading;
  return (
    <View
      style={{ backgroundColor: look.tint, width: size, height: size }}
      className="items-center justify-center rounded-full"
    >
      <BookOpen color={look.icon} size={size / 2} strokeWidth={2.25} />
    </View>
  );
}

/** Step one: the text, in full, before any question. */
function TextStep({ card, onStart }: { card: ReadingCard; onStart: () => void }) {
  const count = card.questions.length;
  return (
    <>
      <ScrollView className="flex-1" contentContainerClassName="gap-6 px-5 pb-6 pt-2">
        <View className="gap-3">
          <View className="flex-row items-center gap-2.5">
            <ReadingMark />
            <Text className="font-sans text-sm font-bold uppercase tracking-[2px] text-muted-foreground">
              Leitura
            </Text>
            {card.level ? (
              <Text className="overflow-hidden rounded-full bg-secondary px-2.5 py-0.5 font-sans text-xs font-bold text-secondary-foreground">
                {card.level}
              </Text>
            ) : null}
          </View>
          <Text className="font-display text-4xl leading-[44px] text-secondary-foreground">{card.title}</Text>
          {card.blurb ? (
            <Text className="font-sans text-base text-muted-foreground">{card.blurb}</Text>
          ) : null}
        </View>
        <View className="rounded-[28px] border border-border bg-card p-6">
          <ReadingPassage paragraphs={card.paragraphs} />
        </View>
      </ScrollView>
      <View className="px-5 pt-3">
        <PracticeButton
          label={`Responder ${count === 1 ? "a pergunta" : `${count} perguntas`}`}
          variant="primary"
          onPress={onStart}
        />
      </View>
    </>
  );
}

/** A question on the text: which text it is on, the question, the text again
 *  a tap away, and its options. Marked when checked. */
function QuestionStep({
  card,
  number,
  bottomInset,
  onAnswered,
}: {
  card: ReadingCard;
  /** 0-based. */
  number: number;
  bottomInset: number;
  onAnswered: (right: boolean) => void;
}) {
  const palette = colors[useColorScheme() === "dark" ? "dark" : "light"];
  const question = card.questions[number]!;
  const [chosen, setChosen] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [textOpen, setTextOpen] = useState(false);
  const right = chosen === question.answer;

  return (
    <>
      <ScrollView className="flex-1" contentContainerClassName="gap-6 px-5 pb-6 pt-2">
        {/* Which text this is on: its title, and where in its questions. */}
        <View className="flex-row items-center gap-2.5">
          <ReadingMark size={32} />
          <View className="flex-1">
            <Text numberOfLines={1} className="font-sans text-base font-bold text-foreground">
              {card.title}
            </Text>
            <Text className="font-sans text-sm text-muted-foreground">
              Pergunta {number + 1} de {card.questions.length}
            </Text>
          </View>
        </View>

        <Text className="font-sans text-2xl font-bold leading-8 text-foreground">{question.prompt}</Text>

        <View className="overflow-hidden rounded-3xl border border-border bg-card">
          <Pressable
            onPress={() => {
              haptics.select();
              setTextOpen((open) => !open);
            }}
            accessibilityRole="button"
            accessibilityState={{ expanded: textOpen }}
            className="flex-row items-center justify-between px-5 py-3.5 active:opacity-70"
          >
            <Text className="font-sans text-base font-semibold text-secondary-foreground">
              {textOpen ? "Esconder o texto" : "Reler o texto"}
            </Text>
            {textOpen ? (
              <ChevronUp color={palette.mutedForeground} size={20} strokeWidth={2.25} />
            ) : (
              <ChevronDown color={palette.mutedForeground} size={20} strokeWidth={2.25} />
            )}
          </Pressable>
          {textOpen ? (
            <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)} className="px-5 pb-5">
              <ReadingPassage paragraphs={card.paragraphs} compact />
            </Animated.View>
          ) : null}
        </View>

        <View className="gap-3">
          {question.options.map((option, index) => (
            <OptionButton
              key={index}
              letter={String.fromCharCode(65 + index)}
              state={optionState({ index, chosen, correct: checked ? question.answer : null })}
              disabled={checked}
              onPress={() => setChosen(index)}
            >
              {option}
            </OptionButton>
          ))}
        </View>
      </ScrollView>

      {checked ? (
        <FeedbackPanel
          rating={right ? "remembered" : "forgot"}
          label={right ? "Correto!" : "Não foi dessa vez"}
          answer={right ? null : question.options[question.answer]!}
          translation={null}
          bottomInset={bottomInset}
          onContinue={() => onAnswered(right)}
        />
      ) : (
        <View style={{ paddingBottom: bottomInset + 12 }} className="px-5 pt-3">
          <PracticeButton
            label="Verificar"
            variant="primary"
            haptic="none"
            disabled={chosen === null}
            onPress={() => {
              if (right) haptics.success();
              else haptics.warning();
              setChecked(true);
            }}
          />
        </View>
      )}
    </>
  );
}

type ExerciseProps = {
  card: ReadingCard;
  /** The sitting's steps before this text, and in all — for the header. */
  stepsBefore: number;
  totalSteps: number;
  bottomInset: number;
  onDone: (outcome: CardOutcome) => void;
};

/** One text: read, then its questions one by one. Done when the last is
 *  answered, with how many were right. */
function ReadingExercise({ card, stepsBefore, totalSteps, bottomInset, onDone }: ExerciseProps) {
  /** -1 on the text; then the question being asked. */
  const [question, setQuestion] = useState(-1);
  const [right, setRight] = useState(0);

  return (
    <View className="flex-1">
      <PracticeHeader number={stepsBefore + question + 2} total={totalSteps} />
      {question === -1 ? (
        <>
          <TextStep card={card} onStart={() => setQuestion(0)} />
          <View style={{ height: bottomInset + 12 }} />
        </>
      ) : (
        // Keyed so each question starts unanswered, with the text folded away.
        <Animated.View key={question} entering={FadeIn.duration(180)} className="flex-1">
          <QuestionStep
            card={card}
            number={question}
            bottomInset={bottomInset}
            onAnswered={(wasRight) => {
              const total = right + (wasRight ? 1 : 0);
              if (question + 1 < card.questions.length) {
                setRight(total);
                setQuestion(question + 1);
              } else {
                onDone(outcomeOf(total, card.questions.length));
              }
            }}
          />
        </Animated.View>
      )}
    </View>
  );
}

/**
 * Reading practice: a text, then its questions, a step each — the web's
 * reading practice, card by card. Each question is marked as it is answered;
 * the share right decides when the text comes back. Two texts a sitting, and a
 * text missed isn't read again straight after.
 */
export default function ReadingScreen() {
  const session = usePracticeSession(fetchReadingCards, READING_SESSION_SIZE, false);
  const cards = session.state.status === "ready" ? session.state.cards : [];
  const totalSteps = cards.reduce((sum, card) => sum + stepsOf(card), 0);
  const stepsBefore = cards.slice(0, session.index).reduce((sum, card) => sum + stepsOf(card), 0);

  return (
    <ExerciseSession
      session={session}
      title="Reading Practice"
      done="todos os textos de hoje"
      upcoming="Novos textos chegam depois das próximas aulas"
      labels={READING_LABELS}
      practised={(count) => `${count} ${count === 1 ? "texto lido" : "textos lidos"}`}
      renderCard={(card, { bottomInset, onDone }) => (
        <ReadingExercise
          card={card}
          stepsBefore={stepsBefore}
          totalSteps={totalSteps}
          bottomInset={bottomInset}
          onDone={onDone}
        />
      )}
    />
  );
}
