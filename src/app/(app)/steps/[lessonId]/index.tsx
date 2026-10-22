import { useState } from "react";
import { ActivityIndicator, Text, View, useColorScheme } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BlockView from "@/features/material/components/block-view";
import SlidePager from "@/features/material/components/slide-pager";
import SlideProgress from "@/features/material/components/slide-progress";
import { useMaterial } from "@/features/material/data/use-material";
import { haptics } from "@/lib/haptics";
import { colors } from "@/theme/colors";

/** The bottom toolbar, above the home indicator. */
const BOTTOM_TOOLBAR_HEIGHT = 56;

/** A lesson's material, a slide at a time: swiped through, or moved by the
 *  two buttons at the bottom. Opens on the step tapped on the lesson page, in a
 *  modal that closes by dragging it down or with "Concluir" on the last slide. */
export default function StepsScreen() {
  const { lessonId, step } = useLocalSearchParams<{ lessonId: string; step?: string }>();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const insets = useSafeAreaInsets();
  const state = useMaterial(lessonId);
  const [requested, setRequested] = useState(() => Number(step) || 0);

  const slides = state.status === "ready" ? state.slides : [];
  // Within the material, whatever the link asked for.
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
              if (last) {
                // The material read to its end.
                haptics.success();
                router.back();
              } else {
                haptics.tap();
                setRequested(index + 1);
              }
            }}
            tintColor={tint}
          >
            {last ? "Concluir" : "Seguir"}
          </Stack.Toolbar.Button>
        </Stack.Toolbar>
      ) : null}

      {state.status === "ready" && slides.length > 0 ? (
        <>
          <SlideProgress
            title={slides[index]!.stage}
            number={index + 1}
            progress={(index + 1) / slides.length}
            progressLabel={`Etapa ${index + 1} de ${slides.length}`}
          />
          <SlidePager
            pages={slides}
            renderPage={(slide) =>
              slide.blocks.map((block, position) => <BlockView key={position} block={block} />)
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
            ? "Não foi possível carregar o material. Feche e tente de novo."
            : "O material desta aula ainda não foi publicado."}
        </Text>
      )}
    </View>
  );
}
