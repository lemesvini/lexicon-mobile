/** "[Lesson Eight] Polite Requests" → label "Lesson Eight", name "Polite Requests".
 *
 *  Only for display. What kind of class a lesson is comes from its
 *  `lesson_type` column, never from the label. */
export function splitTitle(title: string): { label: string | null; name: string } {
  const match = /^\[([^\]]*)\]\s*(.*)$/.exec(title.trim());
  if (!match) return { label: null, name: title.trim() };
  return {
    label: match[1]!.trim() || null,
    name: match[2]!.trim() || match[1]!.trim(),
  };
}
