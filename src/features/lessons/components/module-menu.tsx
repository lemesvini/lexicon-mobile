import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

import type { StudentModule } from "@/features/lessons/types/student-module";
import { colors } from "@/theme/colors";

type Props = {
  modules: StudentModule[];
  selected: StudentModule;
  onSelect: (module: StudentModule) => void;
};

/** The header button that switches which module the Lessons tab shows. */
export default function ModuleMenu({ modules, selected, onSelect }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <Stack.Toolbar placement="left">
      <Stack.Toolbar.Menu
        title="Seus módulos"
        tintColor={colors[scheme].primary}
        accessibilityLabel={`Módulo: ${selected.name}`}
      >
        <Stack.Toolbar.Label>{selected.name}</Stack.Toolbar.Label>
        {modules.map((module) => (
          <Stack.Toolbar.MenuAction
            key={module.id}
            isOn={module.id === selected.id}
            subtitle={module.current ? "Atual" : module.completed ? "Concluído" : undefined}
            onPress={() => onSelect(module)}
          >
            {module.name}
          </Stack.Toolbar.MenuAction>
        ))}
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
}
