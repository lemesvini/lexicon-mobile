/** A row of the `student_lessons` view, with only what the lesson page reads
 *  of the material: its can-do and its slides' names. The view answers only for
 *  a lesson whose material is published to the student. */
export type MaterialRecord = {
  id: string;
  document: {
    minorCanDo?: string;
    slides?: { stage?: string; goal?: string }[];
  } | null;
};
