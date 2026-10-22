// The bell's list: `student_notifications` (lexicon-web 0036), already scoped
// to the signed-in student by the view — nothing here filters by who is asking.

import type { InboxItem } from "@/features/notifications/types/inbox-item";
import type { NotificationRecord } from "@/features/notifications/types/notification-record";
import { supabase } from "@/lib/supabase";

const LIMIT = 50;

function itemOf(record: NotificationRecord): InboxItem {
  return {
    id: record.id,
    kind: record.kind,
    title: record.title,
    body: record.body,
    url: record.url,
    createdAt: record.created_at,
    unread: record.read_at === null,
  };
}

export async function fetchInbox(): Promise<InboxItem[]> {
  const { data, error } = await supabase
    .from("student_notifications")
    .select("id, kind, title, body, url, created_at, read_at")
    .order("created_at", { ascending: false })
    .limit(LIMIT);
  if (error) throw new Error(error.message);
  return ((data ?? []) as NotificationRecord[]).map(itemOf);
}

export async function fetchUnreadCount(): Promise<number> {
  const { count, error } = await supabase
    .from("student_notifications")
    .select("id", { count: "exact", head: true })
    .is("read_at", null);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function markAllRead(): Promise<void> {
  const { error } = await supabase.rpc("mark_notifications_read");
  if (error) throw new Error(error.message);
}
