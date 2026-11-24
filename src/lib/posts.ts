import { allPosts, type Post, type PostBlock, type PostText } from "@/content/posts";
import type { Locale } from "@/content/types";

/** Drafts show while developing and in test builds, never in a normal production build. */
export function showDrafts(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.SHOW_DRAFTS === "1";
}

/** Visible posts, newest first. */
export function getPosts(): Post[] {
  return allPosts
    .filter((post) => showDrafts() || !post.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

/** The pinned post, or the newest one. */
export function getFeaturedPost(posts: Post[] = getPosts()): Post | undefined {
  return posts.find((post) => post.featured) ?? posts[0];
}

/** Up to `count` other posts to read next, newest first. */
export function getRelatedPosts(slug: string, count = 3): Post[] {
  return getPosts().filter((post) => post.slug !== slug).slice(0, count);
}

function blockText(block: PostBlock): string {
  if (typeof block === "string") return block;
  if (block.type === "list") return block.items.join(" ");
  return block.caption ?? "";
}

/** Reading time at 200 words a minute, at least one minute. */
export function readingMinutes(text: PostText): number {
  const parts = [text.title, text.summary, ...(text.intro ?? []).map(blockText)];
  for (const section of text.sections) parts.push(section.title, ...section.blocks.map(blockText));
  const words = parts.join(" ").trim().split(/\s+/u).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** e.g. "Nov 13, 2026" in the reader's language. Dates are pinned to UTC so they never shift a day. */
export function formatPostDate(locale: Locale, iso: string, month: "short" | "long" = "short"): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month, year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T12:00:00Z`),
  );
}
