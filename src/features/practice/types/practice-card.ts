/** What every practice card has, whatever its skill: a row of
 *  `student_practice_cards`, and where the student stands on it. */
export type PracticeCard = {
  activityId: string;
  activityTitle: string;
  cardId: string;
  lessonId: string | null;
  lessonTitle: string | null;
  /** Its Leitner box, 0–6; null for a card never practised. */
  box: number | null;
  /** "2026-10-22" — when it is due back; null for a card never practised. */
  dueOn: string | null;
};
