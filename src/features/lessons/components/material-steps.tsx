import { Pressable, Text, View, useColorScheme } from "react-native";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";

import type { MaterialStep } from "@/features/lessons/types/material-step";
import { haptics } from "@/lib/haptics";
import { colors } from "@/theme/colors";

type Props = {
  lessonId: string;
  steps: MaterialStep[];
};

/** "Check it out": the student's material, one step per slide, in order. A
 *  step opens the viewer on its slide. */
export default function MaterialSteps({ lessonId, steps }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <View className="gap-3">
      <View className="flex-row items-baseline justify-between px-1">
        <Text className="font-sans text-2xl font-bold text-foreground">Check it out</Text>
        {steps.length > 0 ? (
          <Text className="font-sans text-sm font-semibold text-muted-foreground">
            {steps.length} {steps.length === 1 ? "etapa" : "etapas"}
          </Text>
        ) : null}
      </View>

      {steps.length === 0 ? (
        <View className="rounded-3xl border border-border bg-card px-5 py-6">
          <Text className="font-sans text-sm text-muted-foreground">
            O material desta aula ainda não foi publicado.
          </Text>
        </View>
      ) : (
        <View className="overflow-hidden rounded-3xl border border-border bg-card">
          {steps.map((step, index) => (
            // By position: a slide's own id is often blank or repeated.
            <Pressable
              key={index}
              onPress={() => {
                haptics.tap();
                router.push({
                  pathname: "/steps/[lessonId]",
                  params: { lessonId, step: String(index) },
                });
              }}
              accessibilityRole="button"
              accessibilityLabel={`Etapa ${index + 1}: ${step.stage}`}
              className={`flex-row items-center gap-3.5 px-4 py-3.5 active:bg-muted/60 ${index > 0 ? "border-t border-border" : ""}`}
            >
              <View className="h-8 w-8 items-center justify-center rounded-full bg-muted">
                <Text className="font-sans text-sm font-bold text-muted-foreground">{index + 1}</Text>
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="font-sans text-base font-bold text-foreground">{step.stage}</Text>
                {step.goal ? (
                  <Text className="font-sans text-sm text-muted-foreground">{step.goal}</Text>
                ) : null}
              </View>
              <ChevronRight color={colors[scheme].mutedForeground} size={18} />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
