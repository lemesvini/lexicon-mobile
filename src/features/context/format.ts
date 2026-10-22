const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** "2026-10-01" → "1 out", with the year only when it isn't this one. */
export function formatNoteDate(key: string, today = new Date()): string {
  const [year, month, day] = key.split("-").map(Number);
  const short = `${day} ${MONTHS[month! - 1]}`;
  return year === today.getFullYear() ? short : `${short} ${year}`;
}
