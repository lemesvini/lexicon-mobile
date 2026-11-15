import { cssInterop } from "nativewind";
import { Platform, ScrollView } from "react-native";
import {
  KeyboardAwareScrollView as ControllerScrollView,
  type KeyboardAwareScrollViewProps,
} from "react-native-keyboard-controller";

/** Taught NativeWind's class names, as the ScrollView it stands in for. */
cssInterop(ControllerScrollView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});

/** How far the focused box sits above the keyboard. */
export const KEYBOARD_GAP = 24;

/** A ScrollView that keeps the focused text box above the keyboard.
 *
 *  On iOS, the native ScrollView's `automaticallyAdjustKeyboardInsets`: it
 *  knows about the inset under a large-title header, which the controller's
 *  ScrollView doesn't — it scrolls as if content started at 0 and tucks the
 *  first fields under the header.
 *
 *  On Android, react-native-keyboard-controller's: edge to edge, the window no
 *  longer shrinks for the keyboard, and the iOS prop doesn't exist there. */
export default function KeyboardAwareScrollView({ bottomOffset, ...props }: KeyboardAwareScrollViewProps) {
  if (Platform.OS === "ios") {
    return <ScrollView automaticallyAdjustKeyboardInsets {...props} />;
  }
  return <ControllerScrollView bottomOffset={bottomOffset} {...props} />;
}
