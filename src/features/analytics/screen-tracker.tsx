import { useGlobalSearchParams, useSegments } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect } from "react";

/**
 * A `$screen` event for every route the student opens, named by the route's
 * pattern ("/lesson/[lessonId]") so every lesson counts as the same screen;
 * the actual ids go along as properties.
 */
export function ScreenTracker() {
  const posthog = usePostHog();
  const segments = useSegments();
  const params = useGlobalSearchParams();

  // Groups like "(app)" and "(tabs)" aren't part of what the student sees.
  const name = "/" + segments.filter((segment) => !segment.startsWith("(")).join("/");

  useEffect(() => {
    posthog.screen(name, params);
    // params is a new object on every render; the id changing within the same
    // route is a new screen too, hence the serialized key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posthog, name, JSON.stringify(params)]);

  return null;
}
