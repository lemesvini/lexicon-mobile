// The class's deck, as the student's group saw it — the web's
// `fetchStudentPresentation` (lexicon-web/src/lib/student-content.ts).
//
// From `student_presentations` (lexicon-web 0018): the group's own copy of the
// lesson when it has one, else the shared lesson, with the teacher's notes and
// the answer keys already stripped. It answers only for a lesson the student
// can open, so a lesson that isn't theirs comes back as null.

import { isExercise } from "@/features/homework/data/assignment";
import { forStudent } from "@/features/material/data/material";
import type { DeckBlock } from "@/features/presentation/types/deck-block";
import type { DeckSlide } from "@/features/presentation/types/deck-slide";
import { supabase } from "@/lib/supabase";

type Document = {
  slides?: { stage?: string; blocks?: DeckBlock[] }[];
};

/** Teacher-only blocks out, inside containers too — the view's stripping looks
 *  only at a slide's top level; the web's `audience="student"` does the rest. */
function studentBlocks(blocks: readonly DeckBlock[]): DeckBlock[] {
  return blocks
    .filter((block) => block.audience !== "teacher")
    .map((block) =>
      !isExercise(block) && block.type === "container"
        ? { ...block, blocks: forStudent(block.blocks ?? []) }
        : block,
    );
}

export async function fetchPresentation(lessonId: string): Promise<DeckSlide[] | null> {
  const { data, error } = await supabase
    .from("student_presentations")
    .select("document")
    .eq("id", lessonId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const document = data.document as Document | null;
  return (
    (document?.slides ?? [])
      .map((slide, index) => ({
        stage: slide.stage?.trim() || `Slide ${index + 1}`,
        blocks: studentBlocks(Array.isArray(slide.blocks) ? slide.blocks : []),
      }))
      // As on the web: an empty slide is an authoring artefact, and a blank one
      // in the middle of the deck reads as a bug.
      .filter((slide) => slide.blocks.length > 0)
  );
}
