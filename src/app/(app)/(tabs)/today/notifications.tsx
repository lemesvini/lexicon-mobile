import { Fragment } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import NotificationRow from "@/features/notifications/components/notification-row";
import { useInbox } from "@/features/notifications/data/use-inbox";

/** The bell's list: corrections, unit reports and class reminders, newest
 *  first. */
export default function NotificationsScreen() {
  const { state, refreshing, refresh } = useInbox();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="p-4"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    >
      {state.status === "ready" ? (
        state.items.length > 0 ? (
          <View className="overflow-hidden rounded-3xl bg-card">
            {state.items.map((item, index) => (
              <Fragment key={item.id}>
                {index > 0 && (
                  <View
                    className="ml-[76px] bg-border"
                    style={{ height: StyleSheet.hairlineWidth }}
                  />
                )}
                <NotificationRow item={item} />
              </Fragment>
            ))}
          </View>
        ) : (
          <Text className="py-10 text-center font-sans text-sm text-muted-foreground">
            Nenhuma notificação por enquanto. Correções, relatórios e lembretes de aula
            aparecem aqui.
          </Text>
        )
      ) : state.status === "error" ? (
        <Text className="py-10 text-center font-sans text-sm text-muted-foreground">
          Não foi possível carregar suas notificações. Puxe para tentar de novo.
        </Text>
      ) : null}
    </ScrollView>
  );
}
