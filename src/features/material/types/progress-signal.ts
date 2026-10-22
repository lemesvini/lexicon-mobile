/** A save that has just happened, or failed, for the progress ring to show. A
 *  new object for every one, so two saves in a row signal twice. */
export type ProgressSignal = { kind: "saved" | "error"; key: number };
