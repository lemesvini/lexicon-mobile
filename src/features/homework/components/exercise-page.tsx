import { Text, View, useColorScheme } from "react-native";
import { Lightbulb, MessageSquareQuote } from "lucide-react-native";

import ChooseDescription from "@/features/homework/components/exercises/choose-description";
import FindMistake from "@/features/homework/components/exercises/find-mistake";
import FinishSentence from "@/features/homework/components/exercises/finish-sentence";
import LongAnswer from "@/features/homework/components/exercises/long-answer";
import type { AnswerValue } from "@/features/homework/types/answer-value";
import type { AssignmentSubmission } from "@/features/homework/types/assignment-submission";
import type { ExerciseItem } from "@/features/homework/types/exercise-item";
import BlockView from "@/features/material/components/block-view";
import { colors } from "@/theme/colors";

type Props = {
  item: ExerciseItem;
  answers: Record<string, AnswerValue>;
  onAnswer: (blockId: string, value: AnswerValue) => void;
  /** False once handed in. */
  answering: boolean;
  submission: AssignmentSubmission;
  /** The homework's instructions, over its first page. */
  instructions?: string | null;
};

/** One page of a homework: the question, answerable until it is handed in,
 *  with the teacher's note on it once it is graded. */
export default function ExercisePage({ item, answers, onAnswer, answering, submission, instructions }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  let body;
  if (!item.answerable) {
    body = <BlockView block={item.block} />;
  } else {
    const shared = {
      value: answers[item.id],
      onChange: (value: AnswerValue) => onAnswer(item.id, value),
      disabled: !answering,
      // Released only at grading: until then the student's view keeps it empty.
      correct: item.id in submission.answerKey ? submission.answerKey[item.id]! : null,
    };
    const { block } = item;
    body =
      block.type === "finish-sentence" ? (
        <FinishSentence block={block} {...shared} />
      ) : block.type === "choose-description" ? (
        <ChooseDescription block={block} {...shared} />
      ) : block.type === "find-mistake" ? (
        <FindMistake block={block} {...shared} />
      ) : (
        <LongAnswer block={block} {...shared} />
      );
  }

  const note = item.answerable ? submission.blockNotes[item.id] : undefined;

  return (
    <>
      {instructions ? (
        // The teacher's word on the whole homework, as a tip before it starts.
        <View className="flex-row items-start gap-3 rounded-3xl bg-accent px-4 py-3.5">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-background/60">
            <Lightbulb color={colors[scheme].accentForeground} size={17} strokeWidth={2.25} />
          </View>
          <Text className="flex-1 pt-1 font-sans text-[15px] font-medium leading-relaxed text-accent-foreground">
            {instructions}
          </Text>
        </View>
      ) : null}

      {body}

      {note ? (
        <View className="flex-row gap-2.5 rounded-2xl bg-muted/70 px-4 py-3.5">
          <MessageSquareQuote color={colors[scheme].mutedForeground} size={17} style={{ marginTop: 2 }} />
          <Text className="flex-1 font-sans text-sm leading-relaxed text-foreground">{note}</Text>
        </View>
      ) : null}
    </>
  );
}
