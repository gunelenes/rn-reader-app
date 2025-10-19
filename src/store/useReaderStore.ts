import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import type { Progress, ReaderPrefs } from "../types";

type State = { prefs: ReaderPrefs; progress: Record<string, Progress> };
type Actions = {
  hydrate: () => Promise<void>;
  setPrefs: (p: Partial<ReaderPrefs>) => void;
  saveProgress: (pg: Progress) => void;
};

const KEY = "reader_state_v1";

export const useReaderStore = create<State & Actions>((set, get) => ({
  // 🎨 Varsayılan tema artık "light"
  prefs: { theme: "light", fontSize: 18 },
  progress: {},

  // 🔁 Uygulama açıldığında veriyi AsyncStorage'dan yükler
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      set({
        prefs: parsed.prefs ?? { theme: "light", fontSize: 18 },
        progress: parsed.progress ?? {},
      });
    } catch (e) {
      console.warn("Okuma hatası:", e);
    }
  },

  // ⚙️ Kullanıcı ayarlarını (tema, font vb.) kaydeder
  setPrefs: (p) => {
    const next = { ...get().prefs, ...p };
    set({ prefs: next });
    AsyncStorage.setItem(
      KEY,
      JSON.stringify({ prefs: next, progress: get().progress })
    ).catch((e) => console.warn("Kaydetme hatası:", e));
  },

  // 📚 Kitap ilerlemesini kaydeder
  saveProgress: (pg) => {
    const next = { ...get().progress, [pg.bookId]: pg };
    set({ progress: next });
    AsyncStorage.setItem(
      KEY,
      JSON.stringify({ prefs: get().prefs, progress: next })
    ).catch((e) => console.warn("İlerleme kaydı hatası:", e));
  },
}));
