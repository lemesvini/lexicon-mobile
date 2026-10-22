import { Text, View, useColorScheme } from "react-native";
import { BookOpenText, MessageSquareText, PencilLine, Search } from "lucide-react-native";

import type { ExerciseBlock } from "@/features/homework/types/exercise-block";
import { colors } from "@/theme/colors";

const PROMPTS = {
  "finish-sentence": { Icon: PencilLine, text: "Complete a frase" },
  "choose-description": { Icon: BookOpenText, text: "Escolha a descrição certa" },
  "find-mistake": { Icon: Search, text: "Encontre a palavra errada" },
  "long-answer": { Icon: MessageSquareText, text: "Responda com suas palavras" },
} as const;

/** What to do, said plainly over the question: an icon and the instruction,
 *  with the author's own label above it when there is one. */
export default function ExercisePrompt({ block }: { block: ExerciseBlock }) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const { Icon, text } = PROMPTS[block.type];

  return (
    <View className="gap-2">
      {block.label ? (
        <Text className="font-sans text-xs font-semibold uppercase tracking-[2px] text-primary/80">
          {block.label}
        </Text>
      ) : null}
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-accent">
          <Icon color={colors[scheme].accentForeground} size={20} strokeWidth={2.25} />
        </View>
        <Text className="flex-1 font-sans text-xl font-bold text-foreground">{text}</Text>
      </View>
    </View>
  );
}
