import { Pressable, Text, View } from "react-native";
import { useReaderStore } from "../src/store/useReaderStore";

export default function Settings() {
  const { prefs, setPrefs } = useReaderStore();

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Ayarlar</Text>

      <View style={{ gap: 8 }}>
        <Text>Tema: {prefs.theme}</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable onPress={() => setPrefs({ theme: "light" })} style={{ padding: 10, backgroundColor: "#eee", borderRadius: 12 }}>
            <Text>Açık</Text>
          </Pressable>
          <Pressable onPress={() => setPrefs({ theme: "dark" })} style={{ padding: 10, backgroundColor: "#eee", borderRadius: 12 }}>
            <Text>Koyu</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Text>Yazı Boyutu: {prefs.fontSize}</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable onPress={() => setPrefs({ fontSize: Math.max(14, prefs.fontSize - 2) })}
            style={{ padding: 10, backgroundColor: "#eee", borderRadius: 12 }}>
            <Text>−</Text>
          </Pressable>
          <Pressable onPress={() => setPrefs({ fontSize: Math.min(28, prefs.fontSize + 2) })}
            style={{ padding: 10, backgroundColor: "#eee", borderRadius: 12 }}>
            <Text>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
