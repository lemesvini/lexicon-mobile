export type PracticeSessionState<T> =
  | { status: "loading" }
  /** The cards for this sitting, in the order they come. */
  | { status: "ready"; cards: T[] }
  /** Nothing due and nothing new. */
  | { status: "empty" }
  | { status: "error"; message: string };
