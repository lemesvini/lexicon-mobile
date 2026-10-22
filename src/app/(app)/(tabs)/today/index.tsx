import { RefreshControl, ScrollView, Text, useColorScheme, View } from "react-native";
import { router, Stack } from "expo-router";
import { Check } from "lucide-react-native";
import { cssInterop } from "nativewind";
import CurrentLessonCard from "@/features/today/components/current-lesson";

import { colors } from "@/theme/colors";
import MyWeek from "@/features/today/components/my-week";
import { useToday } from "@/features/today/data/use-today";

cssInterop(Check, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

export default function TodayScreen() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const { state, refreshing, refresh } = useToday();

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
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <View className="p-4 items-center gap-6">
          {state.status === "ready" ? (
            <>
              <CurrentLessonCard lesson={state.data.next} hasPlan={state.data.hasPlan} />
              <MyWeek week={state.data.week} />
            </>
          ) : state.status === "error" ? (
            <Text className="py-10 text-center font-sans text-sm text-muted-foreground">
              Não foi possível carregar suas aulas. Puxe para tentar de novo.
            </Text>
          ) : (
            <>
              <CurrentLessonCard loading />
              <MyWeek loading />
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}
