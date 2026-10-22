const NUMBERS = [
  "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
  "Eighteen", "Nineteen", "Twenty",
];

/** 2 → "Unit Two", the way the lessons name their units. A report keeps only
 *  the number, since units are a text field on a lesson and not rows. */
export function unitName(unit: number): string {
  return `Unit ${NUMBERS[unit - 1] ?? unit}`;
}
