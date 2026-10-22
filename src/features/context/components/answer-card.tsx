import { Text, View, useColorScheme } from "react-native";
import { CalendarDays, Heart, type LucideIcon, PenLine, Target } from "lucide-react-native";

import InterestPills from "@/features/context/components/interest-pills";
import { answerKind, interestsOf } from "@/features/context/data/student-context";
import type { AnswerKind } from "@/features/context/types/answer-kind";
import type { ContextAnswer } from "@/features/context/types/context-answer";
import { practiceColors } from "@/theme/colors";

/** How deep the card is: the edge showing under its face, as the Practice
 *  tab's skill cards have it. */
const DEPTH = 5;

/** Each kind of answer in one of the skills' colours, so the page reads as
 *  part of the same app. */
const LOOKS: Record<
  AnswerKind,
  { label: string; icon: LucideIcon; color: "speaking" | "reading" | "listening" | "writing" }
> = {
  motivation: { label: "Seu objetivo", icon: Target, color: "speaking" },
  interests: { label: "Seus interesses", icon: Heart, color: "reading" },
  routine: { label: "Sua rotina", icon: CalendarDays, color: "listening" },
  note: { label: "Sua nota", icon: PenLine, color: "writing" },
};

type Props = {
  entry: ContextAnswer;
  /** On the right of the header: the day a note was added. */
  meta?: string | null;
};

/** One answer of the student's context, as a chunky card. */
export default function AnswerCard({ entry, meta }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const card = practiceColors[scheme].card;
  const kind = answerKind(entry);
  const { label, icon: Icon, color } = LOOKS[kind];
  const look = practiceColors[scheme][color];
  const interests = interestsOf(entry);

  return (
    <View style={{ paddingBottom: DEPTH }}>
      <View
        style={{ backgroundColor: card.edge, top: DEPTH }}
        className="absolute bottom-0 left-0 right-0 rounded-[28px]"
      />
      <View
        style={{ backgroundColor: card.face, borderColor: card.border }}
        className="gap-4 rounded-[28px] border p-5"
      >
        <View className="flex-row items-center gap-3">
          <View
            style={{ backgroundColor: look.tint }}
            className="size-11 items-center justify-center rounded-full"
          >
            <Icon size={21} strokeWidth={2.25} color={look.icon} />
          </View>
          <Text className="flex-1 font-sans text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {label}
          </Text>
          {meta ? (
            <Text className="font-sans text-sm font-bold text-muted-foreground">{meta}</Text>
          ) : null}
        </View>

        {kind === "note" && (
          <Text className="font-display text-2xl leading-8 text-primary">{entry.question}</Text>
        )}

        {interests ? (
          <InterestPills interests={interests} />
        ) : (
          <Text
            selectable
            className={`font-sans text-foreground ${
              kind === "motivation"
                ? "text-xl font-semibold leading-7"
                : "text-[17px] leading-6"
            }`}
          >
            {entry.answer}
          </Text>
        )}
      </View>
    </View>
  );
}
