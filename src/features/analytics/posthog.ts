import PostHog from "posthog-react-native";

import type { AnalyticsEvents } from "@/features/analytics/types/analytics-events";
import { env } from "@/lib/env";

/**
 * The one PostHog client, created outside React so code that isn't a component
 * (a tapped notification, a data hook's cleanup) can send events too. Off when
 * the project token isn't set, so a build without it still runs.
 */
export const posthog = new PostHog(env.EXPO_PUBLIC_POSTHOG_API_KEY ?? "phc_disabled", {
  host: env.EXPO_PUBLIC_POSTHOG_HOST,
  disabled: !env.EXPO_PUBLIC_POSTHOG_API_KEY,
  enableSessionReplay: true,
  sessionReplayConfig: {
    // The sign-in and password forms are always masked; this covers every
    // other text box too. Images are lesson content, nothing personal.
    maskAllTextInputs: true,
    maskAllImages: false,
  },
  errorTracking: {
    autocapture: { uncaughtExceptions: true, unhandledRejections: true },
  },
});

/** Sends one of the app's own events; see AnalyticsEvents for the list. */
export function track<E extends keyof AnalyticsEvents>(event: E, properties: AnalyticsEvents[E]) {
  posthog.capture(event, properties);
}
