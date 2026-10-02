import { z } from "zod";

// Expo only inlines `process.env.EXPO_PUBLIC_*` when the name is written out in
// full, so each variable is listed by hand rather than parsing `process.env`.
const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.url(),
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

export const env = envSchema.parse({
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});
