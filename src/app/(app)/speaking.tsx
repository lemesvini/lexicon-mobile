import { useState } from "react";
import { ActivityIndicator, Text, View, useColorScheme } from "react-native";
import { router } from "expo-router";
import { Eye } from "lucide-react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CardStack from "@/features/practice/components/card-stack";
import CaughtUp from "@/features/practice/components/caught-up";
import FlashCard from "@/features/practice/components/flash-card";
import MicButton from "@/features/practice/components/mic-button";
import PracticeButton from "@/features/practice/components/practice-button";
import PracticeHeader from "@/features/practice/components/practice-header";
import RatingButtons from "@/features/practice/components/rating-buttons";
import SessionSummary from "@/features/practice/components/session-summary";
import { fetchSpeakingCards } from "@/features/practice/data/practice-cards";
import { usePracticeSession } from "@/features/practice/data/use-practice-session";
import { matchAnswer, ratingFor } from "@/features/practice/match";
import { RATING_LABELS } from "@/features/practice/srs";
import type { CardRating } from "@/features/practice/types/card-rating";
import type { CardResult } from "@/features/practice/types/card-result";
import { useRecognition } from "@/features/practice/use-recognition";
import { haptics } from "@/lib/haptics";
import { colors, practiceColors } from "@/theme/colors";

const RANK: Record<CardRating, number> = { forgot: 0, almost: 1, remembered: 2 };

/** A centred message with a way out, for a sitting that can't start. */
function Notice({ title, body }: { title: string; body: string }) {
  return (
    <View className="flex-1 justify-center gap-6 px-6">
      <View className="gap-2">
        <Text className="font-display text-3xl text-secondary-foreground">{title}</Text>
        <Text className="font-sans text-lg text-muted-foreground">{body}</Text>
      </View>
      <PracticeButton label="Fechar" variant="primary" onPress={() => router.back()} />
    </View>
  );
}

/**
 * Speaking practice: a deck of "como se diz" cards. The student reads the
 * Portuguese, says it in English, and the device listens — how much of the
 * answer it heard decides whether they remembered it, almost did, or didn't,
 * and that decides when the card comes back.
 *
 * Where the device can't listen (no recognizer, or the microphone refused), the
 * card turns over on a tap and the student rates themselves.
 */
export default function SpeakingScreen() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const palette = colors[scheme];
  const insets = useSafeAreaInsets();
  const session = usePracticeSession(fetchSpeakingCards);
  const card = session.current;

  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState<CardResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const recognition = useRecognition({
    onHeard: (alternatives) => {
      if (!card) return;
      const match = matchAnswer(card.answer, alternatives);
      let rating = ratingFor(match.score);
      // Said again with the answer in view: practice for the mouth, but it can
      // only lift a miss as far as "almost" — never past the first go.
      if (result) {
        const capped = RANK[rating] > RANK.almost ? "almost" : rating;
        rating = RANK[capped] > RANK[result.rating] ? capped : result.rating;
      }
      if (rating === "remembered") haptics.success();
      else haptics.tap();
      setResult({ rating, score: match.score, words: match.words, heard: match.heard });
      setNotice(null);
      setFlipped(true);
    },
    onNothing: () => setNotice("Não ouvi nada. Toque no microfone e fale de novo."),
  });

  const selfRating = recognition.status === "unavailable";
  const listening = recognition.status === "listening";

  const next = (final: CardResult) => {
    session.answer(final);
    setFlipped(false);
    setResult(null);
    setNotice(null);
  };

  if (session.state.status === "loading") {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  const padding = { paddingBottom: insets.bottom + 12 };

  if (session.state.status === "error") {
    return (
      <View style={padding} className="flex-1 bg-background">
        <Notice title="Não deu para carregar" body="Confira sua conexão e tente de novo daqui a pouco." />
      </View>
    );
  }

  if (session.state.status === "empty") {
    return (
      <View style={padding} className="flex-1 bg-background">
        <View className="flex-1 px-5 pt-8">
          <CaughtUp />
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
            title="Speaking Practice"
            outcomes={session.outcomes}
            failedSaves={session.failedSaves}
            labels={RATING_LABELS}
            practised={(count) => `${count} ${count === 1 ? "cartão" : "cartões"} em voz alta`}
          />
        </View>
        <View className="px-5 pt-4">
          <PracticeButton label="Concluir" variant="primary" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  const look = result ? practiceColors[scheme][result.rating] : null;

  return (
    <View style={padding} className="flex-1 bg-background">
      <PracticeHeader number={session.index + 1} total={session.total} />

      <View className="flex-1 px-5 pt-2">
        <CardStack>
          <Animated.View key={session.index} entering={FadeIn.duration(220)} className="flex-1">
            <FlashCard
              card={card}
              flipped={flipped}
              result={result}
              hint={selfRating ? "Diga em voz alta e vire o cartão" : "Toque no microfone e diga em inglês"}
            />
          </Animated.View>
        </CardStack>
      </View>

      <View className="gap-3 px-5 pt-4">
        {listening && recognition.partial ? (
          <Text numberOfLines={2} className="text-center font-sans text-base italic text-muted-foreground">
            “{recognition.partial}”
          </Text>
        ) : notice ? (
          <Text className="text-center font-sans text-base text-muted-foreground">{notice}</Text>
        ) : result && look ? (
          <Text
            style={{ color: look.text, backgroundColor: look.background }}
            className="self-center overflow-hidden rounded-full px-4 py-1.5 font-sans text-base font-bold"
          >
            {RATING_LABELS[result.rating]}
          </Text>
        ) : null}

        {!flipped ? (
          selfRating ? (
            <PracticeButton label="Virar cartão" haptic="select" onPress={() => setFlipped(true)} />
          ) : (
            <View className="flex-row gap-3">
              {/* Giving up turns the card over as not remembered. Out of the
                  way while listening, so the microphone has the whole row. */}
              {!listening ? (
                <PracticeButton
                  label="Não sei"
                  icon={<Eye color={palette.foreground} size={20} strokeWidth={2.25} />}
                  haptic="select"
                  onPress={() => {
                    setResult({ rating: "forgot", score: null, words: null, heard: null });
                    setFlipped(true);
                  }}
                />
              ) : null}
              <View className="flex-1">
                <MicButton
                  listening={listening}
                  onPress={() => {
                    haptics.tap();
                    if (listening) recognition.stop();
                    else void recognition.start();
                  }}
                />
              </View>
            </View>
          )
        ) : selfRating && !result ? (
          <RatingButtons
            onRate={(rating) => next({ rating, score: null, words: null, heard: null })}
          />
        ) : result ? (
          <View className="flex-row gap-3">
            {!selfRating ? (
              <PracticeButton
                label={listening ? "Ouvindo…" : "Falar de novo"}
                grow
                onPress={() => {
                  if (listening) recognition.stop();
                  else void recognition.start();
                }}
              />
            ) : null}
            <PracticeButton
              label="Próximo"
              variant="primary"
              grow
              disabled={listening}
              onPress={() => next(result)}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}
