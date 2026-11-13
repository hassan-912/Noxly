export type HeadlinePart = { text: string; scramble: boolean };

/**
 * Splits a headline into words (for the stagger), and each word into parts, marking the parts
 * covered by `fragment` (the one piece that scrambles). The fragment may be a whole word, sit
 * inside a word, or span words. Joining every part with single spaces gives the headline back.
 */
export function splitHeadline(headline: string, fragment: string): HeadlinePart[][] {
  const from = fragment ? headline.indexOf(fragment) : -1;
  const to = from === -1 ? -1 : from + fragment.length;

  const words: HeadlinePart[][] = [];
  for (const match of headline.matchAll(/\S+/g)) {
    const word = match[0];
    const start = match.index;
    const a = Math.min(Math.max(from - start, 0), word.length);
    const b = Math.min(Math.max(to - start, 0), word.length);
    if (b <= a) {
      words.push([{ text: word, scramble: false }]);
      continue;
    }
    const parts: HeadlinePart[] = [];
    if (a > 0) parts.push({ text: word.slice(0, a), scramble: false });
    parts.push({ text: word.slice(a, b), scramble: true });
    if (b < word.length) parts.push({ text: word.slice(b), scramble: false });
    words.push(parts);
  }
  return words;
}
