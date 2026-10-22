/** A row of the `student_classes` view (lexicon-web 0029): one class of a group
 *  the student is in. */
export type ClassRecord = {
  class_id: string;
  group_id: string;
  lesson_id: string | null;
  class_date: string;
  /** "HH:MM:SS", or null. Orders two classes on the same day. */
  starts_at: string | null;
  /** Somebody was present: the class happened, for the whole group. */
  held: boolean;
  /** The student's own mark; both null when they weren't marked. */
  present: boolean | null;
  excused: boolean | null;
};
