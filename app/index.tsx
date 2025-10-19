import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import bookData from "../data/books/eybar.chapters.json";
import { useReaderStore } from "../src/store/useReaderStore";
import type { Book } from "../src/types";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const hydrate = useReaderStore(s => s.hydrate);

  useEffect(() => {
    hydrate();
    setBooks([bookData as Book]);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 12 }}>Kitaplar</Text>
      <FlatList
        data={books}
        keyExtractor={(b) => b.bookId}
        renderItem={({ item }) => (
          <Link href={{ pathname: "/reader", params: { bookId: item.bookId, chapterId: "1" } }} asChild>
            <Pressable style={{ padding: 16, backgroundColor: "#eee", borderRadius: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.bookId}</Text>
              <Text style={{ opacity: 0.6 }}>{item.meta?.chapterCount ?? item.chapters.length} bölüm</Text>
            </Pressable>
          </Link>
        )}
      />
      <Link href="/settings"><Text style={{ textAlign: "center", marginTop: 8 }}>Ayarlar</Text></Link>
    </View>
  );
}
