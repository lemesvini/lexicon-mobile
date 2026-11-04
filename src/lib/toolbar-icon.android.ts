import { useEffect, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { type AndroidSymbol, type SFSymbol, unstable_getMaterialSymbolSourceAsync } from "expo-symbols";

/** Each symbol drawn once, for every screen after. */
const drawn = new Map<AndroidSymbol, ImageSourcePropType>();

/** The Material Symbol: Android's toolbar takes nothing else, and leaves out a
 *  button without one. */
export function useToolbarIcon(_sf: SFSymbol | null, md: AndroidSymbol): ImageSourcePropType | undefined {
  return useMaterialSymbol(md);
}

/**
 * A Material Symbol as an image, drawn from expo-symbols' font the way the
 * tabs' `md` icons are. White, since whatever shows it tints it.
 *
 * Undefined until it is drawn — the button appears a moment after the screen,
 * the first time only.
 */
export function useMaterialSymbol(md: AndroidSymbol): ImageSourcePropType | undefined {
  const [loaded, setLoaded] = useState<{ md: AndroidSymbol; source: ImageSourcePropType } | null>(null);

  useEffect(() => {
    if (drawn.has(md)) return;
    let current = true;
    unstable_getMaterialSymbolSourceAsync(md, 24, "white")
      .then((source) => {
        if (!source) return;
        drawn.set(md, source);
        if (current) setLoaded({ md, source });
      })
      .catch(() => {});
    return () => {
      current = false;
    };
  }, [md]);

  return drawn.get(md) ?? (loaded?.md === md ? loaded.source : undefined);
}
