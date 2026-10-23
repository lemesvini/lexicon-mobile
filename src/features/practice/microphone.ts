import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";

import type { PermissionStatus } from "@/features/notifications/types/permission-status";

// Speaking needs two of the system's permissions at once: the microphone, and
// on iOS the speech recognizer. They're asked together, and only count as
// given when both are.

function statusOf(permissions: { granted: boolean; canAskAgain: boolean }): PermissionStatus {
  if (permissions.granted) return "granted";
  return permissions.canAskAgain ? "undetermined" : "blocked";
}

export async function getMicrophonePermission(): Promise<PermissionStatus> {
  return statusOf(await ExpoSpeechRecognitionModule.getPermissionsAsync());
}

/** Shows the system's prompts, if the system still will. */
export async function requestMicrophonePermission(): Promise<PermissionStatus> {
  return statusOf(await ExpoSpeechRecognitionModule.requestPermissionsAsync());
}
