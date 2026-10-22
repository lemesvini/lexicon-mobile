import type { NotificationKind } from "@/features/notifications/types/notification-kind";

/** One notification in the bell's list. */
export type InboxItem = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  /** The app route it opens, e.g. "/assignment/abc". */
  url: string | null;
  createdAt: string;
  unread: boolean;
};
