import { Pressable, Text, useColorScheme, View } from "react-native";
import { router } from "expo-router";
import { ChevronRight, FileText } from "lucide-react-native";

import type { Progress } from "@/features/profile/types/progress";
import { unitName } from "@/features/profile/unit-name";
import { colors } from "@/theme/colors";

/** The attendance the school asks of a student, marked on the bar. */
const MIN_ATTENDANCE = 75;

type Props = { loading: true } | { loading?: false; progress: Progress };

function AttendanceBar({ percent }: { percent: number | null }) {
  return (
    <View>
      <View className="h-2.5 justify-center">
        <View className="h-2.5 overflow-hidden rounded-full bg-border">
          <View className="h-full rounded-full bg-primary" style={{ width: `${percent ?? 0}%` }} />
        </View>
        <View
          className="absolute h-5 w-0.5 rounded-full bg-foreground"
          style={{ left: `${MIN_ATTENDANCE}%` }}
        />
      </View>
      <View className="h-6">
        <Text
          className="absolute top-1.5 w-16 text-center font-sans text-xs font-semibold text-muted-foreground"
          style={{ left: `${MIN_ATTENDANCE}%`, transform: [{ translateX: -32 }] }}
        >
          mín. {MIN_ATTENDANCE}%
        </Text>
      </View>
    </View>
  );
}

function CheckpointBar({ done, total }: { done: number; total: number }) {
  return (
    <View className="flex-row gap-1.5">
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          className={`h-2.5 flex-1 rounded-full ${index < done ? "bg-primary" : "bg-border"}`}
        />
      ))}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="mb-2.5 flex-row items-baseline justify-between gap-3">
      <Text className="font-sans text-base font-semibold text-foreground">{label}</Text>
      <Text className="font-sans text-sm text-muted-foreground">{value}</Text>
    </View>
  );
}

/** The Me tab's record of the module: attendance against the minimum, the
 *  checkpoints passed, and the teacher's report on each unit. */
export default function ProgressCard(props: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const palette = colors[scheme];

  if (props.loading) {
    return (
      <View className="gap-5 rounded-3xl border border-border bg-card p-5">
        <View className="h-6 w-2/5 rounded-md bg-muted" />
        <View className="h-12 rounded-md bg-muted" />
        <View className="h-12 rounded-md bg-muted" />
      </View>
    );
  }

  const { moduleName, attended, checkpoints, reports } = props.progress;
  const percent = attended.marked === 0 ? null : (attended.present / attended.marked) * 100;

  return (
    <View className="rounded-3xl border border-border bg-card p-5">
      <Text className="mb-5 font-sans text-xl font-bold text-foreground">
        {moduleName ?? "Seu curso"}
      </Text>

      <Row
        label="Presença"
        value={
          percent === null
            ? "Nenhuma aula registrada"
            : `${attended.present} de ${attended.marked} aulas · ${Math.round(percent)}%`
        }
      />
      <AttendanceBar percent={percent} />

      <View className="mt-3">
        <Row
          label="Checkpoints"
          value={
            checkpoints.total === 0
              ? "Nenhum no plano"
              : `${checkpoints.done} de ${checkpoints.total}`
          }
        />
        {checkpoints.total > 0 && (
          <CheckpointBar done={checkpoints.done} total={checkpoints.total} />
        )}
      </View>

      <View className="my-4 h-px bg-border" />

      {reports.length === 0 ? (
        <Text className="font-sans text-sm text-muted-foreground">
          O relatório de cada unit aparece aqui quando seu professor escrever.
        </Text>
      ) : (
        reports.map((report) => (
          <Pressable
            key={report.id}
            accessibilityRole="button"
            onPress={() =>
              router.push({ pathname: "/report/[reportId]", params: { reportId: report.id } })
            }
            // The settings rows' size: the same tile, body text and chevron.
            className="-mx-2 min-h-[52px] flex-row items-center gap-3.5 rounded-xl px-2 py-2.5 active:bg-muted"
          >
            <View className="size-[30px] items-center justify-center rounded-[8px] bg-primary">
              <FileText size={18} strokeWidth={2.25} color={palette.primaryForeground} />
            </View>
            <Text className="flex-1 font-sans text-[17px] text-foreground">
              Relatório da {unitName(report.unit)}
            </Text>
            <ChevronRight size={20} strokeWidth={2.25} color={palette.mutedForeground} />
          </Pressable>
        ))
      )}
    </View>
  );
}
