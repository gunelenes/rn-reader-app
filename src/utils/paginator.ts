export function paginate(text: string | undefined, maxChars = 1800) {
  if (!text || text.length === 0) return [""];
  const pages: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + maxChars, text.length);
    const soft = text.lastIndexOf(". ", end);
    if (soft > start + maxChars * 0.6) end = soft + 1;
    pages.push(text.slice(start, end).trim());
    start = end;
  }
  return pages;
}
