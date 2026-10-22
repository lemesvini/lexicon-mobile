import { Text, View, useColorScheme } from "react-native";
import { Hourglass } from "lucide-react-native";

import type { AssignmentSubmission } from "@/features/homework/types/assignment-submission";
import { colors } from "@/theme/colors";

type Props = {
  submission: AssignmentSubmission;
};

/** "8,5", the way a grade is written here. */
function formatScore(score: number): string {
  return score.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

/** The last page, once it is handed in: waiting for the teacher, or the grade
 *  with what they had to say. */
export default function ResultPage({ submission }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  if (submission.status !== "graded") {
    return (
      <View className="items-center gap-3 rounded-3xl border border-border bg-card px-6 py-10">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-accent">
          <Hourglass color={colors[scheme].accentForeground} size={24} />
        </View>
        <Text className="font-display text-2xl text-foreground">Entregue</Text>
        <Text className="text-center font-sans text-base text-muted-foreground">
          Seu teacher ainda vai corrigir. A nota e os comentários aparecem aqui.
        </Text>
      </View>
    );
  }

  // The questions marked automatically; the written ones are the teacher's.
  const marks = Object.values(submission.marks);
  const right = marks.filter(Boolean).length;

  return (
    <View className="gap-4">
      <View className="items-center gap-1 rounded-3xl bg-primary px-6 py-8">
        <Text className="font-sans text-xs font-bold uppercase tracking-widest text-primary-text/80">
          Sua nota
        </Text>
        <Text className="font-display text-[120px] leading-[138px] text-primary-text">
          {submission.score === null ? "—" : formatScore(submission.score)}
        </Text>
        {marks.length > 0 ? (
          <Text className="font-sans text-sm text-primary-text/80">
            {right} de {marks.length} {marks.length === 1 ? "questão certa" : "questões certas"}
          </Text>
        ) : null}
      </View>

      {submission.feedback ? (
        <View className="gap-1.5 rounded-3xl border border-border bg-card px-5 py-4">
          <Text className="font-sans text-xs font-semibold uppercase tracking-[2px] text-primary/80">
            Comentário do teacher
          </Text>
          <Text className="font-sans text-base leading-relaxed text-foreground">{submission.feedback}</Text>
        </View>
      ) : null}
    </View>
  );
}
