import type { Dictionary } from "@/content/i18n";
import type { Locale } from "@/content/types";

/** Home-page section anchors, in page order. Later tasks render sections with exactly these ids. */
export const sectionIds = ["work", "services", "story", "projects", "building", "contact"] as const;
export type SectionId = (typeof sectionIds)[number];

export interface NavLink {
  id: SectionId | "systems" | "notes";
  href: string;
  label: string;
}

/** Anchor links that work from any page of the locale (home or case study). */
export function navLinks(locale: Locale, dict: Dictionary): NavLink[] {
  const ids = ["work", "systems", "services", "story", "projects", "building", "notes", "contact"] as const;
  return ids.map((id) => ({ id, href: id === "systems" || id === "notes" ? `/${locale}/${id}/` : `/${locale}/#${id}`, label: dict.nav[id] }));
}
