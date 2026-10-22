/** One class in the student's group plan, as the Today screen shows it. */
export type PlannedClass = {
  groupId: string;
  lessonId: string;
  /** The lesson's name, without the "[Lesson Eight]" prefix. */
  name: string;
  /** "Lesson Eight", from that prefix, or null when the title has none. */
  label: string | null;
  unit: string;
  position: number;
  /** "YYYY-MM-DD", or null when the group has no meeting days to lay it on. */
  scheduledOn: string | null;
  /** "HH:MM", or null for a group with no fixed hour. */
  startsAt: string | null;
  teacherFirstName: string | null;
  canDo: string | null;
  /** The lesson's grammar points, e.g. ["To Be", "Articles"]. Empty when the
   *  lesson lists none. */
  grammarFocus: string[];
};
