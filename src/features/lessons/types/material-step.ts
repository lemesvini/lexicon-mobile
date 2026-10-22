/** One slide of the student's material, as a step of the lesson to go
 *  through. */
export type MaterialStep = {
  /** The slide's stage: "Vocabulary", "Modal Verbs". */
  stage: string;
  /** What the slide is for, when the author wrote one. */
  goal: string | null;
};
