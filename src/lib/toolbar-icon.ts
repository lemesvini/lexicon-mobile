import type { ImageSourcePropType } from "react-native";
import type { AndroidSymbol, SFSymbol } from "expo-symbols";

/**
 * The `icon` of a `Stack.Toolbar` button or menu, in each platform's own
 * symbols: the SF Symbol here, a Material Symbol on Android
 * (`toolbar-icon.android.ts`), where the toolbar draws nothing without one.
 *
 * `sf` is null for a button iOS shows as its label — the bottom toolbars'
 * "Voltar" and "Seguir" — which Android can only show as an icon.
 */
export function useToolbarIcon(sf: SFSymbol | null, _md: AndroidSymbol): SFSymbol | undefined {
  return sf ?? undefined;
}

/** A Material Symbol as an image, for Android's own views. Nothing here. */
export function useMaterialSymbol(_md: AndroidSymbol): ImageSourcePropType | undefined {
  return undefined;
}
