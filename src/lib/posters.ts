import { existsSync } from "node:fs";
import path from "node:path";
import type { ProjectSlug } from "@/content/types";

/**
 * The committed poster of a live site (`public/posters/<slug>.webp`, captured by
 * `scripts/capture-posters.ts`), or null when none was captured; `LiveEmbed` then shows its
 * designed fallback card. Build-time only: call it from server components.
 */
export function posterFor(slug: ProjectSlug): string | null {
  const file = `/posters/${slug}.webp`;
  return existsSync(path.join(process.cwd(), "public", file)) ? file : null;
}
