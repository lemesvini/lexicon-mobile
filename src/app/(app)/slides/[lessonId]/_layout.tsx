import { Stack } from "expo-router";

// The deck viewer's own stack, inside its modal — for the same reason as the
// material's (steps/[lessonId]/_layout.tsx): the bottom toolbar is a navigation
// controller's, and only a stack gives the screen one. The bar on top stays
// hidden.
export default function SlidesLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
