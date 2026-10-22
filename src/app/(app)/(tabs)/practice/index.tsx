import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";

import HomeworkList from "@/features/practice/components/homework-list";
import SkillCard from "@/features/practice/components/skill-card";
import {
  fetchListeningCards,
  fetchReadingCards,
  fetchSpeakingCards,
  fetchWritingCards,
} from "@/features/practice/data/practice-cards";
import { useDueCount } from "@/features/practice/data/use-practice-summary";
import { useLessonHomework } from "@/features/practice/data/use-lesson-homework";
import { READING_SESSION_SIZE } from "@/features/practice/session";
import type { SkillPractice } from "@/features/practice/types/skill-practice";

/** "12 cartões", "1 frase", or "Em dia" when nothing is due. */
function dueLabel(due: number | null, one: string, many: string): string {
  if (due === null) return "";
  if (due === 0) return "Em dia";
  return `${due} ${due === 1 ? one : many}`;
}

export default function PracticeScreen() {
  const speakingDue = useDueCount(fetchSpeakingCards);
  const listeningDue = useDueCount(fetchListeningCards);
  const writingDue = useDueCount(fetchWritingCards);
  const readingDue = useDueCount(fetchReadingCards, READING_SESSION_SIZE);
  const homework = useLessonHomework();

  const practices: SkillPractice[] = [
    { skill: "listening", subtitle: "Ouça e monte a frase", meta: dueLabel(listeningDue, "frase", "frases") },
    { skill: "speaking", subtitle: "Cartões em voz alta", meta: dueLabel(speakingDue, "cartão", "cartões") },
    { skill: "reading", subtitle: "Leia e responda", meta: dueLabel(readingDue, "texto", "textos") },
    { skill: "writing", subtitle: "Traduza para o inglês", meta: dueLabel(writingDue, "frase", "frases") },
  ];
  // Two to a row.
  const rows = [practices.slice(0, 2), practices.slice(2, 4)];

  const open = (practice: SkillPractice) => {
    if (practice.skill === "speaking") return () => router.push("/speaking");
    if (practice.skill === "listening") return () => router.push("/listening");
    if (practice.skill === "writing") return () => router.push("/writing");
    return () => router.push("/reading");
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View className="gap-8 p-4">
        <View className="gap-5">
          {/* <Text className="px-1 font-sans text-lg text-muted-foreground">
            Escolha uma habilidade. Tudo vem das aulas que você já viu.
          </Text> */}
          <View className="gap-4">
            {rows.map((row, index) => (
              <View key={index} className="flex-row gap-4">
                {row.map((practice) => (
                  <SkillCard key={practice.skill} practice={practice} onPress={open(practice)} />
                ))}
              </View>
            ))}
          </View>
        </View>
        <HomeworkList state={homework} />
      </View>
    </ScrollView>
  );
}
