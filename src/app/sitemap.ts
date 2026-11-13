import type { MetadataRoute } from "next";
import { locales } from "@/content/types";
import { getProjects } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/metadata";

export const dynamic = "force-static";

/**
 * Only public pages: each locale's home and its case studies. Anything else under
 * `[locale]` (e.g. the test-only demo lab) is deliberately left out.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...getProjects().filter((p) => p.caseStudy).map((p) => `/work/${p.slug}/`)];
  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: absoluteUrl(locale, path),
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(l, path)])) },
    })),
  );
}
