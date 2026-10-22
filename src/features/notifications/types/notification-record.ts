import type { NotificationKind } from "@/features/notifications/types/notification-kind";

/** A row of `student_notifications` (lexicon-web 0036). */
export type NotificationRecord = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  url: string | null;
  created_at: string;
  read_at: string | null;
};
