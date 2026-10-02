import { Stack } from "expo-router";

export default function LessonsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Lessons",
          headerLargeTitle: true,
          headerLargeTitleStyle: { fontFamily: "Caprasimo" },
          headerTitleStyle: { fontFamily: "Caprasimo" },
        }} />
    </Stack>
  );
}
