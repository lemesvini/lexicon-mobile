import { Text, View, useColorScheme } from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";
import { Check, X } from "lucide-react-native";

import PracticeButton from "@/features/practice/components/practice-button";
import type { CardRating } from "@/features/practice/types/card-rating";
import { practiceColors } from "@/theme/colors";

type Props = {
  rating: CardRating;
  label: string;
  /** The sentence, shown when the answer wasn't exactly it. */
  answer: string | null;
  translation: string | null;
  bottomInset: number;
  onContinue: () => void;
};

/** How the answer went, rising from the bottom of the screen in its colour:
 *  the right sentence when it wasn't given, what it means, and on. */
export default function FeedbackPanel({ rating, label, answer, translation, bottomInset, onContinue }: Props) {
  const look = practiceColors[useColorScheme() === "dark" ? "dark" : "light"][rating];
  const Icon = rating === "remembered" ? Check : X;

  return (
    <Animated.View
      entering={SlideInDown.duration(260)}
      style={{ backgroundColor: look.background, paddingBottom: bottomInset + 12 }}
      className="gap-3 rounded-t-[28px] px-5 pt-5"
    >
      <View className="flex-row items-center gap-3">
        <View style={{ backgroundColor: look.text }} className="size-9 items-center justify-center rounded-full">
          <Icon color={look.background} size={20} strokeWidth={3} />
        </View>
        <Text style={{ color: look.text }} className="font-display text-2xl">
          {label}
        </Text>
      </View>
      {answer ? (
        <View className="gap-0.5">
          <Text style={{ color: look.text }} className="font-sans text-sm font-bold uppercase tracking-wider opacity-80">
            Resposta certa
          </Text>
          <Text style={{ color: look.text }} className="font-sans text-lg font-semibold">
            {answer}
          </Text>
        </View>
      ) : null}
      {translation ? (
        <Text style={{ color: look.text }} className="font-sans text-base opacity-80">
          {translation}
        </Text>
      ) : null}
      <View className="pt-1">
        <PracticeButton label="Continuar" variant="primary" onPress={onContinue} />
      </View>
    </Animated.View>
  );
}
