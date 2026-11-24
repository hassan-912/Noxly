import { existsSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import { allPosts } from "@/content/posts";
import { notesCopy } from "@/content/notes";
import { locales } from "@/content/types";
import { formatPostDate, getFeaturedPost, getPosts, readingMinutes } from "@/lib/posts";

describe("post files", () => {
  test("slugs are unique and URL-safe", () => {
    const slugs = allPosts.map((post) => post.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  test("dates are real YYYY-MM-DD dates", () => {
    for (const post of allPosts) {
      expect(post.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(`${post.publishedAt}T00:00:00Z`).toISOString().slice(0, 10)).toBe(post.publishedAt);
    }
  });

  test("every locale has a title, summary and the same section ids", () => {
    for (const post of allPosts) {
      const ids = post.text.en.sections.map((section) => section.id);
      expect(new Set(ids).size, post.slug).toBe(ids.length);
      for (const locale of locales) {
        const text = post.text[locale];
        expect(text.title.trim(), `${post.slug} ${locale}`).not.toBe("");
        expect(text.summary.trim(), `${post.slug} ${locale}`).not.toBe("");
        expect(text.sections.map((section) => section.id), `${post.slug} ${locale}`).toEqual(ids);
      }
    }
  });

  test("images point at files in public/ and have alt text", () => {
    for (const post of allPosts) {
      for (const locale of locales) {
        const text = post.text[locale];
        const blocks = [...(text.intro ?? []), ...text.sections.flatMap((section) => section.blocks)];
        for (const block of blocks) {
          if (typeof block === "string" || block.type !== "image") continue;
          expect(existsSync(path.join(process.cwd(), "public", block.src)), block.src).toBe(true);
          expect(block.alt.trim()).not.toBe("");
        }
      }
    }
  });

  test("interface copy has the same keys in every locale", () => {
    for (const locale of locales) expect(Object.keys(notesCopy[locale]).sort()).toEqual(Object.keys(notesCopy.en).sort());
  });
});

describe("visible posts", () => {
  afterEach(() => vi.unstubAllEnvs());

  test("drafts are hidden from a production build unless SHOW_DRAFTS=1", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SHOW_DRAFTS", "");
    expect(getPosts().some((post) => post.draft)).toBe(false);
    vi.stubEnv("SHOW_DRAFTS", "1");
    expect(getPosts()).toHaveLength(allPosts.length);
  });

  test("posts are newest first and the featured post is pinned or the newest", () => {
    vi.stubEnv("SHOW_DRAFTS", "1");
    const posts = getPosts();
    const dates = posts.map((post) => post.publishedAt);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(getFeaturedPost(posts)).toBe(posts.find((post) => post.featured) ?? posts[0]);
  });
});

test("reading time counts at least a minute", () => {
  expect(readingMinutes({ title: "A", summary: "B", sections: [] })).toBe(1);
  const long = Array.from({ length: 450 }, () => "word").join(" ");
  expect(readingMinutes({ title: "A", summary: "B", sections: [{ id: "s", title: "S", blocks: [long] }] })).toBe(3);
});

test("dates format in the reader's language without shifting a day", () => {
  expect(formatPostDate("en", "2026-01-01")).toBe("Jan 1, 2026");
  expect(formatPostDate("de", "2026-01-01", "long")).toBe("1. Januar 2026");
});
