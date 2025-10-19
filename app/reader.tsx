import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import bookData from "../data/books/eybar.chapters.json";
import Reader from "../src/components/Reader";
import { useReaderStore } from "../src/store/useReaderStore";

export default function ReaderScreen() {
  const { bookId, chapterId } = useLocalSearchParams<{
    bookId: string;
    chapterId: string;
  }>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [chapterIndex, setChapterIndex] = useState(Number(chapterId || 0));
  const { prefs, setPrefs } = useReaderStore();
  const book = bookData as any;
  const currentChapter = book.chapters[chapterIndex];

  const goPrev = () => {
    if (chapterIndex > 0) setChapterIndex((i) => i - 1);
  };
  const goNext = () => {
    if (chapterIndex < book.chapters.length - 1) setChapterIndex((i) => i + 1);
  };

  const bg =
    prefs.theme === "dark"
      ? "#000"
      : prefs.theme === "sepia"
      ? "#f5e6c8"
      : "#fff";
  const color =
    prefs.theme === "dark"
      ? "#fff"
      : prefs.theme === "sepia"
      ? "#4b3f2f"
      : "#000";

  // 🔹 Yazı boyutu ayarları
  const increaseFont = () => {
    if (prefs.fontSize < 28) setPrefs({ fontSize: prefs.fontSize + 2 });
  };

  const decreaseFont = () => {
    if (prefs.fontSize > 12) setPrefs({ fontSize: prefs.fontSize - 2 });
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Üst bar */}
      <View style={styles.header}>
        {/* ☰ Bölümler butonu */}
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          style={styles.menuButton}
        >
          <Ionicons name="menu-outline" size={26} color={color} />
          <Text style={[styles.headerText, { color }]}>Bölümler</Text>
        </TouchableOpacity>

        {/* Yazı boyutu butonları */}
        <View style={styles.fontControls}>
          <TouchableOpacity onPress={decreaseFont} style={styles.fontButton}>
            <Text style={[styles.fontButtonText, { color }]}>A⁻</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={increaseFont} style={styles.fontButton}>
            <Text style={[styles.fontButtonText, { color }]}>A⁺</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Kitap içeriği */}
      <Reader
        bookId={book.bookId}
        chapterId={chapterIndex}
        title={currentChapter.title}
        content={currentChapter.content}
        onPrev={goPrev}
        onNext={goNext}
      />

      {/* Bölüm listesi Modal */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: bg }]}>
            <Text style={[styles.modalTitle, { color }]}>Bölümler</Text>
            <FlatList
              data={book.chapters}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.chapterItem}
                  onPress={() => {
                    setChapterIndex(index);
                    setMenuVisible(false);
                  }}
                >
                  <Text
                    style={{
                      color: index === chapterIndex ? "#c33" : color,
                      fontWeight: index === chapterIndex ? "700" : "500",
                    }}
                  >
                    {index + 1}. {item.title}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.closeButton, { borderColor: color }]}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={{ color }}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "500",
  },
  fontControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fontButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  fontButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    borderRadius: 10,
    padding: 20,
    maxHeight: "70%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  chapterItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  closeButton: {
    marginTop: 15,
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
});
