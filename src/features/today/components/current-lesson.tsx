import { Fragment, useState } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import Svg, { Line } from "react-native-svg";

import StepMarker from "@/features/lessons/components/step-marker";
import { currentStep, stepRows } from "@/features/lessons/step-rows";
import type { LessonProgress } from "@/features/lessons/types/lesson-progress";
import type { StepRow } from "@/features/lessons/types/step-row";
import type { PlannedClass } from "@/features/today/types/planned-class";
import { dayTile, formatList, formatLongDay } from "@/features/today/format";
import { haptics } from "@/lib/haptics";
import { colors } from "@/theme/colors";

type Props =
  | { loading: true }
  | {
      loading?: false;
      lesson: PlannedClass | null;
      progress: LessonProgress | null;
      hasPlan: boolean;
    };

/** StepMarker's size: the line between two steps runs through their middle. */
const MARKER = 30;
/** The space between a marker and the line to the next. */
const LINE_GAP = 14;
/** Between a marker and its label. */
const LABEL_GAP = 10;
const LABEL_HEIGHT = 18;
/** The least the first and last markers sit in from the card's edges. */
const ROW_INSET = 14;
/** Room for a label, wider than any step's name. */
const LABEL_BOX = 160;

function Eyebrow({ label }: { label?: string | null }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="font-sans text-xs font-bold uppercase tracking-widest text-accent-foreground/80">
        Current lesson
      </Text>
      {label ? (
        <Text className="font-sans text-sm font-semibold text-accent-foreground/80">{label}</Text>
      ) : null}
    </View>
  );
}

/** The dark block at the bottom: a calendar tile, then the day in words. */
function When({ lesson }: { lesson: PlannedClass }) {
  const tile = lesson.scheduledOn ? dayTile(lesson.scheduledOn) : null;
  const detail = [lesson.startsAt, lesson.teacherFirstName && `com ${lesson.teacherFirstName}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <View className="mt-6 flex-row items-center gap-4 rounded-2xl bg-primary p-3 pr-5">
      <View className="w-14 items-center rounded-xl bg-primary-foreground/10 py-1.5">
        <Text className="font-sans text-[11px] font-bold tracking-wider text-primary-foreground/70">
          {tile?.weekday ?? "—"}
        </Text>
        <Text className="font-display text-2xl text-primary-foreground">{tile?.day ?? "?"}</Text>
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="font-sans text-base font-bold text-primary-foreground">
          {lesson.scheduledOn ? formatLongDay(lesson.scheduledOn) : "Data a definir"}
        </Text>
        {detail ? (
          <Text className="font-sans text-sm text-primary-foreground/70">{detail}</Text>
        ) : null}
      </View>
    </View>
  );
}

/** Between two steps: solid once the one before is done, dashed until then —
 *  as the line down the lesson page's steps. */
function Connector({ done }: { done: boolean }) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  if (done) return <View className="h-0.5 rounded-full bg-primary" />;
  return (
    <Svg width="100%" height={2}>
      <Line
        x1="0"
        y1="1"
        x2="100%"
        y2="1"
        stroke={colors[scheme].mutedForeground}
        strokeOpacity={0.6}
        strokeWidth={2}
        strokeDasharray="5 4"
      />
    </Svg>
  );
}

/** The lesson's steps across the card, end to end, the one to go on with and
 *  those before it named in full, those after it faded. */
function Steps({ rows, current }: { rows: StepRow[]; current: number }) {
  // The labels' widths, measured: the first and the last stick out past their
  // markers by half the difference, so the row is inset by at least that much
  // to keep them inside the card.
  const [widths, setWidths] = useState<Record<string, number>>({});
  const inset = (key: string) => Math.max(ROW_INSET, ((widths[key] ?? MARKER) - MARKER) / 2);

  return (
    <View
      style={{
        paddingLeft: inset(rows[0]!.key),
        paddingRight: inset(rows[rows.length - 1]!.key),
        paddingBottom: LABEL_GAP + LABEL_HEIGHT,
      }}
      className="mt-5 flex-row items-center"
    >
      {rows.map((row, index) => (
        <Fragment key={row.key}>
          {index > 0 ? (
            <View style={{ marginHorizontal: LINE_GAP }} className="flex-1">
              <Connector done={rows[index - 1]!.marker === "done"} />
            </View>
          ) : null}
          <View style={{ width: MARKER, height: MARKER }}>
            <StepMarker state={row.marker} gold={row.gold} size={MARKER} />
            {/* Centred under the marker, clear of a gold one's ribbons. */}
            <View
              style={{
                position: "absolute",
                top: MARKER + LABEL_GAP,
                left: (MARKER - LABEL_BOX) / 2,
                width: LABEL_BOX,
              }}
              className="items-center"
            >
              <Text
                numberOfLines={1}
                onLayout={(event) => {
                  const width = event.nativeEvent.layout.width;
                  setWidths((known) =>
                    known[row.key] === width ? known : { ...known, [row.key]: width },
                  );
                }}
                style={{ lineHeight: LABEL_HEIGHT }}
                className={`font-sans text-sm font-bold ${
                  current !== -1 && index > current
                    ? "text-accent-foreground/60"
                    : "text-accent-foreground"
                }`}
              >
                {row.label}
              </Text>
            </View>
          </View>
        </Fragment>
      ))}
    </View>
  );
}

export default function CurrentLessonCard(props: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  if (props.loading) {
    return (
      <View className="w-full rounded-3xl bg-accent/70 p-5">
        <Eyebrow />
        <View className="mt-3 h-9 w-4/5 rounded-lg bg-accent-foreground/10" />
        <View className="mt-2 h-9 w-1/2 rounded-lg bg-accent-foreground/10" />
        <View className="mt-3 h-4 w-2/5 rounded-md bg-accent-foreground/10" />
        <View style={{ paddingHorizontal: ROW_INSET }} className="mt-5 flex-row justify-between">
          {[0, 1, 2].map((index) => (
            <View key={index} className="items-center gap-2.5">
              <View
                style={{ width: MARKER, height: MARKER }}
                className="rounded-full bg-accent-foreground/10"
              />
              <View className="h-4 w-14 rounded-md bg-accent-foreground/10" />
            </View>
          ))}
        </View>
        <View className="mt-5 h-[50px] rounded-full bg-accent-foreground/10" />
      </View>
    );
  }

  const { lesson, progress, hasPlan } = props;

  if (!lesson) {
    return (
      <View className="w-full rounded-3xl bg-accent/70 p-5">
        <Eyebrow />
        <Text className="mt-4 font-display text-3xl text-accent-foreground">
          {hasPlan ? "Plano concluído" : "Nenhuma aula agendada"}
        </Text>
        <Text className="mt-2 font-sans text-base text-accent-foreground/70">
          {hasPlan
            ? "Você passou por todas as aulas do plano da sua turma."
            : "Quando seu professor montar o plano da turma, sua próxima aula aparece aqui."}
        </Text>
      </View>
    );
  }

  const headline = lesson.name;
  const subtitle = [
    lesson.grammarFocus.length > 0 ? `Usando ${formatList(lesson.grammarFocus)}` : null,
    lesson.unit,
  ]
    .filter(Boolean)
    .join(" · ");
  const rows = progress
    ? stepRows(progress.liveClass, lesson.teacherFirstName, progress.homework)
    : [];
  const current = currentStep(rows);
  const action =
    current === -1 ? "Ver aula" : `Continuar · etapa ${current + 1} de ${rows.length}`;

  return (
    <View className="w-full rounded-3xl bg-accent/70 p-5">
      <Eyebrow label={lesson.label} />
      <Text className="mt-3 font-display text-[34px] leading-[40px] text-accent-foreground">
        {headline}
      </Text>
      {subtitle ? (
        <Text className="mt-2 font-sans text-base text-accent-foreground/70">{subtitle}</Text>
      ) : null}
      {rows.length > 0 ? <Steps rows={rows} current={current} /> : null}
      <Pressable
        onPress={() => {
          haptics.tap();
          router.push({ pathname: "/lesson/[lessonId]", params: { lessonId: lesson.lessonId } });
        }}
        accessibilityRole="button"
        accessibilityLabel={`${action}: ${headline}`}
        className="mt-5 flex-row items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 active:opacity-80"
      >
        <Text className="font-sans text-[17px] font-bold text-primary-foreground">{action}</Text>
        <ChevronRight color={colors[scheme].primaryForeground} size={20} strokeWidth={2.5} />
      </Pressable>
      {/* <When lesson={lesson} /> */}
    </View>
  );
}
