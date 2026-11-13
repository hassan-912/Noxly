import { locales, type Locale, type Project, type ProjectSlug } from "@/content/types";
import { dictionaries, type Dictionary } from "@/content/i18n";
import { projects } from "@/content/projects";

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function isLocale(x: string): x is Locale {
  return (locales as readonly string[]).includes(x);
}

export function dirOf(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

/**
 * The same page in another locale: swaps the leading locale segment of `pathname`
 * (e.g. "/en/work/review/") and appends `hash`. Always ends the path with a slash.
 */
export function localizePath(pathname: string, locale: Locale, hash = ""): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) segments.shift();
  const rest = segments.length > 0 ? `${segments.join("/")}/` : "";
  return `/${locale}/${rest}${hash}`;
}

/** Projects sorted by `order`, optionally limited to one tier. */
export function getProjects(tier?: Project["tier"]): Project[] {
  return projects.filter((p) => !tier || p.tier === tier).sort((a, b) => a.order - b.order);
}

export function getProject(slug: ProjectSlug): Project {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`Unknown project: ${slug}`);
  return project;
}
