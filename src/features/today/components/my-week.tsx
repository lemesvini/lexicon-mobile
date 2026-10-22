import { Fragment } from "react";
import { Text, useColorScheme, View } from "react-native";
import { Check, type LucideIcon, Pencil, PencilLine, Video } from "lucide-react-native";

import type { PlannedClass } from "@/features/today/types/planned-class";
import type { TodayWeek } from "@/features/today/types/today-week";
import type { WeekHomework } from "@/features/today/types/week-homework";
import { toDateKey } from "@/features/today/data/week";
import { formatRange, formatWhen } from "@/features/today/format";
import { colors } from "@/theme/colors";

type Props = { loading: true } | { loading?: false; week: TodayWeek };

type RowProps = {
  icon: LucideIcon;
  /** Filled tile with a check — the thing is done. */
  done: boolean;
  title: string;
  subtitle: string;
  /** Right-hand pill, e.g. "Agendada". */
  badge?: string;
  /** Right-hand plain text, e.g. "3/9". */
  detail?: string;
};

function Row({ icon: Icon, done, title, subtitle, badge, detail }: RowProps) {
  const palette = colors[useColorScheme() === "dark" ? "dark" : "light"];

  return (
    <View className="flex-row items-center gap-3 px-4 py-3.5">
      <View
        className={`size-12 items-center justify-center rounded-2xl ${done ? "bg-primary" : "bg-secondary"}`}
      >
        {done ? (
          <Check size={22} strokeWidth={2.5} color={palette.primaryForeground} />
        ) : (
          <Icon size={22} color={palette.secondaryForeground} />
        )}
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="font-sans text-base font-semibold text-foreground" numberOfLines={2}>
          {title}
        </Text>
        <Text className="font-sans text-sm text-muted-foreground" numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
      {badge ? (
        <Text className="overflow-hidden rounded-full bg-secondary px-3 py-1 font-sans text-xs font-semibold text-secondary-foreground">
          {badge}
        </Text>
      ) : detail ? (
        <Text className="font-sans text-sm font-semibold text-muted-foreground">{detail}</Text>
      ) : null}
    </View>
  );
}

function classRow(lesson: PlannedClass, todayKey: string): RowProps {
  // By date, like the rest of the screen: a class dated before today happened.
  const past = lesson.scheduledOn !== null && lesson.scheduledOn < todayKey;
  const subtitle = [
    formatWhen(lesson.scheduledOn, lesson.startsAt),
    lesson.teacherFirstName && `com ${lesson.teacherFirstName}`,
  ]
    .filter(Boolean)
    .join(" · ");

  let badge = "Agendada";
  if (past) badge = "Realizada";
  else if (lesson.scheduledOn === todayKey) badge = "Hoje";

  return {
    icon: Video,
    done: past,
    title: lesson.label ? `${lesson.label} · ${lesson.name}` : lesson.name,
    subtitle,
    badge,
  };
}

function homeworkRow(homework: WeekHomework): RowProps {
  const done = homework.status === "submitted" || homework.status === "graded";
  const questions = `${homework.total} ${homework.total === 1 ? "questão" : "questões"}`;

  let detail: string | undefined;
  let badge: string | undefined;
  if (homework.status === "graded") {
    badge = homework.score !== null ? `Nota ${homework.score.toLocaleString("pt-BR")}` : "Corrigida";
  } else if (homework.status === "submitted") {
    badge = "Entregue";
  } else if (homework.total > 0) {
    detail = `${homework.answered}/${homework.total}`;
  }

  return {
    icon: homework.status === "in_progress" ? PencilLine : Pencil,
    done,
    title: homework.title,
    subtitle: [homework.lessonName, homework.total > 0 && questions].filter(Boolean).join(" · "),
    badge,
    detail,
  };
}

export default function MyWeek(props: Props) {
  const header = (
    <View className="flex-row items-baseline justify-between px-1">
      <Text className="font-sans text-xl font-bold text-secondary-foreground">Sua semana</Text>
      {!props.loading && (
        <Text className="font-sans text-sm font-semibold text-muted-foreground">
          {formatRange(props.week.start, props.week.end)}
        </Text>
      )}
    </View>
  );

  if (props.loading) {
    return (
      <View className="w-full gap-3">
        {header}
        <View className="h-40 rounded-3xl bg-popover" />
      </View>
    );
  }

  const todayKey = toDateKey(new Date());
  const rows = [
    ...props.week.classes.map((lesson) => ({
      key: `class:${lesson.groupId}:${lesson.lessonId}`,
      ...classRow(lesson, todayKey),
    })),
    ...props.week.homework.map((homework) => ({
      key: `homework:${homework.id}`,
      ...homeworkRow(homework),
    })),
  ];

  return (
    <View className="w-full gap-3">
      {header}
      <View className="overflow-hidden rounded-3xl bg-popover">
        {rows.length === 0 ? (
          <Text className="px-4 py-6 text-center font-sans text-sm text-muted-foreground">
            Nada agendado para esta semana.
          </Text>
        ) : (
          rows.map(({ key, ...row }, index) => (
            <Fragment key={key}>
              {index > 0 && <View className="ml-[76px] h-px bg-border" />}
              <Row {...row} />
            </Fragment>
          ))
        )}
      </View>
    </View>
  );
}
