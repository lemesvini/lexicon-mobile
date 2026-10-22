import { toDateKey } from "@/features/today/data/week";
import { formatDay } from "@/features/today/format";

/** "agora", "há 5 min", "há 3 h", "ontem", or "Qui, 1 out". */
export function formatAgo(iso: string, now = new Date()): string {
  const then = new Date(iso);
  const minutes = Math.floor((now.getTime() - then.getTime()) / 60_000);

  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  if (toDateKey(then) === toDateKey(now)) return `há ${Math.floor(minutes / 60)} h`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (toDateKey(then) === toDateKey(yesterday)) return "ontem";

  return formatDay(toDateKey(then), now);
}
