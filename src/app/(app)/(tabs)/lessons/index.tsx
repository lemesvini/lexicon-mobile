import { useCallback, useEffect, useMemo, useRef } from "react";
import { ActivityIndicator, RefreshControl, Text, useWindowDimensions } from "react-native";
import { useHeaderHeight } from "expo-router/react-navigation";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LessonPath from "@/features/lessons/components/lesson-path";
import ModuleMenu from "@/features/lessons/components/module-menu";
import StatsMenu from "@/features/lessons/components/stats-menu";
import { useLessonPath } from "@/features/lessons/data/use-lesson-path";
import { layoutPath } from "@/features/lessons/path-layout";

/** Under the last lesson, before the tab bar. */
const BOTTOM_PADDING = 40;
/** The tab bar over the bottom of the path, above the home indicator. */
const TAB_BAR_HEIGHT = 49;

export default function LessonsScreen() {
  const { state, refreshing, refresh } = useLessonPath();
  const { width, height: screenHeight } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const data = state.status === "ready" ? state.data : null;
  const geometry = useMemo(() => (data ? layoutPath(data.units, width) : null), [data, width]);

  // No automatic insets: the room for the header and the tab bar is padding of
  // our own, so an offset of 0 is the top at rest and every position on the
  // path is plain arithmetic — nothing for iOS to adjust behind our back.
  const bottomInset = insets.bottom + TAB_BAR_HEIGHT;

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Opens on the current lesson, and follows it when a reload moves it on — a
  // class recorded while the tab was away. `undefined` until the first scroll,
  // which jumps; any later one glides.
  const scrolledTo = useRef<string | null | undefined>(undefined);
  const scrollToCurrent = useCallback(() => {
    if (!data || geometry?.currentY == null || scrolledTo.current === data.currentId) return;
    const first = scrolledTo.current === undefined;
    scrolledTo.current = data.currentId;

    // The path starts under the header's padding.
    const content = headerHeight + geometry.height + BOTTOM_PADDING + bottomInset;
    const target = headerHeight + geometry.currentY - screenHeight / 2;
    const y = Math.max(0, Math.min(target, content - screenHeight));
    scrollRef.current?.scrollTo({ y, animated: !first });
  }, [data, geometry, headerHeight, bottomInset, screenHeight, scrollRef]);

  // After the frame that lays the path out; before it there is nowhere to go.
  useEffect(() => {
    const frame = requestAnimationFrame(scrollToCurrent);
    return () => cancelAnimationFrame(frame);
  }, [scrollToCurrent]);

  return (
    <>
      {data?.moduleName ? <ModuleMenu moduleName={data.moduleName} /> : null}
      <StatsMenu attendance={data?.attendance ?? null} />
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onContentSizeChange={scrollToCurrent}
        contentInsetAdjustmentBehavior="never"
        scrollIndicatorInsets={{ top: headerHeight, bottom: bottomInset }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingBottom: BOTTOM_PADDING + bottomInset,
        }}
      >
        {data && geometry ? (
          data.units.length > 0 ? (
            <LessonPath units={data.units} geometry={geometry} width={width} scrollY={scrollY} />
          ) : (
            <Text className="px-4 py-10 text-center font-sans text-sm text-muted-foreground">
              Seu módulo ainda não tem aulas.
            </Text>
          )
        ) : state.status === "error" ? (
          <Text className="px-4 py-10 text-center font-sans text-sm text-muted-foreground">
            Não foi possível carregar suas aulas. Puxe para tentar de novo.
          </Text>
        ) : (
          <ActivityIndicator className="py-10" />
        )}
      </Animated.ScrollView>
    </>
  );
}
