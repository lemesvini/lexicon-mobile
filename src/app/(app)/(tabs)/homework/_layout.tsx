import { Stack } from "expo-router";

export default function HomeworkLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Homework",
          headerLargeTitle: true,
          headerLargeTitleStyle: { fontFamily: "Caprasimo" },
          headerTitleStyle: { fontFamily: "Caprasimo" },
        }} />
    </Stack>
  );
}
