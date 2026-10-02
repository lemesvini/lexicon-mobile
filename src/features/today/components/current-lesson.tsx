import { View, Text } from "react-native";

export default function CurrentLessonCard() {
    return (
        <View className="bg-ring/20 p-5 w-full rounded-3xl">
            <View className="flex-row justify-between">
                <Text className="font-sans font-bold text-secondary-foreground text-sm">Seu <Text className="font-display text-lg">can do</Text> da semana:</Text>
                <Text className="font-sans text-sm font-semibold text-secondary-foreground">Lesson Eight</Text>
            </View>
            <Text className="text-secondary-foreground font-display text-3xl mt-3">Ask for</Text>
            <Text className="text-secondary-foreground font-display text-3xl">information politely</Text>
            <View className="flex-row items-center mt-4">
                <View className="">
                </View>
            </View>
        </View>
    )
}