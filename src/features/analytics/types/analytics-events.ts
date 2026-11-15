import type { Skill } from "@/features/practice/types/skill";
import type { NotificationKind } from "@/features/notifications/types/notification-kind";

/**
 * Every custom event the app sends to PostHog, with its properties. Adding one
 * here is the only way `track` accepts it, so names stay consistent.
 */
export type AnalyticsEvents = {
  /** "Concluir" on the last step of a lesson's material. */
  lesson_material_completed: { lesson_id: string; steps: number };
  /** A practice sitting played to its summary. Counts are per card, by its
   *  last outcome in the sitting. */
  practice_completed: {
    skill: Skill;
    cards: number;
    remembered: number;
    almost: number;
    forgot: number;
    duration_seconds: number;
  };
  /** A practice sitting closed before its summary. */
  practice_abandoned: {
    skill: Skill;
    /** Cards answered before leaving. */
    answered: number;
    cards_total: number;
    duration_seconds: number;
  };
  /** A homework handed in. */
  homework_submitted: { homework_id: string };
  /** A notification tapped, the daily practice reminder or one from the server. */
  notification_opened: { kind: "daily_practice" | NotificationKind | "other"; url: string | null };
};
