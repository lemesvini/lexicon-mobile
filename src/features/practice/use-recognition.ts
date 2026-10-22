import { useCallback, useEffect, useRef, useState } from "react";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

import type { RecognitionStatus } from "@/features/practice/types/recognition-status";

type Handlers = {
  /** What was heard: the recognizer's guesses, likeliest first. */
  onHeard: (alternatives: string[]) => void;
  /** It listened and heard nothing. */
  onNothing: () => void;
};

/** Errors that mean "this device won't do it", not "try again". */
const UNAVAILABLE = new Set(["not-allowed", "service-not-allowed", "language-not-supported"]);

/**
 * The microphone, for one card at a time: listen, then hand over what was
 * heard. English (US), on the device's own recognizer — no audio is kept.
 *
 * If the device can't recognize speech, or the student refuses the microphone,
 * the status turns `unavailable` and stays so: the screen falls back to the
 * student rating themselves rather than asking again on every card.
 */
export function useRecognition({ onHeard, onNothing }: Handlers) {
  const [status, setStatus] = useState<RecognitionStatus>(() =>
    ExpoSpeechRecognitionModule.isRecognitionAvailable() ? "idle" : "unavailable",
  );
  /** What it is hearing so far, while the student speaks. */
  const [partial, setPartial] = useState("");

  // The latest guesses and whether they were handed over, where the events —
  // which arrive in any order — can all see them.
  const guesses = useRef<string[]>([]);
  const settled = useRef(true);
  const handlers = useRef({ onHeard, onNothing });
  useEffect(() => {
    handlers.current = { onHeard, onNothing };
  });

  // Leaving the screen mid-sentence stops listening.
  useEffect(() => () => ExpoSpeechRecognitionModule.abort(), []);

  const settle = useCallback((alternatives: string[]) => {
    if (settled.current) return;
    settled.current = true;
    const heard = alternatives.map((text) => text.trim()).filter(Boolean);
    if (heard.length > 0) handlers.current.onHeard(heard);
    else handlers.current.onNothing();
  }, []);

  useSpeechRecognitionEvent("result", (event) => {
    guesses.current = event.results.map((result) => result.transcript);
    setPartial(event.results[0]?.transcript ?? "");
    if (event.isFinal) {
      settle(guesses.current);
      ExpoSpeechRecognitionModule.stop();
    }
  });

  useSpeechRecognitionEvent("end", () => {
    setStatus((current) => (current === "unavailable" ? current : "idle"));
    // Stopped before a final result: what was heard so far is the answer.
    settle(guesses.current);
  });

  useSpeechRecognitionEvent("error", (event) => {
    if (event.error === "aborted") {
      settled.current = true;
      return;
    }
    if (UNAVAILABLE.has(event.error)) {
      settled.current = true;
      setStatus("unavailable");
      return;
    }
    settle(guesses.current);
  });

  const start = useCallback(async () => {
    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      setStatus("unavailable");
      return;
    }
    guesses.current = [];
    settled.current = false;
    setPartial("");
    setStatus("listening");
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      maxAlternatives: 3,
      continuous: false,
      addsPunctuation: false,
      // Played out loud, not in the earpiece, when the card is read back after.
      iosCategory: {
        category: "playAndRecord",
        categoryOptions: ["defaultToSpeaker", "allowBluetooth"],
        mode: "measurement",
      },
    });
  }, []);

  /** Done speaking: whatever was heard so far is the answer. */
  const stop = useCallback(() => ExpoSpeechRecognitionModule.stop(), []);

  return { status, partial, start, stop };
}
