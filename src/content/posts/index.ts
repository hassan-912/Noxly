import type { Post } from "./types";
import { buildingWithAi } from "./building-with-ai-still-needs-engineering";

/**
 * Every post, published or draft. To add one: create `src/content/posts/<slug>.ts`
 * exporting a `Post`, then list it here. Order does not matter; posts are sorted by date.
 */
export const allPosts: Post[] = [buildingWithAi];

export type { Post, PostBlock, PostImage, PostSection, PostText } from "./types";
