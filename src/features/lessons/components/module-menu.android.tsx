import HeaderMenu from "@/features/lessons/components/header-menu";

type Props = {
  /** The module the path is of — the group's. */
  moduleName: string;
};

/** The header button naming the student's module, on Android: an icon, with
 *  the name in the menu — its toolbar can't show the name in the bar, as
 *  `module-menu.tsx` does on iOS. */
export default function ModuleMenu({ moduleName }: Props) {
  return (
    <HeaderMenu
      placement="left"
      icon="school"
      accessibilityLabel={`Módulo: ${moduleName}`}
      title="Seu módulo"
      items={[{ label: moduleName, checked: true }]}
    />
  );
}
