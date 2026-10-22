import { RefreshControl, ScrollView, Text, useColorScheme, View } from "react-native";
import { router, Stack } from "expo-router";
import { Check } from "lucide-react-native";
import { cssInterop } from "nativewind";
import CurrentLessonCard from "@/features/today/components/current-lesson";

import { colors } from "@/theme/colors";
import { useUnreadCount } from "@/features/notifications/data/use-unread-count";
import MyWeek from "@/features/today/components/my-week";
import { useToday } from "@/features/today/data/use-today";

cssInterop(Check, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

export default function TodayScreen() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const { state, refreshing, refresh } = useToday();
  const unread = useUnreadCount();

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          accessibilityLabel="Notificações"
          onPress={() => router.push("/today/notifications")}
          tintColor={colors[scheme].primary}
        >
          <Stack.Toolbar.Icon sf="bell.fill" />
          {unread > 0 ? (
            <Stack.Toolbar.Badge>{unread > 9 ? "9+" : String(unread)}</Stack.Toolbar.Badge>
          ) : null}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <View className="p-4 items-center gap-6">
          {state.status === "ready" ? (
            <>
              <CurrentLessonCard
                lesson={state.data.next}
                progress={state.data.nextProgress}
                hasPlan={state.data.hasPlan}
              />
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
