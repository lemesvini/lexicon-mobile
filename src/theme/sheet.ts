// Stack options for the screens that open as iOS sheets. Presentation has to
// be set in the parent layout rather than in the screen, since it's read when
// the screen is pushed.
//
// A hook rather than a constant: the title color follows the color scheme, and
// useColorScheme can only run inside a component — called at module scope it
// runs inside whichever component happens to import this file first.
import { useColorScheme } from "react-native";

import { colors } from "@/theme/colors";

export function useSheetOptions() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const titleColor = colors[scheme].secondaryForeground;

  return {
    presentation: "modal",
    headerShown: true,
    headerLargeTitle: true,
    headerLargeTitleStyle: { fontFamily: "Caprasimo", color: titleColor },
    headerTitleStyle: { fontFamily: "Caprasimo", color: titleColor },
  } as const;
}
