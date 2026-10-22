import { Pressable, Text, View, useColorScheme } from "react-native";
import { Plus } from "lucide-react-native";

import { haptics } from "@/lib/haptics";
import { colors } from "@/theme/colors";

type Props = {
  /** How many answers there are, or null while loading. */
  answers: number | null;
  onAdd: () => void;
};

/** The top of My context, in the Today tab's mint: what the page is for, and
 *  the way to add to it. */
export default function ContextHero({ answers, onAdd }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <View className="w-full rounded-3xl bg-accent/70 p-5">
      <View className="flex-row items-center justify-between">
        <Text className="font-sans text-xs font-bold uppercase tracking-widest text-accent-foreground/80">
          A base das suas aulas
        </Text>
        {answers ? (
          <Text className="font-sans text-sm font-semibold text-accent-foreground/80">
            {answers} {answers === 1 ? "resposta" : "respostas"}
          </Text>
        ) : null}
      </View>
      <Text className="mt-3 font-display text-3xl leading-10 text-accent-foreground">
        Suas aulas, do seu jeito
      </Text>
      <Text className="mt-2 font-sans text-base leading-6 text-accent-foreground/75">
        Seu professor usa o que está aqui para escolher os temas, textos e exemplos das aulas.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          haptics.tap();
          onAdd();
        }}
        className="mt-5 h-[50px] flex-row items-center justify-center gap-2 rounded-full bg-primary active:opacity-80"
      >
        <Plus size={20} strokeWidth={2.5} color={colors[scheme].primaryForeground} />
        <Text className="font-sans text-base font-bold text-primary-foreground">
          Adicionar uma nota
        </Text>
      </Pressable>
    </View>
  );
}
