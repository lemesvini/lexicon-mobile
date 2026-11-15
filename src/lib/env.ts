import { z } from "zod";

// Expo only inlines `process.env.EXPO_PUBLIC_*` when the name is written out in
// full, so each variable is listed by hand rather than parsing `process.env`.
const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.url(),
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  // Optional: without them PostHog is simply off, it never blocks the app.
  EXPO_PUBLIC_POSTHOG_API_KEY: z.string().min(1).optional(),
  EXPO_PUBLIC_POSTHOG_HOST: z.url().optional(),
});

export const env = envSchema.parse({
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  EXPO_PUBLIC_POSTHOG_API_KEY: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
  EXPO_PUBLIC_POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST,
});
