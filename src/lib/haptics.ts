import * as Haptics from "expo-haptics";

// The app's taps, by what they mean rather than one buzz for everything:
//
//   tap      a button that goes somewhere — a node, a step, Back, Next
//   select   picking among choices: an answer, a page swiped to
//   success  something finished: a homework handed in, a material done
//   warning  something that didn't go through
//   celebrate  something big finished: a whole practice sitting — a burst
//              that builds and lands, felt as a cheer rather than a tick
//
// Fired and forgotten: a device with no haptic engine, or the web, just
// doesn't buzz, and nothing waits on it.

function quietly(feedback: Promise<void>) {
  feedback.catch(() => {});
}

export const haptics = {
  tap: () => quietly(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  select: () => quietly(Haptics.selectionAsync()),
  success: () => quietly(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () => quietly(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  celebrate: () => {
    quietly(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
    // A drumroll building up from light to heavy, then the landing.
    const roll: [number, Haptics.ImpactFeedbackStyle][] = [
      [220, Haptics.ImpactFeedbackStyle.Light],
      [310, Haptics.ImpactFeedbackStyle.Medium],
      [390, Haptics.ImpactFeedbackStyle.Medium],
      [460, Haptics.ImpactFeedbackStyle.Heavy],
      [520, Haptics.ImpactFeedbackStyle.Heavy],
    ];
    for (const [at, style] of roll) setTimeout(() => quietly(Haptics.impactAsync(style)), at);
    setTimeout(() => quietly(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)), 720);
  },
};
