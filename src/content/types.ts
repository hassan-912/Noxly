export const locales = ["en", "de", "fr", "ar"] as const;
export type Locale = typeof locales[number];
export type Localized<T> = Record<Locale, T>;

export type ProjectSlug = "review" | "calculator" | "consultation" | "mg-mobile" | "crew-mg" | "mawid"
  | "qr-studio" | "voclio" | "femine-eg" | "treasure-hunt" | "muscle-generator";
export type DemoId = "review" | "calculator" | "consultation" | "crew-mg" | "mg-mobile";
export type StatusKey = "internal-tool" | "public-site" | "in-development" | "not-released"
  | "graduation-project" | "client-store" | "study-project" | "personal-project" | "team-project";
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

export interface Project {
  slug: ProjectSlug;
  tier: "featured" | "further" | "in-development";
  order: number;
  repo: string | null;
  liveUrl: string | null;
  embeddable: boolean;
  demo: DemoId | null;
  stack: TechId[];
  status: StatusKey[];
  authorship: { kind: "solo" } | { kind: "shared"; note: Localized<string> };
  caseStudy: boolean;
  text: Localized<ProjectText>;
}

/**
 * Uses the English value for every locale.
 * TODO(task 11): every call is a placeholder; replace it with a real `{ en, de, fr, ar }` object.
 */
export function untranslated<T>(en: T): Localized<T> {
  return { en, de: en, fr: en, ar: en };
}
