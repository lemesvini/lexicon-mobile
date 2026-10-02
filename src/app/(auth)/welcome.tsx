import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/features/auth/auth-provider";
import HeroHeadline from "@/features/auth/components/hero-headline";

const LANDING_URL = "https://lexicon-english.com";

// Staggered so the page settles top to bottom, like the landing page.
const enter = (step: number) => FadeInDown.duration(600).delay(120 * step);

export default function WelcomeScreen() {
  const { notice } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-background px-6"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}
    >
      <Animated.View entering={enter(0)}>
        <Text className="font-display text-3xl text-ring">lexicon</Text>
        {/* <Text className="-mt-1 ml-0.5 font-sans text-[11px] font-semibold tracking-[2px] text-ring">
          English School
        </Text> */}
      </Animated.View>

      <View className="flex-1 justify-center gap-6">
        <Animated.View entering={enter(1)}>
          <HeroHeadline />
        </Animated.View>
        <Animated.Text
          entering={enter(2)}
          className="text-center font-sans text-lg leading-7 text-foreground"
        >
          Do básico ao avançado, aulas de inglês personalizadas com base no{" "}
          <Text className="font-bold">seu contexto</Text>.
        </Animated.Text>
      </View>

      <Animated.View entering={enter(3)} className="gap-5">
        {notice && (
          <Text accessibilityRole="alert" className="text-center font-sans text-sm text-destructive">
            {notice}
          </Text>
        )}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/sign-in")}
          className="h-14 items-center justify-center rounded-full bg-primary active:opacity-80"
        >
          <Text className="font-sans text-lg font-semibold text-primary-foreground">
            Entrar na minha conta
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="link"
          onPress={() => void WebBrowser.openBrowserAsync(LANDING_URL)}
          className="items-center py-1"
        >
          <Text className="font-sans text-base text-muted-foreground">
            Ainda não é aluno? <Text className="font-semibold text-ring">Agende seu nivelamento ›</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
