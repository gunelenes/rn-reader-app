import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useReaderStore } from "../src/store/useReaderStore";

export default function Layout() {
  const { prefs, setPrefs } = useReaderStore();
  const router = useRouter();

  const toggleTheme = () => {
    const next =
      prefs.theme === "light"
        ? "sepia"
        : prefs.theme === "sepia"
        ? "dark"
        : "light";
    setPrefs({ theme: next });
  };

  const getEmoji = () => {
    switch (prefs.theme) {
      case "dark":
        return "🌙";
      case "sepia":
        return "☕";
      default:
        return "☀️";
    }
  };

  const getHeaderBg = () => {
    switch (prefs.theme) {
      case "dark":
        return "#000";
      case "sepia":
        return "#f5e6c8";
      default:
        return "#fff";
    }
  };

  const getHeaderColor = () => {
    switch (prefs.theme) {
      case "dark":
        return "#fff";
      case "sepia":
        return "#4b3f2f";
      default:
        return "#000";
    }
  };

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: getHeaderBg(),
          },
          headerTintColor: getHeaderColor(),
          headerTitleStyle: {
            fontWeight: "600",
          },
          // 🔹 Sağ üstteki butonlar (tema + profil)
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Tema değiştirme */}
              <Pressable onPress={toggleTheme} style={{ paddingHorizontal: 8 }}>
                <Text
                  style={{
                    color: getHeaderColor(),
                    fontSize: 18,
                    marginRight: 4,
                  }}
                >
                  {getEmoji()}
                </Text>
              </Pressable>

              {/* Profil simgesi */}
              <Pressable
                onPress={() => router.push("/Profile")}
                style={{ paddingHorizontal: 8 }}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={26}
                  color={getHeaderColor()}
                />
              </Pressable>
            </View>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ title: "Kütüphane" }} />
        <Stack.Screen name="reader" options={{ title: "Okuyucu" }} />
        <Stack.Screen name="settings" options={{ title: "Ayarlar" }} />
        <Stack.Screen name="profile" options={{ title: "Profil" }} /> {/* ✅ eklendi */}
      </Stack>
    </SafeAreaProvider>
  );
}
