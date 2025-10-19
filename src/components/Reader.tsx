declare module "react-native" {
  interface TextProps {
    hyphenationFrequency?: "none" | "normal" | "full";
  }
}
import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useReaderStore } from "../store/useReaderStore";
import { paginate } from "../utils/paginator";

const { width } = Dimensions.get("window");

// 🔹 Örnek reklam görselleri (assets klasöründe olmalı)
const ads = [
  require("../../assets/ads/ad1.jpg"),
  require("../../assets/ads/ad2.jpg"),
  require("../../assets/ads/ad3.jpg"),
  require("../../assets/ads/ad4.jpg"),
];

// 🔹 Reklam bileşeni
function AdBanner({ index }: { index: number }) {
  const currentAd = ads[index % ads.length];
  return (
    <View style={styles.adWrapper}>
      <View style={styles.adBadge}>
        <Text style={styles.adBadgeText}>Reklam</Text>
      </View>
      <Image source={currentAd} style={styles.adImage} resizeMode="cover" />
    </View>
  );
}

// 🔹 Sayfa bileşeni
function Page({
  item,
  index,
  scrollX,
  title,
  color,
  bg,
  fontSize,
}: {
  item: string;
  index: number;
  scrollX: SharedValue<number>;
  title: string;
  color: string;
  bg: string;
  fontSize: number;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const rotateY = interpolate(scrollX.value, inputRange, [60, 0, -60], Extrapolate.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolate.CLAMP);
    const translateX = interpolate(scrollX.value, inputRange, [20, 0, -20], Extrapolate.CLAMP);
    return {
      transform: [{ perspective: 1000 }, { translateX }, { rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.page, { width, backgroundColor: bg }, animatedStyle]}>
      {index === 0 && (
        <Text style={{ fontSize: 22, fontWeight: "600", color, marginBottom: 12 }}>
          {title}
        </Text>
      )}

      {/* 🔹 Okuma metni */}
      <Text
  style={{
    color,
    fontSize,
    lineHeight: fontSize * 1.45,
    textAlign: "justify",
    textAlignVertical: "top",
    includeFontPadding: false,
    letterSpacing: 0.15,
    writingDirection: "ltr",
    fontFamily: "Georgia",
    flexShrink: 1,            // 🔹 Metin genişliğini taşmadan optimize eder
    flexWrap: "wrap",         // 🔹 Uzun kelimeleri satıra sığdırır
    alignSelf: "stretch",     // 🔹 Text kutusunun genişliğini tam kullanır
    width: "100%",            // 🔹 Satır sonlarını sabitler
  }}
  allowFontScaling={false}
  numberOfLines={0}           // 🔹 Satır limiti yok
  adjustsFontSizeToFit={false} // 🔹 Otomatik küçültmeyi kapatır
>
  {item.trim()}
</Text>

    </Animated.View>
  );
}

// 🔹 Ana Reader bileşeni
export default function Reader({ bookId, chapterId, title, content, onPrev, onNext }: any) {
  const { prefs, saveProgress } = useReaderStore();
  const [pages, setPages] = useState<string[]>([]);

  // 🔹 Dinamik sayfalama (font boyutu değiştiğinde yeniden hesaplar)
  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await paginate(content, prefs.fontSize);
      if (mounted) setPages(result);
    })();
    return () => {
      mounted = false;
    };
  }, [content, prefs.fontSize]);

  const scrollX = useSharedValue(0);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    saveProgress({ bookId, chapterId, offset: pageIndex });
  }, [pageIndex]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  // 🔹 Tema renkleri
  let bg = "#fff";
  let color = "#111";
  if (prefs.theme === "dark") {
    bg = "#000";
    color = "#fff";
  } else if (prefs.theme === "sepia") {
    bg = "#f5e6c8";
    color = "#3b2f2f";
  }

  // 🔹 Sayfa ilerleme çubuğu
  const progressStyle = useAnimatedStyle(() => {
    const progress = (scrollX.value / ((pages.length - 1) * width)) * 100;
    return { width: `${Math.min(Math.max(progress, 0), 100)}%` };
  });

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Animated.FlatList
        data={pages}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setPageIndex(newIndex);
        }}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <Page
            item={item}
            index={index}
            scrollX={scrollX}
            title={title}
            color={color}
            bg={bg}
            fontSize={prefs.fontSize}
          />
        )}
      />

      {/* 🔹 Sayfa ilerleme çubuğu */}
      <View style={[styles.progressContainer, { backgroundColor: `${color}15` }]}>
        <Animated.View style={[styles.progressBar, { backgroundColor: color }, progressStyle]} />
      </View>

      {/* 🔹 Sabit reklam alanı */}
      <AdBanner index={pageIndex} />
    </View>
  );
}

// 🔹 Stiller
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // alt reklam boşluğu
    backfaceVisibility: "hidden",
  },
  progressContainer: {
    height: 4,
    width: "100%",
    position: "absolute",
    bottom: 75, // reklamın üst kısmında
    left: 0,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  adWrapper: {
    width: "94%",
    height: 70,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 5,
    left: "3%",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
  },
  adImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  adBadge: {
    position: "absolute",
    top: 4,
    left: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 2,
  },
  adBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "500",
  },
});
