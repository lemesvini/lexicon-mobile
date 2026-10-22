import { View } from "react-native";

import PracticeButton from "@/features/practice/components/practice-button";
import { RATING_LABELS } from "@/features/practice/srs";
import type { CardRating } from "@/features/practice/types/card-rating";

const ORDER: CardRating[] = ["forgot", "almost", "remembered"];

/** Não lembrei / Quase / Lembrei, for the student to say themselves how it
 *  went — only when the device can't listen. */
export default function RatingButtons({ onRate }: { onRate: (rating: CardRating) => void }) {
  return (
    <View className="flex-row gap-3">
      {ORDER.map((rating) => (
        <PracticeButton
          key={rating}
          label={RATING_LABELS[rating]}
          variant={rating === "remembered" ? "primary" : "plain"}
          haptic="select"
          onPress={() => onRate(rating)}
          grow
        />
      ))}
    </View>
  );
}
