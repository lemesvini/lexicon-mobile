import { PostHogProvider } from "posthog-react-native";

import { posthog } from "@/features/analytics/posthog";

/** Makes the PostHog client (see ./posthog) available to usePostHog. */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider
      client={posthog}
      // Expo Router hides the NavigationContainer the SDK would hook into, so
      // screens are captured by ScreenTracker instead.
      autocapture={{ captureScreens: false, captureTouches: false }}
    >
      {children}
    </PostHogProvider>
  );
}
