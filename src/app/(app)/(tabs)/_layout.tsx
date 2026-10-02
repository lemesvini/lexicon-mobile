import { NativeTabs } from "expo-router/unstable-native-tabs"; // SDK 58: "expo-router/native-tabs"
import { useColorScheme } from "react-native";

import { colors } from "@/theme/colors";

export default function TabsLayout() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <NativeTabs tintColor={colors[scheme].primary}>
      <NativeTabs.Trigger name="today">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="sun.horizon" md="wb_twilight" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="lessons">
        <NativeTabs.Trigger.Label >Lessons</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="book.pages" md="auto_stories" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="homework">
        <NativeTabs.Trigger.Label>Homework</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="checklist" md="checklist" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="practice">
        <NativeTabs.Trigger.Label>Practice</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="square.and.pencil" md="edit_square" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
