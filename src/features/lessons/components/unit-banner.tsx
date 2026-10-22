import { Text, View } from "react-native";

import { BANNER_HEIGHT } from "@/features/lessons/path-layout";
import type { PathUnit } from "@/features/lessons/types/path-unit";

type Props = {
  unit: PathUnit;
};

/** A unit's banner. One sits on the path at the start of every unit, and one is
 *  pinned under the header; they are the same size, so the hand-over between
 *  them doesn't show. */
export default function UnitBanner({ unit }: Props) {
  return (
    <View
      style={{ height: BANNER_HEIGHT }}
      className="justify-center rounded-3xl bg-primary px-5"
    >
      {unit.title ? (
        <>
          <Text className="font-sans text-xs font-bold uppercase tracking-widest text-primary-text/80">
            {unit.name}
          </Text>
          <Text numberOfLines={1} className="font-display text-3xl text-primary-text">
            {unit.title}
          </Text>
        </>
      ) : (
        <Text numberOfLines={1} className="font-display text-3xl text-primary-text">
          {unit.name}
        </Text>
      )}
    </View>
  );
}
