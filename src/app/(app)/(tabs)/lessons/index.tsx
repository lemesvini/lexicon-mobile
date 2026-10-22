import { useState } from "react";
import { ScrollView, View, Text } from "react-native";

import ModuleMenu from "@/features/lessons/components/module-menu";
import StatsMenu from "@/features/lessons/components/stats-menu";
import type { StudentModule } from "@/features/lessons/types/student-module";

// Placeholder until the list comes from `student_modules`.
const MODULES: StudentModule[] = [
  { id: "book-one", name: "Book One", current: false, completed: true },
  { id: "book-two", name: "Book Two", current: true, completed: false },
];

export default function LessonsScreen() {
  const [selected, setSelected] = useState(
    () => MODULES.find((module) => module.current) ?? MODULES[0]!,
  );

  return (
    <>
      <ModuleMenu modules={MODULES} selected={selected} onSelect={setSelected} />
      {/* Placeholder until attendance comes from the register. */}
      <StatsMenu attendance={92} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="px-4"
      >
        <View className="bg-primary px-4 py-4 rounded-3xl flex flex-row">
          <View className="flex flex-col">
            <Text className="text-primary-text font-sans font-bold">Unit One</Text>
            <Text className="text-primary-text font-display font-bold text-3xl">Make a friend</Text>
          </View>
          <View>

          </View>
        </View>
      </ScrollView>
    </>
  );
}
