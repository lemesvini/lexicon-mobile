// Whether the student wants the reminder an hour before class. Kept on the
// server (lexicon-web 0036), because that is where the reminder is sent from.

import { supabase } from "@/lib/supabase";

export async function fetchClassReminders(): Promise<boolean> {
  const { data, error } = await supabase
    .from("student_notification_preferences")
    .select("class_reminders")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as { class_reminders: boolean } | null)?.class_reminders ?? true;
}

export async function saveClassReminders(enabled: boolean): Promise<void> {
  const { error } = await supabase.rpc("set_class_reminders", { p_enabled: enabled });
  if (error) throw new Error(error.message);
}
