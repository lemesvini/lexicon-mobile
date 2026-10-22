import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

import { colors } from "@/theme/colors";

type Props = {
  /** The module the path is of — the group's. */
  moduleName: string;
};

/** The header button naming the student's module. A menu of one for now: the
 *  modules behind them are for when the path can show those too. */
export default function ModuleMenu({ moduleName }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <Stack.Toolbar placement="left">
      <Stack.Toolbar.Menu
        title="Seu módulo"
        tintColor={colors[scheme].primary}
        accessibilityLabel={`Módulo: ${moduleName}`}
      >
        <Stack.Toolbar.Label>{moduleName}</Stack.Toolbar.Label>
        <Stack.Toolbar.MenuAction isOn subtitle="Atual" onPress={() => {}}>
          {moduleName}
        </Stack.Toolbar.MenuAction>
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
}
