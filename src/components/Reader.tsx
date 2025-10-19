import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Text,
  View,
} from "react-native";
import { useReaderStore } from "../store/useReaderStore";
import { paginate } from "../utils/paginator";

const { width } = Dimensions.get("window");

type Props = {
  bookId: string;
  chapterId: number;
  title: string;
  content: string;
  onPrev: () => void;
  onNext: () => void;
};

export default function Reader({
  bookId,
  chapterId,
  title,
  content,
  onPrev,
  onNext,
}: Props) {
  const { prefs, saveProgress } = useReaderStore();
  const pages = useMemo(() => paginate(content, 1800), [content]);
  const [pageIndex, setPageIndex] = useState(0);
  const flatListRef = useRef<FlatList<string>>(null);

  // 🔸 Fade animasyonu için değer
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // 🔸 Tema değiştiğinde animasyonu tetikle
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();
  }, [prefs.theme]);

  useEffect(() => {
    setPageIndex(0);
    flatListRef.current?.scrollToIndex({ index: 0, animated: false });
  }, [chapterId]);

  useEffect(() => {
    saveProgress({ bookId, chapterId, offset: pageIndex });
  }, [pageIndex]);

  // 🎨 Tema renkleri
  let bg = "#fff";
  let color = "#111";
  if (prefs.theme === "dark") {
    bg = "#000";
    color = "#fff";
  } else if (prefs.theme === "sepia") {
    bg = "#f5e6c8";
    color = "#3b2f2f";
  }

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
        backgroundColor: bg,
      }}
    >
      <FlatList
        ref={flatListRef}
        data={pages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          if (newIndex !== pageIndex) setPageIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <View style={{ width, padding: 20, justifyContent: "center" }}>
            <Text
              style={{
                color,
                fontSize: prefs.fontSize,
                lineHeight: prefs.fontSize * 1.6,
                textAlign: "justify",
              }}
            >
              {item}
            </Text>
          </View>
        )}
        onEndReached={() => onNext()}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <View style={{ width, padding: 20 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "600",
                color,
                marginBottom: 12,
              }}
            >
              {title}
            </Text>
          </View>
        }
      />
    </Animated.View>
  );
}
