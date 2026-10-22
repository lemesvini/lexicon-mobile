/** Where the microphone stands:
 *
 *   idle         ready to listen
 *   listening    the student is speaking
 *   unavailable  no recognizer, or it was refused — the student rates
 *                themselves instead
 */
export type RecognitionStatus = "idle" | "listening" | "unavailable";
