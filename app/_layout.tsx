import { Stack } from "expo-router";
import { Pressable, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useReaderStore } from "../src/store/useReaderStore";

export default function Layout() {
  const { prefs, setPrefs } = useReaderStore();

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
          headerRight: () => (
            <Pressable onPress={toggleTheme} style={{ paddingHorizontal: 12 }}>
              <Text style={{ color: getHeaderColor(), fontSize: 18 }}>{getEmoji()}</Text>
            </Pressable>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ title: "Kütüphane" }} />
        <Stack.Screen name="reader" options={{ title: "Okuyucu" }} />
        <Stack.Screen name="settings" options={{ title: "Ayarlar" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
