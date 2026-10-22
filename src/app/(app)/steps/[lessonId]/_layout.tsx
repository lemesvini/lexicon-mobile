import { Stack } from "expo-router";

// The viewer's own stack, inside the modal it opens in. Not for pushing
// anything: a native stack is what gives the screen a navigation controller,
// and the bottom `Stack.Toolbar` is that controller's toolbar — a form sheet,
// which has none, would show no buttons. The bar on top stays hidden.
export default function StepsLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
