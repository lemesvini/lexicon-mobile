// A lesson's material as the student reads it, slide by slide.
//
// From `student_lessons`, which answers only for a lesson whose material is
// published to the student — the same door the web's `fetchStudentLesson` goes
// through, so a lesson that isn't theirs comes back as null.

import type { MaterialBlock } from "@/features/material/types/material-block";
import type { MaterialSlide } from "@/features/material/types/material-slide";
import { supabase } from "@/lib/supabase";

type Document = {
  slides?: { stage?: string; blocks?: MaterialBlock[] }[];
};

/** Teacher-only blocks out, inside containers too: `strip_teacher_content`
 *  (lexicon-web 0004) only looks at a slide's top level. */
export function forStudent(blocks: readonly MaterialBlock[]): MaterialBlock[] {
  return blocks
    .filter((block) => block.audience !== "teacher")
    .map((block) =>
      block.type === "container" ? { ...block, blocks: forStudent(block.blocks ?? []) } : block,
    );
}

export async function fetchMaterial(lessonId: string): Promise<MaterialSlide[] | null> {
  const { data, error } = await supabase
    .from("student_lessons")
    .select("document")
    .eq("id", lessonId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const document = data.document as Document | null;
  // The same names the lesson page lists, so a step opens on what it said.
  return (document?.slides ?? []).map((slide, index) => ({
    stage: slide.stage?.trim() || `Etapa ${index + 1}`,
    blocks: forStudent(Array.isArray(slide.blocks) ? slide.blocks : []),
  }));
}
