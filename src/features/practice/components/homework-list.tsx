import { Fragment } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";
import { router } from "expo-router";
import { ChevronRight, MessagesSquare } from "lucide-react-native";

import type { LessonHomework } from "@/features/practice/types/lesson-homework";
import type { LessonHomeworkState } from "@/features/practice/types/lesson-homework-state";
import { formatDay } from "@/features/today/format";
import { haptics } from "@/lib/haptics";
import { colors } from "@/theme/colors";

/** "9,0" — by hand rather than through Intl, as in today/format. */
function formatScore(score: number): string {
  return score.toFixed(1).replace(".", ",");
}

/** "entrega até amanhã", "entrega até qui, 1 out". */
function due(dueOn: string | null): string | null {
  return dueOn ? `entrega até ${formatDay(dueOn).toLowerCase()}` : null;
}

/** The line under the lesson: what the homework is and where it stands. */
function subtitleOf(item: LessonHomework): string {
  const kind =
    item.type === "now-you-can"
      ? "Now you can"
      : `${item.total} ${item.total === 1 ? "questão" : "questões"}`;

  switch (item.status) {
    case "todo":
      return [kind, due(item.dueOn)].filter(Boolean).join(" · ");
    case "in_progress":
      return [`${item.answered} de ${item.total} respondidas`, due(item.dueOn)].filter(Boolean).join(" · ");
    case "submitted":
      return "Enviada · aguardando correção";
    case "graded":
      return [
        item.teacherFirstName ? `Corrigida por ${item.teacherFirstName}` : "Corrigida",
        item.gradedOn ? formatDay(item.gradedOn).toLowerCase() : null,
      ]
        .filter(Boolean)
        .join(" · ");
  }
}

function Pill({ label }: { label: string }) {
  return (
    <View className="rounded-full border-[1.5px] border-primary px-3.5 py-1.5">
      <Text className="font-sans text-sm font-bold text-primary" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function Row({ item }: { item: LessonHomework }) {
  const palette = colors[useColorScheme() === "dark" ? "dark" : "light"];
  const subtitle = subtitleOf(item);

  return (
    <Pressable
      onPress={() => {
        haptics.tap();
        // To the lesson, as from its node on the path: the homework is one of
        // its steps there.
        router.push({ pathname: "/lesson/[lessonId]", params: { lessonId: item.lessonId } });
      }}
      accessibilityRole="button"
      accessibilityLabel={`${item.lessonLabel}: ${subtitle}`}
      className="flex-row items-center gap-4 px-5 py-4 active:opacity-70"
    >
      <View className="size-14 items-center justify-center rounded-2xl bg-secondary">
        {item.lessonNumber !== null ? (
          <Text className="font-display text-xl text-secondary-foreground">{item.lessonNumber}</Text>
        ) : (
          <MessagesSquare color={palette.secondaryForeground} size={22} strokeWidth={2.25} />
        )}
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="font-sans text-lg font-bold text-foreground" numberOfLines={1}>
          {item.lessonLabel}
        </Text>
        <Text className="font-sans text-sm text-muted-foreground" numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
      {item.status === "todo" ? (
        <Pill label="A fazer" />
      ) : item.status === "in_progress" ? (
        <Pill label="Continuar" />
      ) : item.status === "graded" && item.score !== null ? (
        <View className="flex-row items-center gap-2">
          <Text className="font-sans text-2xl font-bold text-foreground">{formatScore(item.score)}</Text>
          <ChevronRight size={20} strokeWidth={2.5} color={palette.mutedForeground} />
        </View>
      ) : (
        <ChevronRight size={20} strokeWidth={2.5} color={palette.mutedForeground} />
      )}
    </Pressable>
  );
}

/** Two rows' worth of placeholder while it loads. */
function Skeleton() {
  return (
    <>
      {[0, 1].map((index) => (
        <Fragment key={index}>
          {index > 0 && <View className="ml-[92px] h-px bg-border" />}
          <View className="flex-row items-center gap-4 px-5 py-4">
            <View className="size-14 rounded-2xl bg-secondary" />
            <View className="flex-1 gap-2">
              <View className="h-5 w-2/5 rounded-md bg-secondary" />
              <View className="h-4 w-3/4 rounded-md bg-secondary" />
            </View>
          </View>
        </Fragment>
      ))}
    </>
  );
}

/**
 * "From your lessons": the homework of the classes had so far — what is still
 * to do and what is waiting on the teacher, or, with nothing pending, the
 * latest grades. A row opens its lesson, as the path does.
 */
export default function HomeworkList({ state }: { state: LessonHomeworkState }) {
  const list = state.status === "ready" ? state.list : null;
  const aside =
    list?.mode === "pending"
      ? list.todo > 0
        ? `${list.todo} a fazer`
        : "Aguardando correção"
      : list?.mode === "graded"
        ? "Últimas notas"
        : null;

  return (
    <View className="w-full gap-3">
      <View className="flex-row items-baseline justify-between px-1">
        <Text className="font-sans text-2xl font-bold text-foreground">From your lessons</Text>
        {aside ? <Text className="font-sans text-sm font-bold text-muted-foreground">{aside}</Text> : null}
      </View>
      <View className="overflow-hidden rounded-3xl border border-border bg-card">
        {state.status === "loading" ? (
          <Skeleton />
        ) : state.status === "error" ? (
          <Text className="px-4 py-6 text-center font-sans text-sm text-muted-foreground">
            Não foi possível carregar suas homeworks.
          </Text>
        ) : state.list.mode === "empty" ? (
          <Text className="px-4 py-6 text-center font-sans text-sm text-muted-foreground">
            Nenhuma homework por enquanto. Elas aparecem aqui depois de cada aula.
          </Text>
        ) : (
          state.list.items.map((item, index) => (
            <Fragment key={item.id}>
              {index > 0 && <View className="ml-[92px] h-px bg-border" />}
              <Row item={item} />
            </Fragment>
          ))
        )}
      </View>
    </View>
  );
}
