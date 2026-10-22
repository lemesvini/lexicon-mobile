import type { CalloutBlock } from "@/features/material/types/callout-block";
import type { CanDoBlock } from "@/features/material/types/can-do-block";
import type { ContainerBlock } from "@/features/material/types/container-block";
import type { DialogBlock } from "@/features/material/types/dialog-block";
import type { EmailBlock } from "@/features/material/types/email-block";
import type { EmbedBlock } from "@/features/material/types/embed-block";
import type { ImageBlock } from "@/features/material/types/image-block";
import type { ListBlock } from "@/features/material/types/list-block";
import type { PostBlock } from "@/features/material/types/post-block";
import type { TableBlock } from "@/features/material/types/table-block";
import type { TextBlock } from "@/features/material/types/text-block";
import type { TitleBlock } from "@/features/material/types/title-block";
import type { UnsupportedBlock } from "@/features/material/types/unsupported-block";

/** Any block of a student's material — lexicon-web's `LessonBlock`, without
 *  the exercises, which only homework has. */
export type MaterialBlock =
  | ContainerBlock
  | TextBlock
  | ListBlock
  | CalloutBlock
  | TableBlock
  | DialogBlock
  | EmailBlock
  | PostBlock
  | ImageBlock
  | EmbedBlock
  | TitleBlock
  | CanDoBlock
  | UnsupportedBlock;
