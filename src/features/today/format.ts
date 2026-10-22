import { fromDateKey, toDateKey } from "@/features/today/data/week";

// By hand rather than through Intl: pt-BR's short forms come out as
// "qui., 1 de out." on Hermes, and this is meant to read "Qui, 1 out".
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** "Hoje", "Amanhã", or "Qui, 1 out". */
export function formatDay(key: string, today = new Date()): string {
  const todayKey = toDateKey(today);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (key === todayKey) return "Hoje";
  if (key === toDateKey(tomorrow)) return "Amanhã";

  const date = fromDateKey(key);
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

/** The day inside a sentence: "hoje", "amanhã", "na qui, 1 out" — or "no sáb",
 *  "no dom", the two days that are masculine. */
export function formatOnDay(key: string, today = new Date()): string {
  const short = formatDay(key, today);
  if (short === "Hoje" || short === "Amanhã") return short.toLowerCase();
  const weekday = fromDateKey(key).getDay();
  return `${weekday === 0 || weekday === 6 ? "no" : "na"} ${short.toLowerCase()}`;
}

const LONG_WEEKDAYS =["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const LONG_MONTHS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** The pieces of a calendar tile: "TER" and "6". */
export function dayTile(key: string): { weekday: string; day: string } {
  const date = fromDateKey(key);
  return { weekday: WEEKDAYS[date.getDay()]!.toUpperCase(), day: String(date.getDate()) };
}

/** "Hoje", "Amanhã", or "Terça, 6 de outubro". */
export function formatLongDay(key: string, today = new Date()): string {
  const short = formatDay(key, today);
  if (short === "Hoje" || short === "Amanhã") return short;
  const date = fromDateKey(key);
  return `${LONG_WEEKDAYS[date.getDay()]}, ${date.getDate()} de ${LONG_MONTHS[date.getMonth()]}`;
}

/** "can", "can e could", "can, could e would". */
export function formatList(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

/** "28 set – 4 out". */
export function formatRange(start: string, end: string): string {
  const a = fromDateKey(start);
  const b = fromDateKey(end);
  return `${a.getDate()} ${MONTHS[a.getMonth()]} – ${b.getDate()} ${MONTHS[b.getMonth()]}`;
}

/** "Qui, 1 out · 19:00", with whatever parts are known. */
export function formatWhen(scheduledOn: string | null, startsAt: string | null): string {
  return [scheduledOn ? formatDay(scheduledOn) : "Data a definir", startsAt]
    .filter(Boolean)
    .join(" · ");
}
