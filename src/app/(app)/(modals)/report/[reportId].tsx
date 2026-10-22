import { useEffect, useState } from "react";
import { ScrollView, Text, useColorScheme, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";

import { fetchReport } from "@/features/profile/data/progress";
import type { ReportState } from "@/features/profile/types/report-state";
import { unitName } from "@/features/profile/unit-name";
import { colors } from "@/theme/colors";

/** "8.5" → "8,5", "10" → "10". */
function formatScore(score: number): string {
  return String(Math.round(score * 10) / 10).replace(".", ",");
}

/** The teacher's report on one unit: the test score and what happened over it. */
export default function ReportScreen() {
  const { reportId } = useLocalSearchParams<{ reportId: string }>();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const [state, setState] = useState<ReportState>({ status: "loading" });

  useEffect(() => {
    let current = true;
    fetchReport(reportId)
      .then((data) => {
        if (current) setState(data ? { status: "ready", data } : { status: "missing" });
      })
      .catch((error: unknown) => {
        if (current) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : String(error),
          });
        }
      });
    return () => {
      current = false;
    };
  }, [reportId]);

  const report = state.status === "ready" ? state.data : null;

  return (
    <>
      <Stack.Screen options={{ title: report ? unitName(report.unit) : "Relatório" }} />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="xmark"
          onPress={() => router.back()}
          tintColor={colors[scheme].primary}
        />
      </Stack.Toolbar>

      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName="gap-6 p-4">
        {report ? (
          <>
            {report.moduleName ? (
              <Text className="self-start rounded-full bg-accent px-3 py-1 font-sans text-xs font-semibold text-accent-foreground">
                {report.moduleName}
              </Text>
            ) : null}

            {report.testScore !== null && (
              <View className="rounded-3xl bg-accent/70 p-5">
                <Text className="font-sans text-sm font-semibold text-accent-foreground/70">
                  Nota do teste
                </Text>
                <Text className="mt-1 font-display text-5xl text-accent-foreground">
                  {formatScore(report.testScore)}
                  <Text className="font-sans text-xl text-accent-foreground/60"> / 10</Text>
                </Text>
              </View>
            )}

            <View className="gap-2">
              <Text className="px-1 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Observações do professor
              </Text>
              <View className="rounded-2xl bg-card p-4">
                <Text className="font-sans text-base leading-6 text-foreground">
                  {report.observations || "Seu professor não deixou observações nesta unit."}
                </Text>
              </View>
            </View>
          </>
        ) : state.status === "loading" ? (
          <View className="gap-4">
            <View className="h-28 rounded-3xl bg-muted" />
            <View className="h-40 rounded-2xl bg-muted" />
          </View>
        ) : (
          <Text className="py-10 text-center font-sans text-sm text-muted-foreground">
            {state.status === "missing"
              ? "Este relatório não está mais disponível."
              : "Não foi possível carregar o relatório."}
          </Text>
        )}
      </ScrollView>
    </>
  );
}
