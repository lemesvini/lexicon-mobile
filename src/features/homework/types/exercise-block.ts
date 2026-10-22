import type { ChooseDescriptionBlock } from "@/features/homework/types/choose-description-block";
import type { FindMistakeBlock } from "@/features/homework/types/find-mistake-block";
import type { FinishSentenceBlock } from "@/features/homework/types/finish-sentence-block";
import type { LongAnswerBlock } from "@/features/homework/types/long-answer-block";

/** A block the student answers rather than reads. Only homework has them. */
export type ExerciseBlock =
  | FinishSentenceBlock
  | ChooseDescriptionBlock
  | FindMistakeBlock
  | LongAnswerBlock;
