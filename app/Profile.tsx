import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // ✅ yönlendirme için
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useReaderStore } from "../src/store/useReaderStore";

export default function ProfileScreen() {
  const { prefs } = useReaderStore();
  const router = useRouter(); // ✅ yönlendirme için

  // 🔹 Tema renkleri
  const colors = {
    background:
      prefs.theme === "dark"
        ? "#000"
        : prefs.theme === "sepia"
        ? "#f5e6c8"
        : "#fff",
    text:
      prefs.theme === "dark"
        ? "#fff"
        : prefs.theme === "sepia"
        ? "#3b2f2f"
        : "#000",
    border:
      prefs.theme === "dark"
        ? "#222"
        : prefs.theme === "sepia"
        ? "#d3bfa5"
        : "#ddd",
    icon:
      prefs.theme === "dark"
        ? "#fff"
        : prefs.theme === "sepia"
        ? "#4b3f2f"
        : "#333",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Profil</Text>

      <View style={styles.infoSection}>
        <Text style={[styles.username, { color: colors.text }]}>
          Kullanıcı Adı
        </Text>
      </View>

      {/* 📚 Yeni seçenek: Kitaplarım */}
      <TouchableOpacity
        style={[styles.item, { borderColor: colors.border }]}
        onPress={() => router.push("/")} // Ana sayfa yönlendirmesi
      >
        <Ionicons name="book-outline" size={22} color={colors.icon} />
        <Text style={[styles.itemText, { color: colors.text }]}>Kitaplarım</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, { borderColor: colors.border }]}>
        <Ionicons name="notifications-outline" size={22} color={colors.icon} />
        <Text style={[styles.itemText, { color: colors.text }]}>
          Bildirimler
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, { borderColor: colors.border }]}>
        <Ionicons name="settings-outline" size={22} color={colors.icon} />
        <Text style={[styles.itemText, { color: colors.text }]}>Ayarlar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, { borderColor: colors.border }]}>
        <Ionicons name="help-circle-outline" size={22} color={colors.icon} />
        <Text style={[styles.itemText, { color: colors.text }]}>
          Yardım Merkezi
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, { borderColor: colors.border }]}>
        <Ionicons name="lock-closed-outline" size={22} color={colors.icon} />
        <Text style={[styles.itemText, { color: colors.text }]}>
          Gizlilik Politikası
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  infoSection: {
    marginBottom: 30,
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
