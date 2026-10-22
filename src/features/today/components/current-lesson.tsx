import { Text, View } from "react-native";

import type { PlannedClass } from "@/features/today/types/planned-class";
import { dayTile, formatLongDay, formatWhen } from "@/features/today/format";

type Props =
  | { loading: true }
  | { loading?: false; lesson: PlannedClass | null; hasPlan: boolean };

function Eyebrow({ label }: { label?: string | null }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="font-sans text-xs font-bold uppercase tracking-widest text-accent-foreground/80">
        Sua próxima aula
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

export default function CurrentLessonCard(props: Props) {
  if (props.loading) {
    return (
      <View className="w-full rounded-3xl bg-accent p-5">
        <Eyebrow />
        <View className="mt-4 h-9 w-4/5 rounded-lg bg-accent-foreground/10" />
        <View className="mt-2 h-9 w-1/2 rounded-lg bg-accent-foreground/10" />
        <View className="mt-3 h-4 w-2/5 rounded-md bg-accent-foreground/10" />
        <View className="mt-6 h-[72px] rounded-2xl bg-accent-foreground/10" />
      </View>
    );
  }

  const { lesson, hasPlan } = props;

  if (!lesson) {
    return (
      <View className="w-full rounded-3xl bg-accent p-5">
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
  const subtitle = [lesson.unit, ...lesson.grammarFocus].filter(Boolean).join(" · ");

  return (
    <View className="w-full rounded-3xl bg-accent/70 p-5">
      <Eyebrow label={formatWhen(lesson.scheduledOn, lesson.startsAt)} />
      <Text className="mt-4 font-display text-[34px] leading-[40px] text-accent-foreground">
        {headline}
      </Text>
      {subtitle ? (
        <Text className="mt-2 font-sans text-base text-accent-foreground/70">{subtitle}</Text>
      ) : null}
      {/* <When lesson={lesson} /> */}
    </View>
  );
}
