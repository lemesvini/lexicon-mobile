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
        }} />
    </Stack>
  );
}
