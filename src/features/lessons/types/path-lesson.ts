import type { LessonStep } from "@/features/lessons/types/lesson-step";
import type { LessonType } from "@/features/lessons/types/lesson-type";
import type { PathLessonStatus } from "@/features/lessons/types/path-lesson-status";

/** One node on the path. */
export type PathLesson = {
  id: string;
  type: LessonType;
  status: PathLessonStatus;
  /** What the node shows: 1 for the first lesson of the module, counting
   *  lessons and checkpoints. Null for a conversation, which shows an icon. */
  number: number | null;
  /** The title without its "[Lesson Eight]" prefix. */
  name: string;
  /** "YYYY-MM-DD" from the group's plan, or null off a plan. */
  scheduledOn: string | null;
  /** "HH:MM", or null for a group with no fixed hour. */
  startsAt: string | null;
  /** A lesson behind the group the student missed: the day of the class they
   *  were marked absent from, excused or not, with no class of it since that
   *  they were at. Null otherwise — and always for one still ahead, whose day
   *  to show is when it is planned. */
  missedOn: string | null;
  /** Whether material has been published for it. Every node opens the lesson
   *  page either way; the page says what is there. */
  available: boolean;
  /** Whether it has a "Now you can" homework. Only such a lesson earns the
   *  star once every step is done — a conversation has none. */
  nowYouCan: boolean;
  /** The live class first, then one per homework. */
  steps: LessonStep[];
};
