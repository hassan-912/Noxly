export const locales = ["en", "de", "fr", "ar"] as const;
export type Locale = typeof locales[number];
export type Localized<T> = Record<Locale, T>;

export type ProjectSlug = "review" | "calculator" | "consultation" | "mg-mobile" | "crew-mg" | "mawid"
  | "voclio" | "femine-eg" | "treasure-hunt";
/**
 * Whether the live site can be shown inside the portfolio:
 * - `allowed`: it sends no header that forbids framing, so the viewer can embed it;
 * - `blocked-by-site`: its own headers (CSP `frame-ancestors`, `X-Frame-Options`) forbid it, so
 *   the viewer shows a screenshot and an "Open website" link instead (never a workaround);
 * - `no-public-url`: there is nothing public to show.
 */
export type EmbedStatus = "allowed" | "blocked-by-site" | "no-public-url";
export type StatusKey = "internal-tool" | "public-site" | "in-development" | "not-released"
  | "graduation-project" | "team-project";
export type TechId = string; // keys of tech.ts

export interface ProjectText {
  name: string;
  pitch: string;
  summary: string;
  problem?: string;
  contribution?: string;
  approach?: string;
  features?: string[];
  outcomes?: string[];
}

/**
 * Real screenshots of the project's public entry page (captured by scripts/capture-screenshots.ts),
 * as paths under `public/`. Never a mock-up.
 */
export interface Screenshots {
  desktop?: string;
  mobile?: string;
  alt: Localized<string>;
}

export interface Project {
  slug: ProjectSlug;
  tier: "featured" | "further" | "in-development";
  order: number;
  repo: string | null;
  liveUrl: string | null;
  embed: EmbedStatus;
  screenshots: Screenshots | null;
  previews?: { id: string; label: Localized<string>; liveUrl: string; screenshots: Screenshots }[];
  stack: TechId[];
  status: StatusKey[];
  authorship: { kind: "solo" } | { kind: "shared"; note: Localized<string> };
  caseStudy: boolean;
  text: Localized<ProjectText>;
}
