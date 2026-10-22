import { Text, View } from "react-native";

/** Where a block the app doesn't draw sits — a minigame, played with the class
 *  on the projector: said, rather than a hole. */
export default function UnsupportedView() {
  return (
    <View className="rounded-2xl border border-dashed border-border px-4 py-4">
      <Text className="font-sans text-sm text-muted-foreground">
        Aqui há um jogo que acontece na aula, com a turma.
      </Text>
    </View>
  );
}
