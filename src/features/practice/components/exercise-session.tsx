import type { ReactNode } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { router } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CaughtUp from "@/features/practice/components/caught-up";
import PracticeButton from "@/features/practice/components/practice-button";
import SessionSummary from "@/features/practice/components/session-summary";
import type { usePracticeSession } from "@/features/practice/data/use-practice-session";
import type { CardOutcome } from "@/features/practice/types/card-outcome";
import type { CardRating } from "@/features/practice/types/card-rating";
import type { PracticeCard } from "@/features/practice/types/practice-card";

type Session<T extends PracticeCard> = ReturnType<typeof usePracticeSession<T>>;

type Props<T extends PracticeCard> = {
  session: Session<T>;
  /** "Listening Practice" — on the caught-up card and the summary. */
  title: string;
  /** What has all been done, when nothing is due: "todas as frases de hoje". */
  done: string;
  /** When more will come: "Novas frases chegam depois das próximas aulas". */
  upcoming: string;
  /** The skill's names for the three ratings, on the summary. */
  labels: Record<CardRating, string>;
  /** What was practised, by count: "8 frases ouvidas". */
  practised: (count: number) => string;
  /** One card's exercise, given its place in the sitting and a way on. */
  renderCard: (
    card: T,
    context: { number: number; total: number; bottomInset: number; onDone: (outcome: CardOutcome) => void },
  ) => ReactNode;
};

/**
 * A sitting, from loading to its summary: the screens of listening, writing
 * and reading, which differ only in the exercise on each card. Each card is
 * keyed by its place in the sitting, so it starts fresh.
 */
export default function ExerciseSession<T extends PracticeCard>({
  session,
  title,
  done,
  upcoming,
  labels,
  practised,
  renderCard,
}: Props<T>) {
  const insets = useSafeAreaInsets();
  const card = session.current;
  const padding = { paddingBottom: insets.bottom + 12 };

  if (session.state.status === "loading") {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  if (session.state.status === "error") {
    return (
      <View style={padding} className="flex-1 justify-center gap-6 bg-background px-6">
        <View className="gap-2">
          <Text className="font-display text-3xl text-secondary-foreground">Não deu para carregar</Text>
          <Text className="font-sans text-lg text-muted-foreground">
            Confira sua conexão e tente de novo daqui a pouco.
          </Text>
        </View>
        <PracticeButton label="Fechar" variant="primary" onPress={() => router.back()} />
      </View>
    );
  }

  if (session.state.status === "empty") {
    return (
      <View style={padding} className="flex-1 bg-background">
        <View className="flex-1 px-5 pt-8">
          <CaughtUp title={title} done={done} upcoming={upcoming} />
        </View>
        <View className="px-5 pt-4">
          <PracticeButton label="Fechar" variant="primary" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  if (session.done || !card) {
    return (
      <View style={padding} className="flex-1 bg-background">
        <View className="flex-1 px-5 pt-8">
          <SessionSummary
            title={title}
            outcomes={session.outcomes}
            failedSaves={session.failedSaves}
            labels={labels}
            practised={practised}
          />
        </View>
        <View className="px-5 pt-4">
          <PracticeButton label="Concluir" variant="primary" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <Animated.View key={session.index} entering={FadeIn.duration(200)} className="flex-1 bg-background">
      {renderCard(card, {
        number: session.index + 1,
        total: session.total,
        bottomInset: insets.bottom,
        onDone: session.answer,
      })}
    </Animated.View>
  );
}
