/** One segment of a lesson's ring: the live class, or one of its homeworks. */
export type LessonStep = {
  kind: "class" | "homework";
  /** The class: it happened and the student was there. A homework: handed in
   *  or graded. */
  done: boolean;
};
