import type { InboxItem } from "@/features/notifications/types/inbox-item";

export type InboxState =
  | { status: "loading" }
  | { status: "ready"; items: InboxItem[] }
  | { status: "error"; message: string };
