import { Button, HStack, Host, Image, Menu, Section, Text } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

import { colors } from "@/theme/colors";

type Props = {
  /** Attendance in the student's group, 0–100, or null before they have been
   *  marked at all. */
  attendance: number | null;
};

/** The header button with the student's attendance, opening a menu of their
 *  stats.
 *
 *  A SwiftUI menu rather than `Stack.Toolbar.Menu`: a native header button
 *  shows its icon OR its text, never both side by side. */
export default function StatsMenu({ attendance }: Props) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const tint = colors[scheme].primary;
  const percent = attendance === null ? null : Math.round(attendance);

  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.View>
        {/* A toolbar view needs one child with an explicit width and height. */}
        <Host style={{ width: 76, height: 36 }} colorScheme={scheme}>
          <Menu
            label={
              <HStack spacing={6}>
                <Image systemName="calendar.badge.checkmark" size={15} color={tint} />
                <Text
                  modifiers={[
                    font({ family: "Montserrat", size: 16, weight: "semibold" }),
                    foregroundStyle(tint),
                  ]}
                >
                  {percent === null ? "—" : `${percent}%`}
                </Text>
              </HStack>
            }
          >
            <Section title="Suas estatísticas">
              <Button
                label={
                  percent === null ? "Frequência: sem aulas registradas" : `Frequência: ${percent}%`
                }
                systemImage="calendar.badge.checkmark"
              />
            </Section>
          </Menu>
        </Host>
      </Stack.Toolbar.View>
    </Stack.Toolbar>
  );
}
