export type Chapter = { id: number; title: string; content: string };
export type Book = {
  bookId: string;
  chapters: Chapter[];
  meta?: { createdAt: string; chapterCount: number; estimatedWords: number };
};
export type ReaderPrefs = { theme: "light" | "dark" | "sepia"; fontSize: number };

export type Progress = { bookId: string; chapterId: number; offset: number };
