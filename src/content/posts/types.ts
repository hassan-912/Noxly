import type { Locale } from "../types";

/** A local image in `public/`, with alt text (and an optional caption) in the post's language. */
export type PostImage = { type: "image"; src: string; width: number; height: number; alt: string; caption?: string };

/** A paragraph (plain string), a bulleted list, or an image. */
export type PostBlock = string | { type: "list"; items: string[] } | PostImage;

/** One `<h2>` section of a post. `id` becomes the anchor and must be the same in every locale. */
export type PostSection = { id: string; title: string; blocks: PostBlock[] };

/** A post's text in one language. */
export type PostText = {
  title: string;
  /** One or two sentences: shown on the index, under the article title, and in search results. */
  summary: string;
  /** Paragraphs before the first section heading. */
  intro?: PostBlock[];
  sections: PostSection[];
};

export type Post = {
  /** URL segment: /{locale}/notes/{slug}/ */
  slug: string;
  /** ISO date, YYYY-MM-DD. */
  publishedAt: string;
  author: string;
  /** Drafts appear only in development and in test builds (SHOW_DRAFTS=1), never in production. */
  draft?: boolean;
  /** Pin this post to the Featured band on the index. Otherwise the newest post is featured. */
  featured?: boolean;
  text: Record<Locale, PostText>;
};
