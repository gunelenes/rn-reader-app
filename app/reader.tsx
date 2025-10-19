import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, View } from "react-native";
import bookData from "../data/books/eybar.chapters.json";
import Reader from "../src/components/Reader";
import { useReaderStore } from "../src/store/useReaderStore";
import type { Book } from "../src/types";

export default function ReaderScreen() {
  const { bookId, chapterId } = useLocalSearchParams<{ bookId: string; chapterId: string }>();
  const prefs = useReaderStore((s) => s.prefs);
  const book: Book = bookData as Book;

  // Başlangıçta hangi bölümden başlayacağını belirle
  const initIdx = Math.max(0, parseInt(chapterId ?? "1") - 1);
  const [idx, setIdx] = useState(initIdx);
  const chapter = useMemo(() => book.chapters[idx] ?? book.chapters[0], [idx]);

  // ✅ Bu iki fonksiyon eksikti
  const goPrev = () => {
    if (idx <= 0) return Alert.alert("İlk bölümdesin");
    setIdx((i) => i - 1);
  };

  const goNext = () => {
    if (idx >= book.chapters.length - 1) return Alert.alert("Son bölümdesin");
    setIdx((i) => i + 1);
  };

  return (
    <View style={{ flex: 1, backgroundColor: prefs.theme === "dark" ? "#000" : "#fff" }}>
      <Reader
        bookId={book.bookId}
        chapterId={chapter?.id ?? 1}
        title={chapter?.title ?? ""}
        content={chapter?.content ?? ""}
        onPrev={goPrev}     // ✅ fonksiyon gönderiliyor
        onNext={goNext}     // ✅ fonksiyon gönderiliyor
      />
    </View>
  );
}
