import { cssInterop } from "nativewind";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

/** A ScrollView that keeps the focused text box above the keyboard, on Android
 *  too: edge to edge, the window no longer shrinks for it, and
 *  `automaticallyAdjustKeyboardInsets` is iOS's alone. Taught NativeWind's
 *  class names, as the ScrollView it stands in for. */
cssInterop(KeyboardAwareScrollView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});

/** How far the focused box sits above the keyboard. */
export const KEYBOARD_GAP = 24;

export default KeyboardAwareScrollView;
