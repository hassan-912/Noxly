import { describe, expect, test } from "vitest";
import { scrambleFrame } from "@/lib/motion";
import { splitHeadline } from "@/components/hero/headline";
import { dictionaries } from "@/content/i18n";
import { locales } from "@/content/types";

/** Deterministic rng so the frames are reproducible. */
function seeded(seed = 1): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

describe("scrambleFrame", () => {
  test("scrambleFrame at progress 1 returns target exactly", () => {
    for (const target of ["simpler", "plus simple", "أبسط", "Einfacher."]) {
      expect(scrambleFrame(target, 1, seeded())).toBe(target);
      expect(scrambleFrame(target, 1.4, seeded())).toBe(target);
    }
  });

  test("scrambleFrame keeps spaces and length", () => {
    const target = "feel much simpler";
    for (const progress of [0, 0.2, 0.5, 0.9]) {
      const frame = scrambleFrame(target, progress, seeded(7));
      expect(Array.from(frame)).toHaveLength(Array.from(target).length);
      expect(frame[4]).toBe(" ");
      expect(frame[9]).toBe(" ");
      expect(frame.replace(/ /g, "")).not.toMatch(/\s/);
    }
  });

  test("scrambleFrame reveals left-to-right in logical order", () => {
    for (const target of ["simpler", "أبسط وأوضح"]) {
      const chars = Array.from(target);
      for (const progress of [0, 0.1, 0.35, 0.5, 0.75, 0.99, 1]) {
        const frame = Array.from(scrambleFrame(target, progress, seeded(3)));
        chars.forEach((char, i) => {
          if (i < progress * chars.length) expect(frame[i], `${target} @${progress} [${i}]`).toBe(char);
        });
      }
    }
  });

  test("scrambleFrame scrambles within the script of the target", () => {
    expect(scrambleFrame("simpler", 0, seeded())).toMatch(/^[a-z]{7}$/);
    expect(scrambleFrame("أبسط", 0, seeded())).toMatch(/^[ء-ي]{4}$/);
  });
});

describe("splitHeadline", () => {
  const text = (words: ReturnType<typeof splitHeadline>) =>
    words.map((word) => word.map((part) => part.text).join("")).join(" ");

  test("marks only the fragment and keeps the headline exact", () => {
    const words = splitHeadline("Software that makes work feel simpler.", "simpler");
    expect(words).toHaveLength(6);
    expect(words[5]).toEqual([
      { text: "simpler", scramble: true },
      { text: ".", scramble: false },
    ]);
    expect(words.slice(0, 5).flat().every((part) => !part.scramble)).toBe(true);
    expect(text(words)).toBe("Software that makes work feel simpler.");
  });

  test("handles a fragment inside a word, across words, and a missing fragment", () => {
    expect(splitHeadline("Arbeit wird vereinfacht.", "einfach")[2]).toEqual([
      { text: "ver", scramble: false },
      { text: "einfach", scramble: true },
      { text: "t.", scramble: false },
    ]);
    const across = splitHeadline("Du travail plus simple.", "plus simple");
    expect(across.flat().filter((part) => part.scramble).map((part) => part.text)).toEqual(["plus", "simple"]);
    expect(text(across)).toBe("Du travail plus simple.");
    expect(splitHeadline("No match here", "simpler").flat().some((part) => part.scramble)).toBe(false);
  });

  test("the scramble word of every locale appears verbatim in its headline", () => {
    for (const locale of locales) {
      const { headline, scrambleWord } = dictionaries[locale].hero;
      expect(headline, locale).toContain(scrambleWord);
      expect(text(splitHeadline(headline, scrambleWord)), locale).toBe(headline);
    }
  });
});
