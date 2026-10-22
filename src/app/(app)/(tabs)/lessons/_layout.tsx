import { Stack } from "expo-router";

export default function LessonsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          // No title: the header only carries the module and stats menus.
          // `headerShown: false` would hide those too.
          title: "",
          // The path runs up behind the header to the top of the screen...
          headerTransparent: true,
          // ...without iOS 26 fading it out under the header's buttons.
          scrollEdgeEffects: { top: "hidden" },
        }} />
    </Stack>
  );
}
