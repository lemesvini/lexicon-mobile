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
        <NativeTabs.Trigger.Label>Path</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            default: "point.bottomleft.forward.to.point.topright.scurvepath",
            selected: "point.bottomleft.forward.to.point.topright.scurvepath.fill",
          }}
          md="route"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="practice">
        <NativeTabs.Trigger.Label>Practice</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="square.and.pencil" md="edit_square" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="me">
        <NativeTabs.Trigger.Label>Me</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "person", selected: "person.fill" }} md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
