/** The lesson's live class, from where the student stands. */
export type LiveClass =
  /** They were there. `day` is the class they were at. */
  | { status: "attended"; day: string }
  /** Marked absent, excused or not, and at no class of it since. */
  | { status: "missed"; day: string }
  /** It happened, and they weren't marked either way. */
  | { status: "taught"; day: string }
  /** It hasn't happened; the plan has a day for it. */
  | { status: "scheduled"; day: string; startsAt: string | null }
  /** It hasn't happened, and there is no day for it yet. */
  | { status: "unscheduled" };
