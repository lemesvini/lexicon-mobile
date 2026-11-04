import { useState } from "react";
import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { DropdownMenu, DropdownMenuItem, Host, Icon, IconButton, Text } from "@expo/ui/jetpack-compose";
import type { AndroidSymbol } from "expo-symbols";

import { useMaterialSymbol } from "@/lib/toolbar-icon";
import { colors } from "@/theme/colors";

type Props = {
  placement: "left" | "right";
  icon: AndroidSymbol;
  accessibilityLabel: string;
  /** Over the items, as iOS heads its menus. */
  title: string;
  /** What the menu says. Read-only: nothing to pick yet. */
  items: { label: string; checked?: boolean }[];
};

/**
 * A header menu on Android, for the path's transparent header.
 * `Stack.Toolbar.Menu` paints its menu with the header's background — clear,
 * there — and the same color goes behind its button, so it can't be given one
 * without the other. Drawn here instead: a bare icon over the path, a menu on
 * the card color.
 */
export default function HeaderMenu({ placement, icon, accessibilityLabel, title, items }: Props) {
  const palette = colors[useColorScheme() === "dark" ? "dark" : "light"];
  const [expanded, setExpanded] = useState(false);
  const source = useMaterialSymbol(icon);
  const check = useMaterialSymbol("check");

  if (!source) return null;

  return (
    <Stack.Toolbar placement={placement} asChild>
      <Host matchContents>
        <DropdownMenu expanded={expanded} onDismissRequest={() => setExpanded(false)} color={palette.card}>
          <DropdownMenu.Trigger>
            <IconButton onClick={() => setExpanded(true)}>
              <Icon source={source} tint={palette.primary} size={24} contentDescription={accessibilityLabel} />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Items>
            <DropdownMenuItem enabled={false} elementColors={{ disabledTextColor: palette.mutedForeground }}>
              <DropdownMenuItem.Text>
                <Text color={palette.mutedForeground}>{title}</Text>
              </DropdownMenuItem.Text>
            </DropdownMenuItem>
            {items.map((item) => (
              <DropdownMenuItem key={item.label} onClick={() => setExpanded(false)}>
                <DropdownMenuItem.Text>
                  <Text color={palette.foreground}>{item.label}</Text>
                </DropdownMenuItem.Text>
                {item.checked && check ? (
                  <DropdownMenuItem.TrailingIcon>
                    <Icon source={check} tint={palette.primary} size={24} />
                  </DropdownMenuItem.TrailingIcon>
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenu.Items>
        </DropdownMenu>
      </Host>
    </Stack.Toolbar>
  );
}
