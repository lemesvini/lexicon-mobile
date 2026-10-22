import { useState } from "react";
import { ActivityIndicator, Alert, Text, View, useColorScheme } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ExercisePage from "@/features/homework/components/exercise-page";
import ResultPage from "@/features/homework/components/result-page";
import { isAnswered } from "@/features/homework/data/assignment";
import { useAssignment } from "@/features/homework/data/use-assignment";
import type { ExerciseItem } from "@/features/homework/types/exercise-item";
import SlidePager from "@/features/material/components/slide-pager";
import SlideProgress from "@/features/material/components/slide-progress";
import { haptics } from "@/lib/haptics";
import { colors } from "@/theme/colors";

/** The bottom toolbar, above the home indicator. */
const BOTTOM_TOOLBAR_HEIGHT = 56;

type Page = { kind: "item"; item: ExerciseItem } | { kind: "result" };

/** A page's name over it. */
function titleOf(page: Page): string {
  if (page.kind === "result") return "Resultado";
  const { item } = page;
  if (!item.answerable) return "Leitura";
  return item.block.label?.trim() || `Questão ${item.number}`;
}

/** A homework, a question at a time, like the material's viewer: swiped
 *  through or moved by the bottom buttons, answered as it goes and saved by
 *  itself, handed in from the last question. Once handed in, it reads back,
 *  and ends on how it went. */
export default function AssignmentScreen() {
  const { homeworkId } = useLocalSearchParams<{ homeworkId: string }>();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const insets = useSafeAreaInsets();
  const { state, answers, setAnswer, answering, signal, submit, submitting } =
    useAssignment(homeworkId);
  // Null until the student moves: then it opens on the first question, or —
  // handed in — on the result, the grade and the teacher's comments.
  const [requested, setRequested] = useState<number | null>(null);

  const assignment = state.status === "ready" ? state.assignment : null;
  const items = assignment?.items ?? [];
  // Handed in, it ends on its result.
  const pages: Page[] = [
    ...items.map((item) => ({ kind: "item" as const, item })),
    ...(assignment && !answering ? [{ kind: "result" as const }] : []),
  ];
  const opening = answering ? 0 : pages.length - 1;
  const index = Math.min(Math.max(requested ?? opening, 0), Math.max(pages.length - 1, 0));
  const last = index === pages.length - 1;

  // Progress is answers, not position: walking to the end answering nothing
  // should not look done — the web's rule.
  const questions = items.filter((item) => item.answerable);
  const answered = questions.filter((item) => isAnswered(answers[item.id])).length;
  const blank = questions.length - answered;

  const handIn = () => {
    Alert.alert(
      "Entregar o homework?",
      [
        blank > 0 ? `${blank} ${blank === 1 ? "questão está" : "questões estão"} em branco.` : null,
        "Depois de entregar, as respostas não podem mudar.",
      ]
        .filter(Boolean)
        .join(" "),
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Entregar",
          onPress: () => {
            submit()
              .then(() => {
                haptics.success();
                // To the result, which the reload has just added after the questions.
                setRequested(items.length);
              })
              .catch((error: unknown) => {
                haptics.warning();
                Alert.alert(
                  "Não foi possível entregar",
                  error instanceof Error ? error.message : String(error),
                );
              });
          },
        },
      ],
    );
  };

  const tint = colors[scheme].primary;
  const page = pages[index];

  return (
    <View className="flex-1 bg-background">
      {page ? (
        <Stack.Toolbar placement="bottom">
          <Stack.Toolbar.Button
            onPress={() => {
              haptics.tap();
              setRequested(index - 1);
            }}
            disabled={index === 0}
            tintColor={tint}
          >
            Voltar
          </Stack.Toolbar.Button>
          <Stack.Toolbar.Spacer />
          <Stack.Toolbar.Button
            variant="prominent"
            disabled={submitting}
            onPress={() => {
              // Handing in buzzes again when it lands — success, or a warning.
              haptics.tap();
              if (!last) setRequested(index + 1);
              else if (answering) handIn();
              else router.back();
            }}
            tintColor={tint}
          >
            {!last ? "Seguir" : answering ? "Entregar" : "Concluir"}
          </Stack.Toolbar.Button>
        </Stack.Toolbar>
      ) : null}

      {assignment && page ? (
        <>
          <SlideProgress
            title={titleOf(page)}
            number={index + 1}
            progress={questions.length > 0 ? answered / questions.length : 1}
            progressLabel={`${answered} de ${questions.length} respondidas`}
            // Each save, as a cloud in the ring.
            signal={signal}
          />
          <SlidePager
            pages={pages}
            renderPage={(current, position) =>
              current.kind === "result" ? (
                <ResultPage submission={assignment.submission} />
              ) : (
                <ExercisePage
                  item={current.item}
                  answers={answers}
                  onAnswer={setAnswer}
                  answering={answering}
                  submission={assignment.submission}
                  instructions={position === 0 ? assignment.instructions : null}
                />
              )
            }
            index={index}
            onIndexChange={setRequested}
            bottomInset={insets.bottom + BOTTOM_TOOLBAR_HEIGHT}
          />
        </>
      ) : state.status === "loading" ? (
        <ActivityIndicator className="py-16" />
      ) : (
        <Text className="px-6 py-16 text-center font-sans text-sm text-muted-foreground">
          {state.status === "error"
            ? "Não foi possível carregar o homework. Feche e tente de novo."
            : state.status === "missing"
              ? "Este homework não está disponível para você."
              : "Este homework ainda não tem questões."}
        </Text>
      )}
    </View>
  );
}
