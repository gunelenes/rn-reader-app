import { Dimensions } from "react-native";

/**
 * 🔹 Gerçek piksel tabanlı sayfa bölme sistemi
 * - Font boyutuna göre yüksekliği dinamik hesaplar
 * - Cümleleri kelime bazında böler
 * - Hiçbir kelime kaybolmaz
 */
export async function paginate(
  text: string,
  fontSize: number = 18,
  lineHeightMultiplier: number = 1.6
): Promise<string[]> {
  const { height, width } = Dimensions.get("window");

  // 🔸 Okuma alanını hesapla (başlık, progress bar, marginler düşülür)
  const usableHeight = height - 180; // yaklaşık 180px header + alt reklam boşluğu
  const lineHeight = fontSize * lineHeightMultiplier;
  const words = text.split(" ");

  const pages: string[] = [];
  let currentPage = "";
  let currentHeight = 0;

  // 🔹 Ortalama karakter genişliği tahmini (fontSize’a göre)
  const avgCharWidth = fontSize * 0.55;
  const maxCharsPerLine = Math.floor(width / avgCharWidth);

  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // 🔸 satır taşarsa
    if ((currentLine + " " + word).length > maxCharsPerLine) {
      currentHeight += lineHeight;
      currentLine = word;

      // 🔸 sayfa taşarsa
      if (currentHeight + lineHeight > usableHeight) {
        pages.push(currentPage.trim());
        currentPage = "";
        currentHeight = 0;
      } else {
        currentPage += "\n";
      }
    } else {
      currentLine += (currentLine ? " " : "") + word;
    }

    currentPage += word + " ";
  }

  if (currentPage.trim().length > 0) {
    pages.push(currentPage.trim());
  }

  return pages;
}
