import { useState } from "react";

import ChooseDescription from "@/features/homework/components/exercises/choose-description";
import FindMistake from "@/features/homework/components/exercises/find-mistake";
import FinishSentence from "@/features/homework/components/exercises/finish-sentence";
import LongAnswer from "@/features/homework/components/exercises/long-answer";
import { isExercise } from "@/features/homework/data/assignment";
import type { AnswerValue } from "@/features/homework/types/answer-value";
import type { ExerciseBlock } from "@/features/homework/types/exercise-block";
import BlockView from "@/features/material/components/block-view";
import type { DeckBlock } from "@/features/presentation/types/deck-block";

/** An exercise from the class, to try again: answered on the phone, kept
 *  nowhere, and never marked — the deck comes without its answer keys. */
function DeckExercise({ block }: { block: ExerciseBlock }) {
  const [value, setValue] = useState<AnswerValue | undefined>(undefined);
  const shared = { value, onChange: setValue, disabled: false };

  switch (block.type) {
    case "finish-sentence":
      return <FinishSentence block={block} {...shared} correct={null} />;
    case "choose-description":
      return <ChooseDescription block={block} {...shared} correct={null} />;
    case "find-mistake":
      return <FindMistake block={block} {...shared} correct={null} />;
    case "long-answer":
      return <LongAnswer block={block} {...shared} />;
  }
}

/** Any block of the deck: the material's, or an exercise. */
export default function DeckBlockView({ block }: { block: DeckBlock }) {
  return isExercise(block) ? <DeckExercise block={block} /> : <BlockView block={block} />;
}
