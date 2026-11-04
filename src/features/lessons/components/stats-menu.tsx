import HeaderMenu from "@/features/lessons/components/header-menu";

type Props = {
  /** Attendance in the student's group, 0–100, or null before they have been
   *  marked at all. */
  attendance: number | null;
};

/** The header button with the student's attendance, opening a menu of their
 *  stats.
 *
 *  Everywhere but iOS, where `stats-menu.ios.tsx` draws it in SwiftUI —
 *  `@expo/ui/swift-ui` has no views on Android. Android's toolbar shows the
 *  icon only; the attendance is in the menu. */
export default function StatsMenu({ attendance }: Props) {
  const percent = attendance === null ? null : Math.round(attendance);

  return (
    <HeaderMenu
      placement="right"
      icon="event_available"
      accessibilityLabel={percent === null ? "Frequência" : `Frequência: ${percent}%`}
      title="Suas estatísticas"
      items={[
        { label: percent === null ? "Frequência: sem aulas registradas" : `Frequência: ${percent}%` },
      ]}
    />
  );
}
