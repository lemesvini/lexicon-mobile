import { useEffect, useRef, useState, type ReactNode } from "react";
import { FlatList, ScrollView, View } from "react-native";

import { haptics } from "@/lib/haptics";

type Props<T> = {
  /** A material's slides, a homework's questions. */
  pages: T[];
  renderPage: (page: T, index: number) => ReactNode;
  /** The page showing. The screen owns it: a swipe reports it, a button sets
   *  it. */
  index: number;
  onIndexChange: (index: number) => void;
  /** Room under each page for the bottom toolbar. */
  bottomInset: number;
};

/** Pages side by side, one a screen, each scrolling down on its own. Swiped
 *  through, or moved by the screen's buttons. */
export default function SlidePager<T>({ pages, renderPage, index, onIndexChange, bottomInset }: Props<T>) {
  const list = useRef<FlatList<T>>(null);
  // The page is the pager's own width, not the window's: a modal on an iPad is
  // narrower than the screen.
  const [width, setWidth] = useState(0);
  // Where the list last came to rest, so a change it reported itself isn't
  // scrolled to a second time.
  const settled = useRef(index);

  useEffect(() => {
    if (width === 0 || index === settled.current) return;
    settled.current = index;
    list.current?.scrollToIndex({ index, animated: true });
  }, [index, width]);

  return (
    <View className="flex-1" onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      {/* Measured first, so it opens on the page that was asked for. */}
      {width > 0 ? (
        <FlatList
          ref={list}
          data={pages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, position) => String(position)}
          initialScrollIndex={index}
          getItemLayout={(_, position) => ({ length: width, offset: width * position, index: position })}
          // A page can be heavy — a table, a cover — and there may be a dozen.
          initialNumToRender={1}
          windowSize={3}
          onMomentumScrollEnd={(event) => {
            const landed = Math.round(event.nativeEvent.contentOffset.x / width);
            settled.current = landed;
            // A swipe to another page ticks. One the buttons asked for lands on
            // the index already set, and the button has buzzed for it.
            if (landed !== index) {
              haptics.select();
              onIndexChange(landed);
            }
          }}
          renderItem={({ item, index: position }) => (
            <ScrollView
              style={{ width }}
              contentContainerStyle={{ paddingBottom: bottomInset + 24 }}
              contentContainerClassName="gap-6 px-4 pt-2"
              // A written answer: the page makes room for the keyboard, and a
              // tap on an option doesn't first have to dismiss it.
              automaticallyAdjustKeyboardInsets
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
            >
              {renderPage(item, position)}
            </ScrollView>
          )}
        />
      ) : null}
    </View>
  );
}
