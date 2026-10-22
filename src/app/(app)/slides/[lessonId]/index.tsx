import { useState } from "react";
import { ActivityIndicator, Text, View, useColorScheme } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SlidePager from "@/features/material/components/slide-pager";
import SlideProgress from "@/features/material/components/slide-progress";
import DeckBlockView from "@/features/presentation/components/deck-block-view";
import { usePresentation } from "@/features/presentation/data/use-presentation";
import { haptics } from "@/lib/haptics";
import { colors } from "@/theme/colors";

/** The bottom toolbar, above the home indicator. */
const BOTTOM_TOOLBAR_HEIGHT = 56;

/** The class's deck — the slides the teacher showed the group — a slide at a
 *  time, like the material: swiped through, or moved by the two buttons at the
 *  bottom. The student reading the class back on their own, as on the web. */
export default function SlidesScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const insets = useSafeAreaInsets();
  const state = usePresentation(lessonId);
  const [requested, setRequested] = useState(0);

  const slides = state.status === "ready" ? state.slides : [];
  const index = Math.min(Math.max(requested, 0), Math.max(slides.length - 1, 0));
  const last = index === slides.length - 1;
  const tint = colors[scheme].primary;

  return (
    <View className="flex-1 bg-background">
      {slides.length > 0 ? (
        <Stack.Toolbar placement="bottom">
          <Stack.Toolbar.Button
            onPress={() => {
              haptics.tap();
              setRequested(index - 1);
            }}
            disabled={index === 0}
            tintColor={tint}
          >
            Voltar
          </Stack.Toolbar.Button>
          <Stack.Toolbar.Spacer />
          <Stack.Toolbar.Button
            variant="prominent"
            onPress={() => {
              haptics.tap();
              if (last) router.back();
              else setRequested(index + 1);
            }}
            tintColor={tint}
          >
            {last ? "Fechar" : "Seguir"}
          </Stack.Toolbar.Button>
        </Stack.Toolbar>
      ) : null}

      {slides.length > 0 ? (
        <>
          <SlideProgress
            title={slides[index]!.stage}
            number={index + 1}
            progress={(index + 1) / slides.length}
            progressLabel={`Slide ${index + 1} de ${slides.length}`}
          />
          <SlidePager
            pages={slides}
            renderPage={(slide) =>
              slide.blocks.map((block, position) => <DeckBlockView key={position} block={block} />)
            }
            index={index}
            onIndexChange={setRequested}
            bottomInset={insets.bottom + BOTTOM_TOOLBAR_HEIGHT}
          />
        </>
      ) : state.status === "loading" ? (
        <ActivityIndicator className="py-16" />
      ) : (
        <Text className="px-6 py-16 text-center font-sans text-sm text-muted-foreground">
          {state.status === "error"
            ? "Não foi possível carregar os slides. Feche e tente de novo."
            : state.status === "missing"
              ? "Os slides desta aula não estão disponíveis."
              : "Esta aula ainda não tem slides."}
        </Text>
      )}
    </View>
  );
}
