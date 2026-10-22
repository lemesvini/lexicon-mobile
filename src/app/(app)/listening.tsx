import { useEffect, useRef, useState } from "react";

import ListenButtons from "@/features/practice/components/listen-buttons";
import SentenceBuilder from "@/features/practice/components/sentence-builder";
import ExerciseSession from "@/features/practice/components/exercise-session";
import { fetchListeningCards } from "@/features/practice/data/practice-cards";
import { usePracticeSession } from "@/features/practice/data/use-practice-session";
import { SENTENCE_LABELS } from "@/features/practice/srs";
import type { CardOutcome } from "@/features/practice/types/card-outcome";
import type { ListeningCard } from "@/features/practice/types/listening-card";
import { SLOW_RATE, useSentenceAudio } from "@/features/practice/use-sentence-audio";
import { buildBank } from "@/features/practice/word-bank";

type ExerciseProps = {
  card: ListeningCard;
  pool: ListeningCard[];
  number: number;
  total: number;
  bottomInset: number;
  onDone: (outcome: CardOutcome) => void;
};

/**
 * One sentence: heard as the card opens, then rebuilt by tapping its words in
 * order — no typing. Each sentence starts with its own audio and a fresh bank.
 */
function ListeningExercise({ card, pool, number, total, bottomInset, onDone }: ExerciseProps) {
  const audio = useSentenceAudio(card.audioUrl);
  const [bank] = useState(() =>
    buildBank(
      card.text,
      card.distractors,
      pool.filter((other) => other.cardId !== card.cardId).map((other) => other.text),
    ),
  );

  // Played once by itself as soon as it can be: the sentence is the question.
  const played = useRef(false);
  const { ready, play } = audio;
  useEffect(() => {
    if (ready && !played.current) {
      played.current = true;
      play();
    }
  }, [ready, play]);

  return (
    <SentenceBuilder
      number={number}
      total={total}
      onSpeak={() => play()}
      speakDisabled={!ready}
      title="Toque no que você ouvir"
      prompt={
        <ListenButtons
          ready={ready}
          playing={audio.playing}
          onPlay={() => play()}
          onPlaySlow={() => play(SLOW_RATE)}
        />
      }
      answer={card.text}
      bank={bank}
      note={card.translation}
      bottomInset={bottomInset}
      onDone={onDone}
    />
  );
}

/**
 * Listening practice, Duolingo's way: hear a sentence, rebuild it from a bank
 * of words. Right, it comes back in a few days; nearly, tomorrow; wrong, later
 * in the same sitting and again today.
 */
export default function ListeningScreen() {
  const session = usePracticeSession(fetchListeningCards);

  return (
    <ExerciseSession
      session={session}
      title="Listening Practice"
      done="todas as frases de hoje"
      upcoming="Novas frases chegam depois das próximas aulas"
      labels={SENTENCE_LABELS}
      practised={(count) => `${count} ${count === 1 ? "frase ouvida" : "frases ouvidas"}`}
      renderCard={(card, context) => <ListeningExercise card={card} pool={session.pool} {...context} />}
    />
  );
}
