import { useCallback, useEffect, useState } from "react";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

/** The slow button's speed: slow enough to pick the words apart, not so slow
 *  the voice warps. */
export const SLOW_RATE = 0.65;

/**
 * One sentence's audio: loaded as the card appears, played from the start at
 * full speed or slowed down, as often as the student likes.
 */
export function useSentenceAudio(url: string) {
  const player = useAudioPlayer({ uri: url });
  const status = useAudioPlayerStatus(player);
  /** The speed of the last play, so the button that started it can show it. */
  const [rate, setRate] = useState(1);

  // Heard with the ringer off too — this is the lesson, not a notification.
  // And back to playback only, in case speaking left the session recording.
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false }).catch(() => {});
  }, []);

  const play = useCallback(
    (speed: number = 1) => {
      setRate(speed);
      player.setPlaybackRate(speed, "high");
      void player.seekTo(0).then(() => player.play());
    },
    [player],
  );

  return {
    ready: status.isLoaded,
    /** Which speed is playing right now, or null when it is quiet. */
    playing: status.playing ? rate : null,
    play,
  };
}
