import { RefreshControl, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";

import AnswerCard from "@/features/context/components/answer-card";
import ContextHero from "@/features/context/components/context-hero";
import { useMyContext } from "@/features/context/data/use-my-context";
import { formatNoteDate } from "@/features/context/format";

function SectionHeader({ title, detail }: { title: string; detail?: string | null }) {
  return (
    <View className="mt-4 flex-row items-baseline justify-between px-1">
      <Text className="font-sans text-xl font-bold text-secondary-foreground">{title}</Text>
      {detail ? (
        <Text className="font-sans text-sm font-semibold text-muted-foreground">{detail}</Text>
      ) : null}
    </View>
  );
}

/**
 * What the school builds the student's classes around, in their own words: the
 * answers they gave at onboarding, and any note they added since.
 *
 * Add-only, as on the web: what is here was true when it was said, so a change
 * of circumstances is a new dated note, not an answer swapped for another.
 */
export default function MyContextScreen() {
  const { state, refreshing, refresh } = useMyContext();

  const blocks = state.status === "ready" ? state.data : [];
  const answers = blocks.reduce((count, block) => count + block.answers.length, 0);
  const onboarding = blocks.filter((block) => !block.isNote);
  // Newest first: the latest thing said is the one most likely to matter now.
  const notes = blocks.filter((block) => block.isNote).reverse();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="gap-3 p-4 pb-10"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    >
      <ContextHero
        answers={state.status === "ready" ? answers : null}
        onAdd={() => router.push("/context-note")}
      />

      {state.status === "loading" ? (
        <>
          <View className="mt-4 h-6 w-2/5 rounded-md bg-muted" />
          {[0, 1, 2].map((index) => (
            <View key={index} className="h-32 rounded-[28px] bg-muted" />
          ))}
        </>
      ) : state.status === "error" ? (
        <Text className="py-10 text-center font-sans text-sm text-muted-foreground">
          Não foi possível carregar seu contexto. Puxe para tentar de novo.
        </Text>
      ) : blocks.length === 0 ? (
        <View className="mt-2 rounded-[28px] border-2 border-dashed border-border p-6">
          <Text className="text-center font-sans text-base leading-6 text-muted-foreground">
            Suas respostas do onboarding aparecem aqui assim que seu professor as registrar.
          </Text>
        </View>
      ) : (
        <>
          {notes.length > 0 && (
            <>
              <SectionHeader title="Suas notas" />
              {notes.flatMap((block, i) =>
                block.answers.map((entry, j) => (
                  <AnswerCard
                    key={`note-${i}-${j}`}
                    entry={entry}
                    meta={block.date && formatNoteDate(block.date)}
                  />
                )),
              )}
            </>
          )}

          {onboarding.map((block, i) => (
            <View key={`onboarding-${i}`} className="gap-3">
              <SectionHeader
                title="Do seu onboarding"
                detail={block.date && formatNoteDate(block.date)}
              />
              {block.answers.map((entry, j) => (
                <AnswerCard key={j} entry={entry} />
              ))}
            </View>
          ))}

          <Text className="mt-3 px-6 text-center font-sans text-sm leading-5 text-muted-foreground">
            Algo mudou? Adicione uma nota — o que já está aqui fica com a data em que foi dito.
          </Text>
        </>
      )}
    </ScrollView>
  );
}
