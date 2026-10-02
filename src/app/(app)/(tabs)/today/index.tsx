import { ScrollView, Text, useColorScheme, View } from "react-native";
import { router, Stack } from "expo-router";
import { Check } from "lucide-react-native";
import { cssInterop } from "nativewind";
import CurrentLessonCard from "@/features/today/components/current-lesson";

import { colors } from "@/theme/colors";

cssInterop(Check, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

export default function TodayScreen() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={"dpad.fill"}
          onPress={() => { }}
          tintColor={colors[scheme].primary}
        />
        <Stack.Toolbar.Button
          icon={"bell.fill"}
          onPress={() => { }}
          tintColor={colors[scheme].primary}
        />
       
      </Stack.Toolbar>
      <Stack.Toolbar placement="left">
         <Stack.Toolbar.Button
          icon={"person.fill"}
          onPress={() => router.push("/profile")}
          tintColor={colors[scheme].primary}
          separateBackground
        />
      </Stack.Toolbar>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View className="p-4 items-center gap-4">
          <CurrentLessonCard />
        </View>
      </ScrollView>
    </>
  );
}
